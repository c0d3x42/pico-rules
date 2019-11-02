import { container } from "./inversify.config";
import { PicoEngine } from "./engine";
import { TYPES } from "./types";
import { Observable } from "rxjs";
import { BasicJsonRules } from "./interfaces";

import { plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { switchMap, tap } from "rxjs/operators";
import { Context } from "./context";

export class Manager {
  private engine: Observable<PicoEngine>;

  constructor(private readonly jsonProvider: Observable<BasicJsonRules>) {
    this.engine = jsonProvider.pipe(
      switchMap(ruleDoc => {
        return this.engineFactory(ruleDoc);
      })
    );
    console.log("ctor");
  }

  private engineFactory(rulesDocument: Object): Promise<PicoEngine> {
    const engine = container.get<PicoEngine>(TYPES.PicoEngine);
    const picoEngine = plainToClassFromExist(engine, rulesDocument, { excludeExtraneousValues: true });

    return validate(picoEngine).then(validationErrors => {
      if (validationErrors.length > 0) {
        throw validationErrors;
      }
      // this.ready$.next("ready");
      // this.ruleDoc = rulesDocument;
      return picoEngine;
    });
  }

  public run(ctx: Observable<Context>) {
    return this.engine
      .pipe(
        tap(_ => {
          console.log("tap1");
        }),
        switchMap(engine => {
          return engine.exec(ctx);
        })
      )
      .subscribe(obs => {
        console.log("number " + obs.tokens.get("counter"));
      });
  }
}
