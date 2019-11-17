import * as t from "io-ts";

import { Rule } from "../rules";

export interface PicoActionRule {
  act: "rule";
  rule: Rule;
}

export const PicoActionRule = t.type({
  act: t.literal("rule"),
  rule: Rule
});

export const xPicoActionRule: t.Type<PicoActionRule> = t.recursion("PicoActionRule", Self =>
  t.interface(
    {
      act: t.literal("rule"),
      rule: Rule
    },
    "ActionRule"
  )
);
