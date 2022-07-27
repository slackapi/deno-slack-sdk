// This is currently a pretty light type of a block_actions payload that we can fill out
// once we have a way to share some of these payload types across our different libraries better
export type BlockActionsBody = {
  // type: "block_actions";
  user: {
    id: string;
    name: string;
    team_id: string;
  };
  api_app_id: string;
  token: string;
  trigger_id: string;
  team: {
    id: string;
    domain: string;
    enterprise_id?: string;
    enterprise_name?: string;
  };
  enterprise?: {
    id: string;
    name: string;
  } | null;
  is_enterprise_install?: boolean;
  channel?: {
    id: string;
    name: string;
  };
  actions: BlockAction[];
  response_url: string;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

export type BlockAction = {
  type: string;
  block_id: string;
  action_id: string;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};
