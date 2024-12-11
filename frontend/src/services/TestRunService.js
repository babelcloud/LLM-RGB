import store from "store2";
import { TestRun } from "@models/TestRun";
export class TestRunService {
    TEST_RUN_LIST_KEY = "TEST-RUN-LIST";
    TEST_RUN_INDEX_KEY = "TEST-RUN-INDEX";
    testRunList;
    testRunIndex;
    constructor() {
        this.testRunList = store.get(this.TEST_RUN_LIST_KEY);
        if (!this.testRunList) {
            this.testRunList = [];
        }
        else {
            this.testRunList = this.testRunList.map((t) => {
                const result = Object.create(TestRun.prototype);
                Object.assign(result, t);
                return result;
            });
        }
        this.testRunIndex = store.get(this.TEST_RUN_INDEX_KEY);
        if (!this.testRunIndex) {
            this.testRunIndex = 1;
            this.saveIndex();
        }
        if (this.testRunList.length < 1) {
            this.testRunList.push(this.new());
            this.save();
        }
    }
    listNames() {
        const result = [];
        this.testRunList.map((testRun) => result.push(testRun.name));
        return result;
    }
    getByName(name) {
        return this.testRunList.find((testRun) => testRun.name === name);
    }
    getByReportId(reportId) {
        return this.testRunList.find((testRun) => testRun.reportId === reportId);
    }
    add(testRun) {
        this.testRunList.push(testRun);
        this.save();
    }
    update(source) {
        this.testRunList = this.testRunList.map((target) => target.name === source.name ? source : target);
        this.save();
    }
    new() {
        const index = this.getNextIndex();
        return new TestRun(`Test ${index}`);
    }
    duplicate(name) {
        const index = this.getNextIndex();
        const sourceTestRun = this.getByName(name);
        if (sourceTestRun) {
            const targetTestRun = sourceTestRun.duplicate(`Test ${index}`);
            this.testRunList.push(targetTestRun);
            this.save();
            return targetTestRun;
        }
        return undefined;
    }
    delete(name) {
        this.testRunList = this.testRunList.filter((testRun) => testRun.name !== name);
        this.save();
    }
    getNextIndex() {
        this.testRunIndex += 1;
        this.saveIndex();
        return this.testRunIndex;
    }
    save() {
        store.set(this.TEST_RUN_LIST_KEY, this.testRunList);
    }
    saveIndex() {
        store.set(this.TEST_RUN_INDEX_KEY, this.testRunIndex);
    }
}
