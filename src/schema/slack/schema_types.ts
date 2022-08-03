import { SlackPrimitiveTypes } from "./types/mod.ts";
import { CustomSlackTypes } from "./types/custom/mod.ts";

export default { ...SlackPrimitiveTypes, ...CustomSlackTypes };
