import * as t from "io-ts";

interface PicoConditionLike {
  op: "like";
  token: string;
  value: string;
}
export const PicoConditionLike = t.type(
  {
    op: t.literal("like"),
    token: t.string,
    value: t.string
  },
  "PicoConditionLike"
);

interface PicoConditionEquality {
  op: "eq";
  token: string;
  value: string;
}
export const PicoConditionEquality = t.type(
  {
    op: t.literal("eq"),
    token: t.string,
    value: t.string
  },
  "PicoConditionEquality"
);

interface PicoConditionList {
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

export const PicoCondition = t.union([PicoConditionEquality, PicoConditionLike, PicoConditionList]);
export const PicoConditionCollection = t.array(PicoCondition);
