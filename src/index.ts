import "reflect-metadata";
import { plainToClass, classToPlain } from "class-transformer";
import { inspect } from "util";
import { validate } from "class-validator";

import { Rule, PicoEngine } from "./pico";
import { Context } from "./pico/context";

const ruleDoc = {
  label: "some rule",
  if: [
    { op: "like", token: "summary", value: "(?<first>[a-z]+) (?<second>[a-z]+)" },
    { op: "eq", token: "node", value: "localhost", lop: 1 },
    {
      op: "list",
      conditions: [{ op: "list", traversal: "and", conditions: [{ op: "eq", token: "group", value: "production" }] }]
    }
  ],
  then: [
    { act: "setvar", varName: "pop", varValue: "john" },
    {
      act: "rule",
      rule: { label: "subrule", if: [{ op: "eq", token: "customer", value: "GM" }], then: [], else: [] }
    }
  ],
  else: []
};

const picoRules = { main: [ruleDoc] };

//const rule = plainToClass(Rule, ruleDoc.rule, { excludeExtraneousValues: false });
const rule = plainToClass(PicoEngine, picoRules, { excludeExtraneousValues: true });

console.log("Rule= " + inspect(rule, false, 22));

validate(rule)
  .then(validatedRule => {
    console.log("Rule validated" + validatedRule);

    let context = new Context();
    context.tokens.set("node", "localhost");
    context.tokens.set("summary", "hello world");

    rule.exec(context);
    const plain = classToPlain(rule);
    console.log("PLAIN1: " + inspect(plain, false, 22));
  })
  .catch(err => {
    console.log("Failed validations\n" + err);
  });
