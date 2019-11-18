export class PicoContext {
  private varbinds: Map<string, string>;

  constructor() {
    this.varbinds = new Map();
  }

  public getVar(varName: string): string {
    return this.varbinds.get(varName) || "";
  }

  public setVar(varName: string, varValue: string) {
    this.varbinds.set(varName, varValue);
  }
}
