export async function GetTestResultStats(testId) {
    const response = await fetch(`/get-test-stats?testId=${testId}`);
    const text = await response.text();
    return JSON.parse(text);
}
