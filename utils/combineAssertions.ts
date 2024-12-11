interface AssertionResult {
  passed: boolean;
  weight?: number;
  message?: string;
}

export function combineAssertions(assertions: AssertionResult[]): number {
  if (assertions.length === 0) return 0;

  const totalWeight = assertions.reduce((sum, assertion) =>
    sum + (assertion.weight ?? 1), 0);

  const weightedScore = assertions.reduce((sum, assertion) =>
    sum + (assertion.passed ? (assertion.weight ?? 1) : 0), 0);

  return weightedScore / totalWeight;
}
