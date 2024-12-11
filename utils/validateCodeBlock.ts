interface CodeBlockValidationResult {
  isValid: boolean;
  language?: string;
  error?: string;
}

export function validateCodeBlock(content: string): CodeBlockValidationResult {
  const codeBlockRegex = /^```([a-zA-Z]*)\n([\s\S]*?)\n```$/;
  const match = content.match(codeBlockRegex);

  if (!match) {
    return {
      isValid: false,
      error: 'No code block found or invalid format'
    };
  }

  return {
    isValid: true,
    language: match[1] || 'plaintext'
  };
}
