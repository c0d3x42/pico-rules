import * as t from "io-ts";
import * as tPromise from "io-ts-promise";

import { Rule } from "./rules";
import { inspect } from "util";

/*
const PicoCondition = t.type({ label: t.string });
const PicoConditions = t.array(PicoCondition);
*/

const plainRule = {
  label: "lop",
  if: {
    op: "or",
    conditions: [
      { op: "eq", token: "t", value: "v" },
      { op: "and", conditions: [] }
    ]
  },
  then: [{ act: "setvar", varName: "n1", varValue: "v1" }],
  else: []
};

const r1 = Rule.decode(plainRule);
console.log("R1 = ", r1);

const r = tPromise.decode(Rule, plainRule);

r.then(rule => {
  console.log("R = ", inspect(rule, false, 5));

  if (rule.if.op === "and") {
    rule.if.conditions.forEach(c => {
      if (c.op === "eq") {
        c.token;
      }
    });
  }

  switch (rule.if.op) {
    case "and":
      rule.if.conditions.forEach(cond => {
        if (cond.op == "eq") {
        }
      });
    case "or":
  }
}).catch(err => {
  console.log("err", err);
});
