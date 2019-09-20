import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { inspect } from "util";
import { validate } from "class-validator";

import { Rule } from "./pico";

const ruleDoc = {
  rule: {
    label: "some rule",
    entry: [
      { op: "eq", token: "node", value: "localhost", lop: 1 },
      {
        op: "list",
        conditions: [{ op: "list", traversal: "and", conditions: [{ op: "eq", token: "group", value: "production" }] }]
      }
    ]
  }
};

//const rule = plainToClass(Rule, ruleDoc.rule, { excludeExtraneousValues: false });
const rule = plainToClass(Rule, ruleDoc.rule, { excludeExtraneousValues: true });

console.log("Rule= " + inspect(rule, false, 22));

validate(rule)
  .then(validatedRule => {
    console.log("Rule validated" + validatedRule);
  })
  .catch(err => {
    console.log("Failed validations\n" + err);
  });
