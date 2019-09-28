import { promises as fsp } from "fs";
import { from, Observable, of, Subject } from "rxjs";
import { watch } from "chokidar";
import { switchMap, map, catchError, retry } from "rxjs/operators";
import { BasicJsonRules } from "../pico/interfaces";

export abstract class Provider {
  abstract emit(): Observable<BasicJsonRules>;
}

export class FsProvider extends Provider {
  constructor(protected readonly filepath: string) {
    super();
  }

  private ready() {
    return fsp.readFile(this.filepath, "utf-8").then(fileBuffer => {
      const obj: BasicJsonRules = JSON.parse(fileBuffer);
      return obj;
    });
  }

  public emit(): Observable<BasicJsonRules> {
    const watchedFile = watch(this.filepath);

    const file$ = new Observable<string>(observer => {
      watchedFile.on("change", () => {
        console.log(`Changed [${this.filepath}]`);
        observer.next(this.filepath);
      });
      observer.next(this.filepath);
    }).pipe(
      switchMap(s => this.ready()),
      retry(10)
    );

    return file$;
  }
}
