import * as t from "io-ts";

import { PicoConditionEquality } from "./equality";
import { PicoConditionLike } from "./like";
import { PicoAndCondition } from "./and";

export interface PicoOrCondition {
  op: "or";
  conditions: Array<PicoAndCondition | PicoOrCondition | PicoConditionLike | PicoConditionEquality>;
}

export const PicoOrCondition: t.Type<PicoOrCondition> = t.recursion("OrCondition", () =>
  t.type({
    op: t.literal("or"),
    conditions: t.array(t.union([PicoConditionEquality, PicoConditionLike, PicoOrCondition, PicoAndCondition]))
  })
);
