import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { inspect } from "util";

import { Rule } from "./pico";

const ruleDoc = {
  rule: {
    entry: [
      { __op: "eq" },
      { __op: "list", conditions: [{ __op: "list", traversal: "and", conditions: [{ __op: "eq" }] }] }
    ]
  }
};

const rule = plainToClass(Rule, ruleDoc.rule);

console.log("Rule= " + inspect(rule, false, 22));
