import * as t from "io-ts";

import { PicoIfCondition } from "../conditions";
import { PicoActionCollection } from "../actions";

export interface Rule {
  label: string;
  if: PicoIfCondition;
  then: PicoActionCollection;
  else: PicoActionCollection;
}

export interface PicoActionRule {
  act: "rule";
  rule: Rule;
}

export const PicoActionRule: t.Type<PicoActionRule> = t.recursion("PicoActionRule", Self =>
  t.interface({
    act: t.literal("rule"),
    rule: Rule
  })
);

export const Rule: t.Type<Rule> = t.recursion("Rule", () =>
  t.interface({
    label: t.string,
    if: PicoIfCondition,
    then: PicoActionCollection,
    else: PicoActionCollection
  })
);

export type RuleType = t.TypeOf<typeof Rule>;
