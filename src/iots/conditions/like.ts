import * as t from "io-ts";

export interface PicoConditionLike {
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
