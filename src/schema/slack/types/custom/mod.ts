import { InteractivityType } from "./interactivity.ts";
import { UserContextType } from "./user_context.ts";
import { FormInput } from "./form_input.ts";
import { MessageContextType } from "./message_context.ts";
import { SlackFunctionOutputType } from "./slack_function_output.ts";
import { AppFunctionOutputType } from "./app_function.ts";

export const CustomSlackTypes = {
  interactivity: InteractivityType,
  user_context: UserContextType,
  message_context: MessageContextType,
  slack_function_output: SlackFunctionOutputType,
  app_function: AppFunctionOutputType,
};

export const InternalSlackTypes = {
  form_input_object: FormInput,
};
