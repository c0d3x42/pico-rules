import { container } from "./inversify.config";
import { TYPES } from "./types";
import { plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { PicoEngine } from "./engine";
import { readFileSync } from "fs";
import { map, switchMap } from "rxjs/operators";
import { from, Observer, Subject, Observable } from "rxjs";

import { FsProvider, FsWatchProvider } from "../providers/fs-provider";
import { ObserveOnOperator } from "rxjs/internal/operators/observeOn";
import { Context } from "./context";

export class EngineManager {
  ruleDoc: Object = {};

  obs: Subject<Context>;

  constructor() {
    this.obs = new Subject();
  }

  public exec(context: Context) {
    this.obs.next(context);
  }

  public load(rulesDocument: Object): Promise<PicoEngine> {
    const engine = container.get<PicoEngine>(TYPES.PicoEngine);
    const rule = plainToClassFromExist(engine, rulesDocument, { excludeExtraneousValues: true });

    return validate(rule).then(validationErrors => {
      if (validationErrors.length > 0) {
        throw validationErrors;
      }
      this.ruleDoc = rulesDocument;
      return rule;
    });
  }

  public loadFromFile(filenamePath: string): Observable<PicoEngine> {
    const fsw = new FsWatchProvider(filenamePath);
    return fsw.emit().pipe(
      switchMap(jsonDoc => {
        console.log("FSW: ", jsonDoc);

        return from(this.load(jsonDoc));
      })
    );
    /*
    return fsp.emit().pipe(
      switchMap(jsonDoc => {
        const picoPromise = this.load(jsonDoc);
        return from(picoPromise);
      })
    );
    */
  }
}
