/** This file was autogenerated on Wed Jul 06 2022. Follow the steps in src/schema/slack/functions/README.md to rebuild **/
import AddPin from "./add_pin.js";
import AddUserToUsergroup from "./add_user_to_usergroup.js";
import ArchiveChannel from "./archive_channel.js";
import CreateChannel from "./create_channel.js";
import CreateUsergroup from "./create_usergroup.js";
import Delay from "./delay.js";
import InviteUserToChannel from "./invite_user_to_channel.js";
import RemoveUserFromUsergroup from "./remove_user_from_usergroup.js";
import RenameChannel from "./rename_channel.js";
import SendDm from "./send_dm.js";
import SendEphemeralMessage from "./send_ephemeral_message.js";
import SendMessage from "./send_message.js";
import UpdateChannelTopic from "./update_channel_topic.js";

const SlackFunctions = {
  AddPin: AddPin,
  AddUserToUsergroup: AddUserToUsergroup,
  ArchiveChannel: ArchiveChannel,
  CreateChannel: CreateChannel,
  CreateUsergroup: CreateUsergroup,
  Delay: Delay,
  InviteUserToChannel: InviteUserToChannel,
  RemoveUserFromUsergroup: RemoveUserFromUsergroup,
  RenameChannel: RenameChannel,
  SendDm: SendDm,
  SendEphemeralMessage: SendEphemeralMessage,
  SendMessage: SendMessage,
  UpdateChannelTopic: UpdateChannelTopic,
} as const;

export default SlackFunctions;
