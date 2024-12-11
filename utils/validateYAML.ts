import * as yaml from 'js-yaml';

interface YAMLValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateYAML(content: string): YAMLValidationResult {
  try {
    yaml.load(content);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing YAML'
    };
  }
}
