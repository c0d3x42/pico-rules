import * as t from "io-ts";

export const PicoActionSetVar = t.type({
  act: t.literal("setvar"),
  varName: t.string,
  varValue: t.string,
});

export type PicoActionSetVar = t.TypeOf<typeof PicoActionSetVar>;
