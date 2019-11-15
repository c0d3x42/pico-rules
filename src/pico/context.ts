import nanoid from "nanoid";
import { Observable, Subject } from "rxjs";
import { take } from "rxjs/operators";

type ContextEvent = { [event: string]: string };

export class Context {
  uuid: string;
  events$: Subject<ContextEvent>;
  done$: Observable<unknown>;

  tokens: Map<string, string | number> = new Map();
  locals: Map<string, string> = new Map();

  visits: Set<string> = new Set();

  constructor() {
    this.uuid = nanoid();
    this.events$ = new Subject();
    this.done$ = new Observable();
  }

  public logVisit(id: string): boolean {
    this.visits.add(id);
    this.events$.next({ visit: this.tokensToJson() });
    return true;
  }

  public dump(): void {
    this.tokens.forEach((value, key) => {
      console.log(`TOKEN [${key}] = ${value}`);
    });
  }

  public done() {
    this.events$.next({ done: this.tokensToJson() });
  }

  private toObject(tokens: Map<string, string | number>) {
    const obj: { [key: string]: string | number } = {};
    for (let [key, value] of tokens) {
      obj[key] = value;
    }
    return obj;
  }

  private toJson(tokens: Map<string, string | number>) {
    return JSON.stringify(this.toObject(tokens));
  }

  public tokensToJson(): string {
    return this.toJson(this.tokens);
  }
}
