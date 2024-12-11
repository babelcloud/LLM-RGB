interface JSONValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateJSON(content: string): JSONValidationResult {
  try {
    JSON.parse(content);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing JSON'
    };
  }
}
