import * as t from "io-ts";

import { PicoConditionLike } from "./like";
import { PicoConditionEquality } from "./equality";

export interface PicoConditionList {
  op: "list";
  traversal: "and" | "or";
  conditions: Array<PicoConditionList | PicoConditionLike | PicoConditionEquality>;
}

export const PicoConditionList: t.Type<PicoConditionList> = t.recursion("ConditionList", () =>
  t.type({
    op: t.literal("list"),
    traversal: t.union([t.literal("and"), t.literal("or")]),
    conditions: t.array(t.union([PicoConditionList, PicoConditionLike, PicoConditionEquality]))
  })
);
