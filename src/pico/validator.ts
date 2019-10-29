import ajv, { Ajv, ValidateFunction } from "ajv";
import { inspect } from "util";

import { debug as debugLogger } from "debug";
const debug = debugLogger("schema:validation");

const SCHEMAS = [
  "uuid.json",
  "rule.json",
  // "opcondition.json",
  "action.json",
  //  "action.rule.json",
  //  "action.setvar.json",
  //  "action.template.json",
  "condition.json",
  //  "condition.eq.json",
  // "condition.like.json",
  // "condition.list.json",
];
const EngineSchema = "engine.json";

export class PicoValidator {
  ajv: Ajv;
  validator: ValidateFunction;

  constructor(private readonly schemaDir = "schemas") {
    this.ajv = new ajv();

    const m = SCHEMAS.map(s => {
      debug("Adding... " + s);
      return require(this.schemaDir + "/" + s);
    });

    this.validator = this.ajv.addSchema(m).compile(require(this.schemaDir + "/" + EngineSchema));
  }

  public validateMe(rulesJson: any) {
    const r = this.validator(rulesJson);
    console.log("R = ", r);
    console.log("  = ", inspect(this.validator.errors, false, 12));
  }

  public validateCondition(conditionJson: any) {
    const r = this.ajv.validate("pico/schemas/condition.json", conditionJson);
    console.log("C = ", r);
    console.log("  = ", inspect(this.ajv.errors, false, 12));
  }

  public validateAction(actionJson: any) {
    const r = this.ajv.validate("pico/schemas/action.json", actionJson);
  }
}
