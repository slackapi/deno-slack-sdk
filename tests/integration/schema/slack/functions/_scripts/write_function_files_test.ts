import {
  assertEquals,
  assertExists,
  mock,
} from "../../../../../../src/dev_deps.ts";
import { _internals } from "../../../../../../src/schema/slack/functions/_scripts/src/write_function_files.ts";
import { getSlackFunctions } from "../../../../../../src/schema/slack/functions/_scripts/src/utils.ts";

Deno.test(`write_function_files.ts ${_internals.main.name} function generates valid typescript`, async () => {
  const getSlackFunctionsStub = mock.stub(
    _internals,
    "getSlackFunctions",
    (
      functionsPayloadPath =
        "src/schema/slack/functions/_scripts/src/test/data/function.json",
    ) => {
      return getSlackFunctions(
        functionsPayloadPath,
      );
    },
  );

  const outputs: Record<string, string> = {};

  const writeTextFileStub = mock.stub(
    _internals,
    "writeTextFile",
    // deno-lint-ignore require-await
    async (path, data) => {
      outputs[path] = data;
    },
  );

  try {
    await _internals.main();
    mock.assertSpyCalls(writeTextFileStub, 3);
    mock.assertSpyCalls(getSlackFunctionsStub, 1);

    const generatedContent = outputs["../send_message.ts"];
    assertExists(generatedContent);

    const command = new Deno.Command(Deno.execPath(), {
      cwd: `${Deno.cwd()}/src/schema/slack/functions/`,
      args: [
        "eval",
        generatedContent,
      ],
    });
    const { code, stdout, stderr } = await command.output();
    const textDecoder = new TextDecoder();

    assertEquals(
      textDecoder.decode(stderr),
      "",
      "The generated TypeScript content is not valid",
    );
    assertEquals(
      textDecoder.decode(stdout),
      "",
      "The generated TypeScript should not print to the console",
    );
    assertEquals(code, 0);
  } finally {
    writeTextFileStub.restore();
    getSlackFunctionsStub.restore();
  }
});
