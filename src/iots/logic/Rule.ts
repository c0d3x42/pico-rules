import * as tPromise from "io-ts-promise";
import { Rule } from "../rules";
import {
  PicoIfCondition,
  PicoConditionEquality,
  PicoConditionLike,
  PicoAndCondition,
  PicoOrCondition
} from "../conditions";
import { OpConditions, AllConditionTypes } from "../conditions/op";
import { PicoActionCollection, PicoAction, PicoActionSetVar, PicoActionRule } from "../actions";

interface IPicoExec {
  exec(): boolean;
}
export class PicoRule implements IPicoExec {
  static async generate(rule: Rule) {
    // const decodedRule = await tPromise.decode(Rule, rule);

    const pif = await PicoIf.generate(rule.if);
    const pthen = await PicoThen.generate(rule.then);
    const pelse = await PicoElse.generate(rule.else);

    return new PicoRule(pif, pthen, pelse, rule.label);
  }

  constructor(private pIf: PicoIf, private pThen: PicoThen, private pElse: PicoElse, private label: string) {}

  public exec() {
    console.log("executing: " + this.label);
    if (this.pIf.exec()) {
      console.log("Rule THEN");
      this.pThen.exec();
    } else {
      console.log("Rule ELSE");
      this.pElse.exec();
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

  abstract exec(): boolean;
}

export class PicoIfNone extends PicoIf {
  static async generate() {
    return new PicoIfNone();
  }

  public exec() {
    return false;
  }
}

export class PicoIfEquality extends PicoIf {
  static async generate(pConditionEquality: PicoConditionEquality): Promise<PicoIf> {
    return new PicoIfEquality(pConditionEquality.token, pConditionEquality.value);
  }

  constructor(private token: string, private value: string) {
    super();
  }
  exec() {
    return false;
  }
}

export class PicoIfLike extends PicoIf {
  static async generate(pConditionLike: PicoConditionLike): Promise<PicoIf> {
    return new PicoIfLike(pConditionLike.token, pConditionLike.value);
  }

  constructor(private token: string, private value: string) {
    super();
  }

  exec() {
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
  }

  exec() {
    const result = this.pConditions.every(pc => pc.exec() === true);
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
  }

  exec() {
    const found = this.pConditions.find(pc => pc.exec() === true) ? true : false;
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

  abstract exec(): boolean;
}

export class ActionRule extends Action {
  static async generate(picoActionRule: PicoActionRule) {
    const picoRule = await PicoRule.generate(picoActionRule.rule);
    return new ActionRule(picoRule);
  }
  constructor(private rule: PicoRule) {
    super();
  }

  public exec() {
    return this.rule.exec();
  }
}

export class ActionSetVar extends Action {
  static async generate(picoActionSetVar: PicoActionSetVar) {
    return new ActionSetVar(picoActionSetVar.varName, picoActionSetVar.varValue);
  }

  constructor(private varName: string, private varValue: string) {
    super();
  }

  public exec() {
    return true;
  }
}

export class PicoThen implements IPicoExec {
  static async generate(actions: PicoActionCollection): Promise<PicoThen> {
    const actionPromises = actions.map(po => Action.generate(po));
    const thens = await Promise.all(actionPromises);
    return new PicoThen(thens);
  }

  constructor(private readonly actions: Action[]) {}

  public exec() {
    this.actions.every(action => action.exec());
    return true;
  }
}

export class PicoElse implements IPicoExec {
  static async generate(actions: PicoActionCollection): Promise<PicoElse> {
    const actionPromises = actions.map(po => Action.generate(po));
    const elses = await Promise.all(actionPromises);
    return new PicoElse(elses);
  }

  constructor(private readonly actions: Action[]) {}

  public exec() {
    this.actions.every(action => action.exec());
    return true;
  }
}
