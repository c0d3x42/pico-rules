import { Context } from "./context";

export interface IdGenerator {
  generate(): string;
}

export interface Engine {
  exec(context: Context): void;
}
