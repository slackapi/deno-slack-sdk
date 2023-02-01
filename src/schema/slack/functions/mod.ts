/** This file was autogenerated on Wed Feb 01 2023. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import AddPin from "./add_pin.ts";
import AddUserToUsergroup from "./add_user_to_usergroup.ts";
import ArchiveChannel from "./archive_channel.ts";
import CreateChannel from "./create_channel.ts";
import CreateUsergroup from "./create_usergroup.ts";
import Delay from "./delay.ts";
import InviteUserToChannel from "./invite_user_to_channel.ts";
import OpenForm from "./open_form.ts";
import RemoveUserFromUsergroup from "./remove_user_from_usergroup.ts";
import SendDm from "./send_dm.ts";
import SendEphemeralMessage from "./send_ephemeral_message.ts";
import SendMessage from "./send_message.ts";
import UpdateChannelTopic from "./update_channel_topic.ts";

const SlackFunctions = {
  AddPin: AddPin,
  AddUserToUsergroup: AddUserToUsergroup,
  ArchiveChannel: ArchiveChannel,
  CreateChannel: CreateChannel,
  CreateUsergroup: CreateUsergroup,
  Delay: Delay,
  InviteUserToChannel: InviteUserToChannel,
  OpenForm: OpenForm,
  RemoveUserFromUsergroup: RemoveUserFromUsergroup,
  SendDm: SendDm,
  SendEphemeralMessage: SendEphemeralMessage,
  SendMessage: SendMessage,
  UpdateChannelTopic: UpdateChannelTopic,
} as const;

export default SlackFunctions;
