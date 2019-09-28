import { EngineManager } from "./index";
import { Observable, Subject } from "rxjs";
import { PicoEngine } from "./engine";
import { Context } from "./context";
import { map, switchMap } from "rxjs/operators";

export class Main {
  engine$: Observable<PicoEngine>;
  ctx$: Subject<Context>;

  constructor() {
    const em = new EngineManager();
    this.engine$ = em.loadFromFile("rules.json");
    this.ctx$ = new Subject<Context>();
  }

  public init() {
    return this.engine$.pipe(
      switchMap(eng => {
        console.log("got and engine");
        return eng.exec2(this.ctx$);
      })
    );
  }

  public exec(context: Context) {
    console.log("sending ctx");
    this.ctx$.next(context);
  }
}
