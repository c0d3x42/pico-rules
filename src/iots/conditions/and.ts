import * as t from "io-ts";
import { PicoConditionEquality } from "./equality";
import { PicoConditionLike } from "./like";
import { PicoOrCondition } from "./or";

export interface PicoAndCondition {
  op: "and";
  conditions: Array<PicoAndCondition | PicoOrCondition | PicoConditionLike | PicoConditionEquality>;
}

export const PicoAndCondition: t.Type<PicoAndCondition> = t.recursion("PicoAndCondition", () =>
  t.type({
    op: t.literal("and"),
    conditions: t.array(t.union([PicoConditionEquality, PicoConditionLike, PicoOrCondition, PicoAndCondition]))
  })
);
