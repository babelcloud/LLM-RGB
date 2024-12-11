module.exports = async ({ output, assert }) => {
  // Test that LLM provides a concise summary despite long input
  const bulletPoints = output.match(/[•\-\*]\s+.+/g);
  assert(bulletPoints?.length === 3, "Response should contain exactly 3 bullet points");

  // Test that each bullet point is reasonably concise
  bulletPoints?.forEach((point, index) => {
    assert(
      point.length < 200,
      `Bullet point ${index + 1} should be concise (< 200 characters)`
    );
  });

  // Test that response doesn't include large chunks of original text
  assert(
    output.length < 500,
    "Response should not include large portions of the input text"
  );
};
