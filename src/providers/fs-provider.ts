import { promises as fsp } from "fs";
import { from, Observable } from "rxjs";
import { watch } from "chokidar";

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
  public emit(): Observable<object> {
    const watchedFile = watch(this.filepath);

    const file$ = new Observable<object>(observer => {
      observer.next(this.ready());

      watchedFile.on("add", () => {
        observer.next(this.ready());
      });
    });
    return file$;
  }
}
