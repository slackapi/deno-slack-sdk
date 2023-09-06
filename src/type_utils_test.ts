import { assertExists } from "./dev_deps.ts";
import * as typeUtils from "./type_utils.ts";

Deno.test("Include type_utils.ts in code coverage", () => {
  assertExists(typeUtils);
});
