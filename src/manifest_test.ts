import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { SlackManifestType } from "./types.ts";

import { Manifest } from "./manifest.ts";

Deno.test("Manifest property mappings", () => {
  const definition: SlackManifestType = {
    display_information: {
      name: "fear and loathing in las vegas",
      short_description:
        "fear and loathing in las vegas: a savage journey to the heart of the american dream",
      background_color: "#FFF",
      long_description:
        "The book is a roman à clef, rooted in autobiographical incidents. The story follows its protagonist, Raoul Duke, and his attorney, Dr. Gonzo, as they descend on Las Vegas to chase the American Dream...",
    },
    displayName: "fear and loathing",
    icon: "icon.png",
    runtime: "deno",
    botScopes: [],
  };
  let manifest = Manifest(definition);

  assertEquals(manifest.display_information, definition.display_information);
  assertEquals(manifest.icon, definition.icon);
  assertEquals(
    manifest.features.bot_user.display_name,
    definition.displayName,
  );

  // If display_name is not defined on definition, should fall back to name
  delete definition.displayName;
  manifest = Manifest(definition);
  assertEquals(
    manifest.features.bot_user.display_name,
    definition.display_information.name,
  );
});
