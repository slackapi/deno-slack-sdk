import { InteractivityType } from "./interactivity.ts";
import { UserContextType } from "./user_context.ts";
import { FormInput } from "./form_input.ts";
import { MessageContextType } from "./message_context.ts";

export const CustomSlackTypes = {
  interactivity: InteractivityType,
  user_context: UserContextType,
  message_context: MessageContextType,
};

export const InternalSlackTypes = {
  form_input_object: FormInput,
};
