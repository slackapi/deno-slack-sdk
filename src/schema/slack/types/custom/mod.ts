import { InteractivityType } from "./interactivity.ts";
import { UserContextType } from "./user_context.ts";
import { FormInput } from "./form_input.ts";
import { MessageContextType } from "./message_context.ts";
import { SlackFunctionOutputType } from "./slack_function_output.ts";

export const CustomSlackTypes = {
  interactivity: InteractivityType,
  user_context: UserContextType,
  message_context: MessageContextType,
  slack_function_output: SlackFunctionOutputType,
};

export const InternalSlackTypes = {
  form_input_object: FormInput,
};
