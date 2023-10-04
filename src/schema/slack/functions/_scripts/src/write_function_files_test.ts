import { assertExists } from "../../../../../dev_deps.ts";
import * as writeFunctionFiles from "./write_function_files.ts";

Deno.test("Include all content of generation script in code coverage", () => {
  assertExists(writeFunctionFiles);
});
