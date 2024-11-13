import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ApiMethodPage = ({ jsonFilePath }) => {
  const [methodData, setMethodData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await import(`../../static/connectors${jsonFilePath}.json`);
        setMethodData(data.default);
      } catch (error) {
        console.error('Error loading the function data:', error);
      }
    };

    fetchData();
  }, [jsonFilePath]);

  if (!methodData) {
    return null;
  }

  const {
    title,
    callback_id,
    category_label,
    input_parameters = [],
    output_parameters = [],
  } = methodData;

  // takes 'Connectors.Dropbox Sign.functions.send_request
  // turns it into 'Connectors.DropboxSign.functions.SendRequest
  const schema = `Connectors.${category_label.replace(/ /g, '')}.functions.${callback_id
    .replace(/_(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^(\w)/, (match) => match.toUpperCase())}`;

  const sortedInputParameters = input_parameters.sort((a, b) => a.name.localeCompare(b.name));
  const sortedOutputParameters = output_parameters.sort((a, b) => a.name.localeCompare(b.name));

  const requiredInputParams = sortedInputParameters.filter(param => param.is_required);
  const optionalInputParams = sortedInputParameters.filter(param => !param.is_required);
  const requiredOutputParams = sortedOutputParameters.filter(param => param.is_required);
  const optionalOutputParams = sortedOutputParameters.filter(param => !param.is_required);


  const renderParameterSection = (title, parameters) => (
    <div class="param-required-section">
      <h3>{title}</h3>
      {parameters.length > 0 ? (
        parameters.map(param => (
          <div key={param.name} className="param-container">
            <div className="param-top-row">
              <span className="name"><code>{param.name}</code></span>
              <span className="type"><code>{param.type}</code></span>
              <span className="required">{param.is_required ? 'Required' : 'Optional'}</span>
            </div>
            <div>
              <ReactMarkdown>{param.title}</ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <p>No {title.toLowerCase()}</p>
      )}
    </div>
  );

  return (
    <div>
      <div className="functions-section">
      <div className="info-row">
          <strong className="info-key">Description</strong>
          {title}
          </div>
        <div className="info-row">
        <strong className="info-key">Schema</strong>
          <code>{schema}</code>
        </div>
        <div className="info-row">
        <strong className="info-key">Service</strong>
          <code>{category_label}</code>
        </div>
      </div>
      <h2>Input Parameters</h2>
      <div className="functions-section">
        {renderParameterSection('Required Input Parameters', requiredInputParams)}
        {renderParameterSection('Optional Input Parameters', optionalInputParams)}
      </div>
      <h2>Output Parameters</h2>
      <div className="functions-section">
        {renderParameterSection('Required Output Parameters', requiredOutputParams)}
        {renderParameterSection('Optional Output Parameters', optionalOutputParams)}
      </div>
        <h2>Usage info </h2>
        <p>
          First, import <code>Connectors</code> from <code>deno-slack-hub</code> into your project's <code>import_map.json</code> file, like this:
        </p>
        <pre>
          <code>
            {`{
    "imports": {
      "deno-slack-hub/": "https://deno.land/x/deno_slack_hub@2.2.0/",
      "deno-slack-sdk/": "https://deno.land/x/deno_slack_sdk@2.14.2/",
      "deno-slack-api/": "https://deno.land/x/deno_slack_api@2.8.0/"
    }
  }`}
          </code>
        </pre>
        <p>
          Next, import <code>Connectors</code> at the top of your workflow's definition file:
        </p>
        <pre>
          <code>
            {`// my_workflow_file.ts
  import { Connectors } from "deno-slack-hub/mod.ts";`}
          </code>
        </pre>
        <p>
          Finally, add the connector as a step in your <a href="/automation/workflows">workflow</a> just like you would a <a href="/automation/functions">built-in Slack function</a>.
        </p>
        <pre>
        <code>
          {`SomeWorkflow.addStep(
  ${schema}, {
  //...
}`}
        </code>
        </pre>
        <p>🧙🏼 <strong>Your admin may need to approve the connector first.</strong> If your workspace has been configured to only allow admin-approved apps, the CLI will prompt you to send an <a href="/automation/admin#dev-connectors">admin approval request</a> the first time you try to use a connector that hasn't been approved by an admin yet. While waiting for admin approval, the CLI may report an error like this:</p>
        <pre>
          <code>Workflow function X is referring to an unknown step output parameter Y</code>
        </pre>
        <p>You can safely ignore this error; it will go away as soon as your workspace admin approves your request to use the connector.</p>
      </div>
  );
};

export default ApiMethodPage;
