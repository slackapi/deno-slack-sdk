import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import ReactMarkdown from 'react-markdown';

const ApiMethodPage = ({ jsonFile }) => {
  const [methodData, setMethodData] = useState(null);
  const history = useHistory();

  const availablePages = [
    { label: 'Send Message', value: 'sendMessage' },
    { label: 'Receive Message', value: 'receiveMessage' },
    // Add more pages here
  ];

  const handlePageChange = (event) => {
    const selectedPage = event.target.value;
    history.push(`/content/functions/${selectedPage}`);
  };

  useEffect(() => {
    // Load the JSON data from the specified file
    const fetchData = async () => {
      try {
        const data = await import(`../../static/functions/${jsonFile}.json`);
        setMethodData(data.default);
      } catch (error) {
        console.error('Error loading the function data:', error);
      }
    };

    fetchData();
  }, [jsonFile]);

  if (!methodData) {
    return <div>Oh no! Looks like this Slack function's page isn't functioning!</div>;
  }

  const {
    description,
    schema_id,
    schema_reference,
    scopes,
    input_parameters = [],
    output_parameters = [],
  } = methodData;

  return (
    <div>
      {/* <div className="page-selector">
        <label htmlFor="method-select">Select API Method:</label>
        <select id="method-select" value={jsonFile} onChange={handlePageChange}>
          {availablePages.map((page) => (
            <option key={page.value} value={page.value}>
              {page.label}
            </option>
          ))}
        </select>
      </div> */}

      <p>
        <strong>{description}</strong>
      </p>

      <div className="functions-section">
        <h2>Facts</h2>

        <div className="info-row">
          <p>
            <strong>Schema ID</strong>
          </p>
          <code>{schema_id}</code>
        </div>

        <div className="info-row">
          <p>
            <strong>Schema Reference</strong>
          </p>
          <code>{schema_reference}</code>
        </div>

        <div className="info-row">
          <p>
            <strong>Scopes</strong>
          </p>
          <div className="scope-list">
            {scopes && scopes.length > 0 ? (
              scopes.map((scope) => (
                <span key={scope} className="scope-item">
                  <a href={`https://api.slack.com/scopes/${scope}`} target="_blank" rel="noopener noreferrer">
                    <code>{scope}</code>
                  </a>
                </span>
              ))
            ) : (
              <p>No additional scopes required</p>
            )}
          </div>
        </div>
      </div>

      <div className="functions-section">
        <h2>Input Parameters</h2>
        <div>
          {input_parameters.length > 0 ? (
            input_parameters.map((param) => (
              <div key={param.name} className="param-container">
                <div className="param-top-row">
                  <span className="name">
                    <code>{param.name}</code>
                  </span>
                  <span className="type">
                    <code>{param.type}</code>
                  </span>
                  <span className="required">{param.required ? 'Required' : 'Optional'}</span>
                </div>
                <div>
                <ReactMarkdown>{param.description}</ReactMarkdown>
                </div>
                <div>
                  {param.examples && param.examples.length > 0 && (
                    <ul>
                      <span>Examples</span>
                      {param.examples.map((example) => (
                        <li key={example} className="example-item">
                          <code>{example}</code>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No input parameters available</p>
          )}
        </div>
      </div>

      <div className="functions-section">
        <h2>Output Parameters</h2>
        <div>
          {output_parameters.length > 0 ? (
            output_parameters.map((param) => (
              <div key={param.name} className="param-container">
                <div className="param-top-row">
                  <span className="name">
                    <code>{param.name}</code>
                  </span>
                  <span className="type">
                    <code>{param.type}</code>
                  </span>
                  <span className="required">{param.required ? 'Required' : 'Optional'}</span>
                </div>
                <div>
                  <p>{param.description}</p>
                </div>
                <div>
                  {param.examples && param.examples.length > 0 && (
                    <ul>
                      <span>Examples</span>
                      {param.examples.map((example) => (
                        <li key={example} className="example-item">
                          <code>{example}</code>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No output parameters available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiMethodPage;
