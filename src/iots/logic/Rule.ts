import { Rule } from "../rules";
import {
  PicoIfCondition,
  PicoConditionEquality,
  PicoConditionLike,
  PicoAndCondition,
  PicoOrCondition
} from "../conditions";
import { PicoActionCollection, PicoAction, PicoActionSetVar, PicoActionRule } from "../actions";
import { PicoContext } from "./Context";

import createDebugLog, { Debugger } from "debug";
const debug = createDebugLog("logic");

interface IPicoExec {
  exec(ctx: PicoContext): boolean;
}
export class PicoRule implements IPicoExec {
  static async generate(rule: Rule) {
    // const decodedRule = await tPromise.decode(Rule, rule);

    const pif = await PicoIf.generate(rule.if);
    const pthen = await PicoThen.generate(rule.then);
    const pelse = await PicoElse.generate(rule.else);

    return new PicoRule(pif, pthen, pelse, rule.label);
  }

  debug: Debugger = debug.extend("rule");

  constructor(private pIf: PicoIf, private pThen: PicoThen, private pElse: PicoElse, private label: string) {}

  public exec(ctx: PicoContext) {
    this.debug("exec: " + this.label);
    if (this.pIf.exec(ctx)) {
      this.pThen.exec(ctx);
    } else {
      this.pElse.exec(ctx);
    }
    return true;
  }
}

export abstract class PicoIf implements IPicoExec {
  static async generate(pif: PicoIfCondition): Promise<PicoIf> {
    switch (pif.op) {
      case "eq":
        return PicoIfEquality.generate(pif);
        break;
      case "like":
        return PicoIfLike.generate(pif);
        break;
      case "and":
        return PicoAnd.generate(pif);
        break;
      case "or":
        return PicoOr.generate(pif);
        break;
    }

    return PicoIfNone.generate();
  }

  abstract exec(ctx: PicoContext): boolean;

  debug: Debugger = debug.extend("if");
}

export class PicoIfNone extends PicoIf {
  static async generate() {
    return new PicoIfNone();
  }

  public exec(ctx: PicoContext) {
    return false;
  }
}

export class PicoIfEquality extends PicoIf {
  static async generate(pConditionEquality: PicoConditionEquality): Promise<PicoIf> {
    return new PicoIfEquality(pConditionEquality.token, pConditionEquality.value);
  }

  constructor(private token: string, private value: string) {
    super();
    this.debug = this.debug.extend("eq");
  }
  exec(ctx: PicoContext) {
    const result = ctx.getVar(this.token) === this.value;
    this.debug(`exec ${this.token} == ${this.value} / ${result}`);
    return result;
  }
}

export class PicoIfLike extends PicoIf {
  static async generate(pConditionLike: PicoConditionLike): Promise<PicoIf> {
    return new PicoIfLike(pConditionLike.token, pConditionLike.value);
  }

  constructor(private token: string, private value: string) {
    super();
    this.debug = this.debug.extend("like");
  }

  exec(ctx: PicoContext) {
    this.debug(`exec ${this.token} / ${this.value}`);
    return false;
  }
}

export class PicoAnd extends PicoIf {
  static async generate(pConditionAnd: PicoAndCondition): Promise<PicoIf> {
    const conditionPromises = pConditionAnd.conditions.map(pc => PicoIf.generate(pc));

    const conditions = await Promise.all(conditionPromises);

    return new PicoAnd(conditions);
  }

  constructor(private pConditions: PicoIf[]) {
    super();
    this.debug = this.debug.extend("and");
  }

  exec(ctx: PicoContext) {
    this.debug(`exec [] ${this.pConditions.length}`);
    const result = this.pConditions.every(pc => pc.exec(ctx) === true);
    return result;
  }
}

export class PicoOr extends PicoIf {
  static async generate(pConditionsOr: PicoOrCondition): Promise<PicoIf> {
    const conditionPromises = pConditionsOr.conditions.map(pc => PicoIf.generate(pc));
    const conditions = await Promise.all(conditionPromises);

    return new PicoOr(conditions);
  }

  constructor(private pConditions: PicoIf[]) {
    super();
    this.debug = this.debug.extend("or");
  }

  exec(ctx: PicoContext) {
    this.debug(`exec [] ${this.pConditions.length}`);
    const found = this.pConditions.find(pc => pc.exec(ctx) === true) ? true : false;
    return found;
  }
}
export abstract class Action implements IPicoExec {
  static async generate(po: PicoAction): Promise<Action> {
    switch (po.act) {
      case "setvar":
        return ActionSetVar.generate(po);
        break;
      case "rule":
        return ActionRule.generate(po);
        break;
    }
    throw new Error("unknown: ");
  }

  abstract exec(ctx: PicoContext): boolean;

  debug: Debugger = debug.extend("action");
}

export class ActionRule extends Action {
  static async generate(picoActionRule: PicoActionRule) {
    const picoRule = await PicoRule.generate(picoActionRule.rule);
    return new ActionRule(picoRule);
  }
  constructor(private rule: PicoRule) {
    super();
    this.debug = this.debug.extend("rule");
  }

  public exec(ctx: PicoContext) {
    this.debug(`exec`);
    return this.rule.exec(ctx);
  }
}

export class ActionSetVar extends Action {
  static async generate(picoActionSetVar: PicoActionSetVar) {
    return new ActionSetVar(picoActionSetVar.varName, picoActionSetVar.varValue);
  }

  constructor(private varName: string, private varValue: string) {
    super();
    this.debug = this.debug.extend("setvar");
  }

  public exec(ctx: PicoContext) {
    this.debug(`exec name=${this.varName}, value=${this.varValue}`);
    return true;
  }
}

export class PicoThen implements IPicoExec {
  static async generate(actions: PicoActionCollection): Promise<PicoThen> {
    const actionPromises = actions.map(po => Action.generate(po));
    const thens = await Promise.all(actionPromises);
    return new PicoThen(thens);
  }

  debug: Debugger = debug.extend("then");

  constructor(private readonly actions: Action[]) {}

  public exec(ctx: PicoContext) {
    this.debug(`exec`);
    this.actions.every(action => action.exec(ctx));
    return true;
  }
}

export class PicoElse implements IPicoExec {
  static async generate(actions: PicoActionCollection): Promise<PicoElse> {
    const actionPromises = actions.map(po => Action.generate(po));
    const elses = await Promise.all(actionPromises);
    return new PicoElse(elses);
  }

  debug: Debugger = debug.extend("else");
  constructor(private readonly actions: Action[]) {}

  public exec(ctx: PicoContext) {
    this.debug(`exec`);
    this.actions.every(action => action.exec(ctx));
    return true;
  }
}
