import * as t from "io-ts";

import { PicoConditionEquality } from "./equality";
import { PicoConditionLike } from "./like";
import { PicoAndCondition } from "./and";
import { OpConditions, AllConditionTypes } from "./op";

export interface PicoOrCondition extends OpConditions {
  op: "or";
}

export const PicoOrCondition: t.Type<PicoOrCondition> = t.recursion("OrCondition", () =>
  t.type({
    op: t.literal("or"),
    conditions: AllConditionTypes,
    //conditions: t.array(t.union([PicoConditionEquality, PicoConditionLike, PicoOrCondition, PicoAndCondition])),
  })
);
