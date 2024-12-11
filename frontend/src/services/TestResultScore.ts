import TestResultScore from "@models/TestResultScore";

export async function GetTestResultScore(
  testId: string,
): Promise<TestResultScore[]> {
  const response = await fetch(`/get-test-result-score?testId=${testId}`);
  const text = await response.text();
  return JSON.parse(text);
}
