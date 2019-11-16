import * as t from "io-ts";
import * as tPromise from "io-ts-promise";

import { PicoConditionCollection } from "./condition";
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

const Rule = t.type(
  {
    label: t.string,
    if: PicoConditionCollection,
    then: PicoActionCollection,
    else: PicoActionCollection
  },
  "PicoRule"
);

const plainRule = {
  label: "lop",
  if: [
    { op: "eq", token: "t", value: "v" },
    {
      op: "list",
      traversal: "and",
      conditions: [
        { op: "eq", token: "t", value: "v" },
        { op: "list", traversal: "or", conditions: [] }
      ]
    }
  ],
  then: [{ act: "setvar", varName: "n1", varValue: "v1" }],
  else: []
};

const r1 = Rule.decode(plainRule);
console.log("R1 = ", r1);

const r = tPromise.decode(Rule, plainRule);

r.then(rule => {
  console.log("R = ", inspect(rule, false, 5));

  rule.then.forEach(t => {
    if (t.act == "rule") {
      t.rule;
    } else if (t.act == "setvar") {
      t.varName;
    }
  });
}).catch(err => {
  console.log("err", err);
});
