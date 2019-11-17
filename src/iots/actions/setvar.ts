import * as t from "io-ts";

export interface PicoActionSetVar {
  act: "setvar";
  varName: string;
  varValue: string;
}

export const PicoActionSetVar: t.Type<PicoActionSetVar> = t.recursion("PicoActionSetVar", () =>
  t.type({
    act: t.literal("setvar"),
    varName: t.string,
    varValue: t.string,
  })
);

// export type PicoActionSetVar = t.TypeOf<typeof PicoActionSetVar>;
