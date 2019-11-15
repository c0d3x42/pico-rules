import { promises as fsp } from "fs";
import { from, Observable, of, Subject } from "rxjs";
import { watch } from "chokidar";
import { switchMap, map, catchError, retry } from "rxjs/operators";
import { BasicJsonRules } from "../pico/interfaces";
import { Provider } from "./interfaces";

export interface FsProviderOptions {
  once?: boolean;
  filepath: string;
}

const FsProviderOptionsDefaults: FsProviderOptions = {
  once: false,
  filepath: "rules.json"
};

export class FsProvider extends Provider {
  private options: FsProviderOptions;
  constructor(readonly xoptions: FsProviderOptions) {
    super();
    this.options = { ...FsProviderOptionsDefaults, ...xoptions };
  }

  private ready(): Promise<BasicJsonRules> {
    return fsp.readFile(this.options.filepath, "utf-8").then(fileBuffer => {
      const obj: BasicJsonRules = JSON.parse(fileBuffer);
      return obj;
    });
  }

  // load the rules file from disk
  public load(): Promise<BasicJsonRules> {
    return this.ready();
  }

  // load the rules file from disk and emit a new one each time it changes
  public emit(): Observable<BasicJsonRules> {
    const watchedFile = watch(this.options.filepath);

    if (this.options.once === true) {
      return from(this.ready());
    }

    const file$ = new Observable<string>(observer => {
      watchedFile.on("change", () => {
        console.log(`Changed [${this.options.filepath}]`);
        observer.next(this.options.filepath);
      });
      observer.next(this.options.filepath);
    }).pipe(
      switchMap(s => this.ready()),
      retry(10)
    );

    return file$;
  }
}
