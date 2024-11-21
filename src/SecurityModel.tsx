import React, { useState } from "react";

// Define the ModelResponse type
type ModelResponse = {
  modelId: string;
  generatedText: string;
  citations: string[];
};

const SecurityModel = () => {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [bestResponse, setBestResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visibleCitations, setVisibleCitations] = useState<{ [key: string]: boolean }>({});

  // Handle query submission
  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    try {
      // Fetch results from Lambda
      const response = await fetch("https://f985wnbunl.execute-api.us-west-2.amazonaws.com/uat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json(); // Assuming Lambda returns the structure described above

      // Convert response into an array of model results for display
      const results: ModelResponse[] = Object.keys(data).map((modelId) => ({
        modelId,
        generatedText: data[modelId].generated_text,
        citations: data[modelId].citations,
      }));

      setResponses(results);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  // Handle best response submission
  const handleBestResponseSubmit = async () => {
    try {
      await fetch("https://your-lambda-url.com/saveBestResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, bestResponse }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving best response:", error);
    }
  };

  // Toggle citation visibility
  const toggleCitations = (modelId: string) => {
    setVisibleCitations((prev) => ({
      ...prev,
      [modelId]: !prev[modelId],
    }));
  };

  return (
    <div>
      <h1>ML Model Query Interface</h1>

      {/* Query Input Form */}
      <form onSubmit={handleQuerySubmit}>
        <label>
          Enter your query:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {/* Results Section */}
      {responses.length > 0 && (
        <div>
          <h2>Results</h2>
          {responses.map((result) => (
            <div key={result.modelId}>
              <h3>{result.modelId}</h3>
              <p>{result.generatedText}</p>
              <button onClick={() => toggleCitations(result.modelId)}>
                {visibleCitations[result.modelId] ? "Hide Citations" : "Show Citations"}
              </button>
              {visibleCitations[result.modelId] && (
                <ul>
                  {result.citations.map((citation, index) => (
                    <li key={index}>{citation}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Best Response Selection */}
      {responses.length > 0 && (
        <div>
          <h2>Select the Best Response</h2>
          <label>
            Choose the best response:
            <select
              value={bestResponse}
              onChange={(e) => setBestResponse(e.target.value)}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              <option value="">Select</option>
              {responses.map((result) => (
                <option key={result.modelId} value={result.modelId}>
                  {result.modelId}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleBestResponseSubmit}>Submit</button>
        </div>
      )}

      {/* Submission Confirmation */}
      {submitted && <p>Best response saved successfully!</p>}
    </div>
  );
};

export default SecurityModel;