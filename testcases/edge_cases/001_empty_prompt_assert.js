module.exports = async ({ output, assert }) => {
  // Test that LLM provides a meaningful response even with minimal prompt
  assert(output.length > 0, "LLM should provide a non-empty response");
  assert(output.length < 1000, "Response should not be unnecessarily verbose");

  // Test that response acknowledges the lack of specific instructions
  assert(
    output.toLowerCase().includes("clarif") ||
    output.toLowerCase().includes("specif") ||
    output.toLowerCase().includes("instruct"),
    "LLM should acknowledge the lack of specific instructions"
  );

  // Test response structure
  assert(
    !output.includes("```") &&
    !output.includes("===") &&
    !output.includes("###"),
    "Response should not contain unnecessary formatting for a simple prompt"
  );
};
