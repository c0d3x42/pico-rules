import * as t from "io-ts";
import { PicoAndCondition } from "./and";
import { PicoOrCondition } from "./or";

export const PicoIfCondition = t.union([PicoOrCondition, PicoAndCondition]);
export type PicoIfCondition = t.TypeOf<typeof PicoIfCondition>;
