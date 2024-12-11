import TestResultStats from "@models/TestResultStats";

export async function GetTestResultStats(
  testId: string,
): Promise<TestResultStats> {
  const response = await fetch(`/get-test-stats?testId=${testId}`);
  const text = await response.text();
  return JSON.parse(text);
}
