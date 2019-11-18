import * as t from "io-ts";
import * as tPromise from "io-ts-promise";

import { Rule } from "./rules";
import { inspect } from "util";
import { PicoRule } from "./logic/Rule";
import { PicoContext } from "./logic/Context";

/*
const PicoCondition = t.type({ label: t.string });
const PicoConditions = t.array(PicoCondition);
*/

const plainRule = {
  label: "lop",
  if: {
    op: "or",
    conditions: [
      { op: "eq", token: "node", value: "localhost" },
      { op: "and", conditions: [] }
    ]
  },
  then: [
    { act: "setvar", varName: "n1", varValue: "v1" },
    {
      act: "rule",
      rule: {
        label: "lop2",
        if: {
          op: "eq",
          token: "ff",
          value: "gg"
        },
        then: [],
        else: [
          {
            act: "rule",
            rule: {
              label: "pop",
              if: {
                op: "or",
                conditions: [
                  {
                    op: "eq",
                    token: "t",
                    value: "v"
                  }
                ]
              },
              then: [],
              else: []
            }
          }
        ]
      }
    }
  ],
  else: []
};

const r1 = Rule.decode(plainRule);
console.log("R1 = ", r1);

const r = tPromise.decode(Rule, plainRule);

r.then(rule => {
  console.log("R = ", inspect(rule, false, 18));

  if (rule.if.op === "eq") {
  }

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

  const pr = PicoRule.generate(rule);
  pr.then(ppp => {
    const ctx = new PicoContext();
    ctx.setVar("node", "localhost");
    ppp.exec(ctx);
  }).catch(err => {
    console.log("ERR", err);
  });
}).catch(err => {
  console.log("err", err);
});
