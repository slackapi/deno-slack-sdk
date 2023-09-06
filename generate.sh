#!/bin/bash
TEST_FILE_PATH="./tests/test.ts"

> $TEST_FILE_PATH
echo "import { assertExists } from \"../src/dev_deps.ts\";" > $TEST_FILE_PATH

for OUTPUT in $(find ./src -type f -regex ".*[^_^t]\.ts$")
do
	NAME=$(echo $OUTPUT | sed 's/[-\.\/]//g')
    echo "import * as ${NAME} from \"${OUTPUT//\.\//../}\";" >> $TEST_FILE_PATH
	echo "Deno.test(\"${NAME}\", () => {
  assertExists(${NAME});
});" >> $TEST_FILE_PATH
done

deno fmt
