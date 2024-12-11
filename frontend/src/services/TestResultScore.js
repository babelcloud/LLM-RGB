export async function GetTestResultScore(testId) {
    const response = await fetch(`/get-test-result-score?testId=${testId}`);
    const text = await response.text();
    return JSON.parse(text);
}
