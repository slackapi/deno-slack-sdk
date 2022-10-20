/**
 * @description A single Block Kit interactive component interaction.
 */
export type BlockAction =
  & {
    /**
     * @description Identifies the Block Kit interactive component that was interacted with.
     */
    action_id: string;
  }
  & BlockElement;

/**
 * @description A single Block element
 */
export type BlockElement = {
  /**
   * @description Identifies the block within a surface.
   */
  block_id: string;
  type: string;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};
