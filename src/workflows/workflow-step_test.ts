import { assertExists } from "./../dev_deps.ts";
import * as workflowSteps from "./workflow-step.ts";

Deno.test("Include type_utils.ts in code coverage", () => {
  assertExists(workflowSteps);
});
