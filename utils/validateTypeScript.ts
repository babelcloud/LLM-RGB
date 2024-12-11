import * as ts from 'typescript';

interface TypeScriptValidationResult {
  isValid: boolean;
  matches: {
    hasInterface: boolean;
    hasType: boolean;
    hasClass: boolean;
  };
  error?: string;
}

export function validateTypeScript(content: string): TypeScriptValidationResult {
  try {
    const sourceFile = ts.createSourceFile(
      'temp.ts',
      content,
      ts.ScriptTarget.Latest,
      true
    );

    const matches = {
      hasInterface: false,
      hasType: false,
      hasClass: false
    };

    ts.forEachChild(sourceFile, node => {
      if (ts.isInterfaceDeclaration(node)) matches.hasInterface = true;
      if (ts.isTypeAliasDeclaration(node)) matches.hasType = true;
      if (ts.isClassDeclaration(node)) matches.hasClass = true;
    });

    return { isValid: true, matches };
  } catch (error) {
    return {
      isValid: false,
      matches: { hasInterface: false, hasType: false, hasClass: false },
      error: error instanceof Error ? error.message : 'Unknown error parsing TypeScript'
    };
  }
}
