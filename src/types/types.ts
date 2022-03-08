import { TypedParameterDefinition } from "../parameters/types.ts";
import { SlackProject } from "../project.ts";

export interface ICustomType {
  id: string;
  definition: TypedParameterDefinition;
  description?: string;
  registerParameterTypes: (project: SlackProject) => void;
}
