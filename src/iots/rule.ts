import * as t from "io-ts";
import * as tPromise from "io-ts-promise";

import { PicoConditionCollection, PicoConditionEquality, PicoConditionLike } from "./condition";
import { inspect } from "util";

/*
const PicoCondition = t.type({ label: t.string });
const PicoConditions = t.array(PicoCondition);
*/

const PicoActionRule = t.type({
  act: t.literal("rule"),
  rule: t.array(t.string)
});

const PicoActionSetVar = t.type({
  act: t.literal("setvar"),
  varName: t.string,
  varValue: t.string
});

const PicoAction = t.union([PicoActionRule, PicoActionSetVar]);
const PicoActionCollection = t.array(PicoAction);

interface PicoOrCondition {
  op: "or";
  conditions: Array<PicoAndCondition | PicoOrCondition | PicoConditionLike | PicoConditionEquality>;
}

interface PicoAndCondition {
  op: "and";
  conditions: Array<PicoAndCondition | PicoOrCondition | PicoConditionLike | PicoConditionEquality>;
}

const PicoOrCondition: t.Type<PicoOrCondition> = t.recursion("OrCondition", () =>
  t.type({
    op: t.literal("or"),
    conditions: t.array(t.union([PicoConditionEquality, PicoConditionLike, PicoOrCondition, PicoAndCondition]))
  })
);

const PicoAndCondition: t.Type<PicoAndCondition> = t.recursion("AndCondition", () =>
  t.type({
    op: t.literal("and"),
    conditions: t.array(t.union([PicoConditionEquality, PicoConditionLike, PicoOrCondition, PicoAndCondition]))
  })
);

const PicoIfCondition = t.union([PicoOrCondition, PicoAndCondition]);

const Rule = t.type(
  {
    label: t.string,
    if: PicoIfCondition,
    then: PicoActionCollection,
    else: PicoActionCollection
  },
  "PicoRule"
);

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
