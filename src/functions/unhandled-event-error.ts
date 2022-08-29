// This error conforms with what the deno-slack-runtime expects for an unhandled events
export class UnhandledEventError extends Error {
  constructor(message: string) {
    super(message);
    // The name here is important, as it's what deno-slack-runtime keys off of
    this.name = "UnhandledEventError";
  }
}
