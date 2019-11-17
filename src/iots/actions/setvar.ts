import * as t from "io-ts";

export const PicoActionSetVar = t.type({
  act: t.literal("setvar"),
  varName: t.string,
  varValue: t.string
});
