import { readFile, promises as fsp } from "fs";
import { from } from "rxjs";

export class Provider {}

export class FsProvider extends Provider {
  constructor(private readonly filepath: string) {
    super();
  }

  public ready() {
    return fsp.readFile(this.filepath, "utf-8").then(fileBuffer => {
      const obj: Object = JSON.parse(fileBuffer);
      return obj;
    });
  }

  public emit() {
    const obs = from(this.ready());

    return obs.toPromise();
  }
}
