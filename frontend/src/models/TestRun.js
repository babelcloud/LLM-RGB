import { cloneDeep } from "lodash";
export class TestRun {
    name;
    testCaseList = [];
    llmList = [];
    reportId = null;
    duration = 0;
    constructor(name, testCaseList, llmList) {
        this.name = name;
        if (testCaseList) {
            this.testCaseList = testCaseList;
        }
        if (llmList) {
            this.llmList = llmList;
        }
    }
    getTestCaseList() {
        return this.testCaseList;
    }
    setTestCaseList(testCaseList) {
        this.testCaseList = testCaseList;
    }
    getLlmList() {
        return this.llmList;
    }
    setLlmList(llmList) {
        this.llmList = llmList;
    }
    setReportId(reportId) {
        this.reportId = reportId;
    }
    finished() {
        return this.reportId !== null;
    }
    duplicate(name) {
        return new TestRun(name, cloneDeep(this.testCaseList), cloneDeep(this.llmList));
    }
    nextSeriesName() {
        let nextNumber = 1;
        const matches = this.name.match("[0-9]+");
        if (matches && matches.length > 0) {
            nextNumber = Number.parseInt(matches[0], 10) + 1;
        }
        return `Test ${nextNumber}`;
    }
}
