export class Context {
  tokens: Map<string, string> = new Map();
  locals: Map<string, string> = new Map();

  visits: Set<string> = new Set();

  public logVisit(id: string): boolean {
    this.visits.add(id);
    return true;
  }

  public dump(): void {
    this.tokens.forEach((value, key) => {
      console.log(`TOKEN [${key}] = ${value}`);
    });
  }
}
