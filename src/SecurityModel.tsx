/*eslint-disable no-unused-vars */
import React, { useState } from "react";

const SecurityModel = () => {
const [query, setQuery] = useState("");
const [responses, setResponses] = useState([]);
const [bestResponse, setBestResponse] = useState("");
const [submitted, setSubmitted] = useState(false);


// Handle query submission
const handleQuerySubmit = async (e:React.FormEvent) => {
e.preventDefault();
setSubmitted(false);
try {
// Simulate fetching results from Lambda
const response = await fetch("https://your-lambda-url.com/getResults", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ query }),
});
const data = await response.json(); // Assuming Lambda returns an array of results
setResponses(data.results || ["Model 1 Result", "Model 2 Result", "Model 3 Result"]);
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

return (
<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
    <button type="submit" style={{ marginLeft: "10px", padding: "5px 10px" }}>
      Submit
    </button>
  </form>

  {/* Results Section */}
  {responses.length > 0 && (
    <div style={{ marginTop: "20px" }}>
      <h2>Results</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {responses.map((result, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              width: "30%",
            }}
          >
            <h3>Model {index + 1}</h3>
            <p>{result}</p>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Best Response Selection */}
  {responses.length > 0 && (
    <div style={{ marginTop: "20px" }}>
      <h2>Select the Best Response</h2>
      <label>
        Choose the best response:
        <select
          value={bestResponse}
          onChange={(e) => setBestResponse(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value="">Select</option>
          {responses.map((_, index) => (
            <option key={index} value={`Model ${index + 1}`}>
              Model {index + 1}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={handleBestResponseSubmit}
        style={{ marginLeft: "10px", padding: "5px 10px" }}
        disabled={!bestResponse}
      >
        Submit
      </button>
    </div>
  )}

  {/* Submission Confirmation */}
  {submitted && <p style={{ marginTop: "20px", color: "green" }}>Best response saved successfully!</p>}
</div>
);
};

export default SecurityModel;