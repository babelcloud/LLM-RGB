export async function GetTestResultRaw(testId) {
    const response = await fetch(`/get-test-result-raw?testId=${testId}`);
    const text = await response.text();
    return JSON.parse(text);
}
