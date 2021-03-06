import { container } from "./inversify.config";
import { TYPES } from "./types";
import { plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { PicoEngine } from "./engine";
import { readFileSync } from "fs";

export class EngineManager {
  ruleDoc: Object = {};

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

  public loadFromFile(filenamePath: string): Promise<PicoEngine> {
    let document;
    try {
      const jsonDocument = readFileSync(filenamePath, { encoding: "UTF8" });
      document = JSON.parse(jsonDocument);
    } catch (e) {
      return Promise.reject("Failed to parse: " + e);
    }

    return this.load(document);
  }
}
