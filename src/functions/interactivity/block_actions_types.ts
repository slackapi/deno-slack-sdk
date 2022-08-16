/*
This is currently a pretty light type of a block_actions payload that we can fill out
once we have a way to share some of these payload types across our different libraries better
Some other references that may be useful to fill this out:
- https://api.slack.com/changelog/2020-09-full-state-on-view-submisson-and-block-actions
- https://api.slack.com/reference/interaction-payloads/block-actions#fields
- https://github.com/slackapi/bolt-js/blob/main/src/types/actions/block-action.ts
*/

/**
 * @description Block Actions-specific type for the `body` property of a `block_actions` event
 */
export type BlockActionsBody = {
  // type: "block_actions";
  actions: BlockAction[];
  /**
   * @description The application ID the event was dispatched to.
   */
  api_app_id: string;
  /**
   * @description If applicable, the channel the Block Action interaction originated from.
   */
  channel?: {
    /**
     * @description Encoded channel ID, e.g. C123456.
     */
    id: string;
    /**
     * @description Channel name, without the "#" prefix.
     */
    name: string;
  };
  /**
   * @description If applicable, the enterprise associated with the workspace the Block Action interaction originated from. If not applicable, will be null.
   */
  enterprise: {
    /**
     * @description Encoded enterprise ID, e.g. E123456.
     */
    id: string;
    /**
     * @description Enterprise name.
     */
    name: string;
  } | null;
  /**
   * @description Whether this event originated from a workspace that is part of an enterprise installation.
   */
  is_enterprise_install: boolean;
  response_url: string;
  /**
   * @description The workspace, or team, details the Block Kit interaction originated from.
   */
  team: {
    /**
     * @description The subdomain of the team, e.g. domain.slack.com
     */
    domain: string;
    /**
     * @description Encoded team ID, e.g. T123456.
     */
    id: string;
  };
  token: string;
  /**
   * @description A one-time use ID for opening modals or triggering other UI changes based on user interactions.
   */
  trigger_id: string;
  /**
   * @description Details for the user that initiated the Block Kit action.
   */
  user: {
    /**
     * @description Encoded user ID, e.g. U123456.
     */
    id: string;
    /**
     * @description User's handle as seen in the Slack client when e.g. at-notifying the user.
    name: string;
    /**
     * @description The encoded team ID for the workspace, or team, where the Block Kit action originated from.
     */
    team_id: string;
  };
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
  /* Other properties seen on this type that should be added at some point:
   * container: {}; // should be a reference to message or view below, depending on the container for the block kit interactive componenet
   * message: {}; // if the block kit interactive componnet was part of a message, details for the message are here
   * view: {}; // if the block kit interactive componnet was part of a view, details for the view are here
   * state: { values: {}}; // seen but usually empty?
   */
};

/**
 * @description A single Block Kit interactive component interaction.
 */
export type BlockAction = {
  /**
   * @description Identifies the Block Kit interactive component that was interacted with.
   */
  action_id: string;
  /**
   * @description Identifies the block within a surface that contained the interactive component that was interacted with.
   */
  block_id: string;
  type: string;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};
