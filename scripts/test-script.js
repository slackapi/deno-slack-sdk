const fs = require("fs");
const path = require("path");

// Specify the path to your schema file
const schemaFilePath = "src/schema/slack/functions/add_bookmark.ts"; // Adjust this path


// Read the file content
const fileContent = fs.readFileSync(schemaFilePath, "utf-8");

// Extract values using regular expressions
const callbackIdMatch = fileContent.match(/callback_id:\s*["']([^"']+)["']/);
const titleMatch = fileContent.match(/title:\s*["']([^"']+)["']/);
const descriptionMatch = fileContent.match(/description:\s*["']([^"']+)["']/);

// Extract input parameters
const inputParamsMatch = fileContent.match(/input_parameters:\s*{([\s\S]+?)},/);
const inputParamsContent = inputParamsMatch ? inputParamsMatch[1] : "";

// Extract output parameters
const outputParamsMatch = fileContent.match(/output_parameters:\s*{([\s\S]+?)},/);
const outputParamsContent = outputParamsMatch ? outputParamsMatch[1] : "";

const paramRegex = /(\w+):\s*{\s*type:\s*([\w.]+),\s*description:\s*["']([^"']+)["'],\s*title:\s*["']([^"']+)["']/g;

let inputParams = [];
let inputmatch;
while ((match = paramRegex.exec(inputParamsContent)) !== null) {
  inputParams.push({
    name: match[1],
    type: match[2],
    description: match[3],
    title: match[4],
  });
}

let outputParams = [];
let outputmatch;
while ((match = paramRegex.exec(outputParamsContent)) !== null) {
  outputParams.push({
    name: match[1],
    type: match[2],
    description: match[3],
    title: match[4],
  });
}

// Generate Markdown content
let markdown = `# ${titleMatch ? titleMatch[1] : "Unknown Title"}\n\n`;
markdown += `**Callback ID**: \`${callbackIdMatch ? callbackIdMatch[1] : "N/A"}\`\n\n`;
markdown += `**Description**: ${descriptionMatch ? descriptionMatch[1] : "No description"}\n\n`;
markdown += `## Input Parameters\n\n`;

inputParams.forEach(param => {
  markdown += `### ${param.title}\n`;
  markdown += `- **Name**: ${param.name}\n`;
  markdown += `- **Type**: ${param.type}\n`;
  markdown += `- **Description**: ${param.description}\n\n`;
});

markdown += `## Output Parameters\n\n`;

outputParams.forEach(param => {
    markdown += `### ${param.title}\n`;
    markdown += `- **Name**: ${param.name}\n`;
    markdown += `- **Type**: ${param.type}\n`;
    markdown += `- **Description**: ${param.description}\n\n`;
  });

// Save to a Markdown file
const outputDir = "docs/generated-schemas";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(path.join(outputDir, "add_bookmark.md"), markdown);

console.log("Documentation generated successfully!");
