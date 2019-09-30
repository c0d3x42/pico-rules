import { IsString, IsNotEmpty, ValidateNested, IsArray, IsDefined, IsAlpha, Length } from "class-validator";
import { Type, Expose } from "class-transformer";
import { Context } from "../../context";
import { compile } from "handlebars";

import { Action, ActionCollection } from "../base";
import { ActionRule } from "../rule";
import { ActionSetVar } from "./var";

import { debug as debugLogger } from "debug";
const debug = debugLogger("Actions");

export class ActionSetTemplated extends Action {
  @IsString()
  @IsAlpha()
  @IsDefined()
  @IsNotEmpty()
  @Expose()
  varName: string = "";

  @IsString()
  @IsDefined()
  @Expose({ name: "template" })
  templateSource: string = "";

  private compiledTemplate: Handlebars.TemplateDelegate | undefined;

  act: string = "template";

  public init() {
    if (!this.compiledTemplate) {
      this.compiledTemplate = compile(this.templateSource);
    }
  }

  public _exec(context: Context) {
    debug(`executing ActionSetTemplated `);
    this.init();
    if (this.compiledTemplate) {
      const tokenValues = Object.fromEntries(context.tokens);
      const templatedOutput = context.tokens.set(this.varName, this.compiledTemplate(tokenValues));
    }
    return true;
  }
}

export class ActionList extends Action {
  @Expose()
  act: string = "list";

  @Expose()
  @ValidateNested()
  @IsArray()
  @Type(() => Action, {
    discriminator: {
      property: "act",
      subTypes: [{ name: "setvar", value: ActionSetVar }, { name: "rule", value: ActionRule }],
    },
  })
  actions: ActionCollection = [];

  public _exec() {
    debug(`executing ActionList `);
    return true;
  }
}
