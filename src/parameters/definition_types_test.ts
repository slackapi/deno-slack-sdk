import { assertExists } from "../dev_deps.ts";
import * as definitionTypes from "./definition_types.ts";

Deno.test("Include definition-types.ts in code coverage", () => {
  assertExists(definitionTypes);
});
