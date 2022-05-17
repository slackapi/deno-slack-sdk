import { SlackManifest } from "../manifest.ts";
import type { ManifestWorkflowSchema } from "../types.ts";

export interface ISlackWorkflow {
  id: string;
  export: () => ManifestWorkflowSchema;
  registerStepFunctions: (manifest: SlackManifest) => void;
  registerParameterTypes: (manfest: SlackManifest) => void;
}
