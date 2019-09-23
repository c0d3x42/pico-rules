import { IsString, IsNotEmpty, ValidateNested, IsArray, IsDefined, IsAlpha, Length } from "class-validator";
import { Type, Expose, Transform } from "class-transformer";
import { Rule } from "./rule";
import { Context } from "./context";
import { compile } from "handlebars";

export class ActionCollection extends Array<Action> {}

export abstract class Action {
  abstract act: string;

  public abstract _exec(context: Context): boolean;
  exec(context: Context): boolean {
    if (this._exec) {
      return this._exec(context);
    }
    console.log(`Missing exec on [${this.act}]`);
    return false;
  }
  init(): void {}
}

export class ActionRule extends Action {
  @Expose()
  @Transform(value => value || "rule", { toClassOnly: true })
  act: string = "rule";

  @Expose()
  @ValidateNested()
  @Type(() => Rule)
  rule: Rule;

  constructor() {
    super();
    this.rule = new Rule();
  }

  public _exec(context: Context) {
    this.rule.exec(context);
    return true;
  }
}

export class ActionSetVar extends Action {
  @IsString()
  @IsNotEmpty()
  @Expose()
  varName: string = "";

  @Expose()
  varValue: string = "";

  act: string = "setvar";

  public _exec(context: Context) {
    console.log("Setting " + this.varName + " to " + this.varValue);
    context.tokens.set(this.varName, this.varValue);
    return true;
  }
}

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
      subTypes: [{ name: "setvar", value: ActionSetVar }, { name: "rule", value: ActionRule }]
    }
  })
  actions: ActionCollection = [];

  public _exec() {
    return true;
  }
}
