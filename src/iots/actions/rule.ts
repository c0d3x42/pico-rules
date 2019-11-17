import * as t from "io-ts";

import { Rule } from "../rules";

export interface PicoActionRule {
  act: "rule";
  rule: Rule;
}

export const PicoActionRule: t.Type<PicoActionRule> = t.recursion("PicoActionRule", Self =>
  t.type({
    act: t.literal("rule"),
    rule: Rule,
  })
);
