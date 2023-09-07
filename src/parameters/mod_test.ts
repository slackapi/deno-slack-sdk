import { assertExists } from "../dev_deps.ts";
import * as template_functions from "./mod.ts";

Deno.test("Include mod.ts in code coverage", () => {
  assertExists(template_functions);
});
