import * as t from "io-ts";
import { PicoConditionEquality } from "./equality";
import { PicoConditionLike } from "./like";
import { PicoOrCondition } from "./or";
import { OpConditions, AllConditionTypes } from "./op";

export interface PicoAndCondition extends OpConditions {
  op: "and";
}

export const PicoAndCondition: t.Type<PicoAndCondition> = t.recursion("PicoAndCondition", () =>
  t.type({
    op: t.literal("and"),
    conditions: AllConditionTypes,
    //conditions: t.array(t.union([PicoOrCondition, PicoAndCondition, PicoConditionEquality, PicoConditionLike])),
  })
);
