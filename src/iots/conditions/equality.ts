import * as t from "io-ts";

export interface PicoConditionEquality {
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
