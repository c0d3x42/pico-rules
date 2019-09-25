import { promises as fsp } from "fs";
import { from, Observable } from "rxjs";
import { watch } from "chokidar";
import { switchMap, map } from "rxjs/operators";

export class Provider {}

export class FsProvider extends Provider {
  constructor(protected readonly filepath: string) {
    super();
  }

  public ready() {
    return fsp.readFile(this.filepath, "utf-8").then(fileBuffer => {
      const obj: Object = JSON.parse(fileBuffer);
      return obj;
    });
  }

  public emit(): Observable<Object> {
    const obs = from(this.ready());

    return obs;
  }
}

export class FsWatchProvider extends FsProvider {
  public emit() {
    const watchedFile = watch(this.filepath);

    const file$ = new Observable<string>(observer => {
      observer.next(this.filepath);
      watchedFile.on("change", () => {
        console.log(`Changed [${this.filepath}]`);
        observer.next(this.filepath);
      });
    }).pipe(switchMap(s => this.ready()));

    return file$;
  }
}
