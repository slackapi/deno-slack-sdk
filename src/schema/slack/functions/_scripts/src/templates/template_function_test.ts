import { assertExists } from "../../../../../../dev_deps.ts";
import * as template_functions from "./template_function.ts";

Deno.test("Include template_function.ts in code coverage", () => {
  assertExists(template_functions);
});
