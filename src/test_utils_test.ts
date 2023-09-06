import { assertExists } from "./dev_deps.ts";
import * as test_utils from "./test_utils.ts";

// TODO: add tests here
Deno.test("Include test_utils.ts in code coverage", () => {
  assertExists(test_utils);
});
