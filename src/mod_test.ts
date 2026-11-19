import { assertExists } from "./dev_deps.ts";
import * as mod from "./mod.ts";

Deno.test("Include all content of mod.ts in code coverage", () => {
  assertExists(mod);
});
