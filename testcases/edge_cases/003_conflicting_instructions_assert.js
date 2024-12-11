module.exports = async ({ output, assert }) => {
  // Test that LLM acknowledges the conflicting instructions
  assert(
    output.toLowerCase().includes("conflict") ||
    output.toLowerCase().includes("contradict") ||
    output.toLowerCase().includes("inconsistent"),
    "LLM should acknowledge the conflicting nature of instructions"
  );

  // Test that LLM makes a reasonable choice between conflicting requirements
  assert(
    output.length > 50 && output.length < 500,
    "Response should be reasonable length despite conflicting requirements"
  );

  // Test that LLM explains its choice
  assert(
    output.toLowerCase().includes("chose") ||
    output.toLowerCase().includes("decided") ||
    output.toLowerCase().includes("priorit"),
    "LLM should explain its choice between conflicting requirements"
  );

  // Test that the actual coffee-making process is described
  assert(
    output.toLowerCase().includes("coffee") &&
    (
      output.toLowerCase().includes("water") ||
      output.toLowerCase().includes("brew") ||
      output.toLowerCase().includes("grind")
    ),
    "Response should still address the main task of describing coffee-making"
  );
};
