import TestResultRaw from "@models/TestResultRaw";

export async function GetTestResultRaw(testId: string): Promise<TestResultRaw> {
  const response = await fetch(`/get-test-result-raw?testId=${testId}`);
  const text = await response.text();
  return JSON.parse(text);
}
