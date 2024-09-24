exports.extractCodeBlock = function extractCodeBlock(text) {
  const codeBlockRegex = /```[a-z]*\n([\s\S]*?)```/;
  const match = text.match(codeBlockRegex);
  return match ? match[1].trim() : text;
};
