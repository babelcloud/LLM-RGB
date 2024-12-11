import store from "store2";
import YAML from "yaml";
import TestCase from "@models/TestCase";
import { AssertMap, ConfigMap, PromptMap } from "@TestCaseData";
import { TestCaseAssert } from "@models/TestCaseAssert";
class TestCaseService {
    NAMESPACE = "test.case";
    store;
    defaultList;
    constructor() {
        this.store = store.namespace(this.NAMESPACE);
        this.defaultList = this.getDefault();
    }
    list() {
        const items = this.store.getAll() ?? [];
        const customList = Object.keys(items).map((key) => {
            const result = Object.create(TestCase.prototype);
            Object.assign(result, items[key]);
            return result;
        });
        return [
            ...this.defaultList,
            ...customList.sort((left, right) => parseInt(left.created, 10) - parseInt(right.created, 10)),
        ];
    }
    set(testCase) {
        this.store.set(this.key(testCase.created), testCase);
    }
    setList(testCases) {
        this.store.clearAll();
        testCases.map((testCase) => {
            if (!testCase.readonly) {
                this.set(testCase);
            }
            return testCase;
        });
    }
    del(testCase) {
        this.store.remove(this.key(testCase.created));
    }
    getDefault() {
        const result = [];
        ConfigMap.forEach((value, key) => {
            const prompt = PromptMap.get(key.replace("_config", "_prompt"));
            const data = YAML.parse(this.decode(value));
            const item = data.pop();
            const asserts = [];
            if (Array.isArray(item.assert)) {
                item.assert.map((assert) => {
                    let assertValue = assert.value;
                    if (assert.type === "javascript") {
                        const assertFile = AssertMap.get(key.replace("_config", "_assert"));
                        if (assertFile !== undefined) {
                            assertValue = this.decode(assertFile);
                        }
                    }
                    asserts.push(new TestCaseAssert(assert.type, assertValue ?? "", assert.weight ?? 1));
                    return assert;
                });
            }
            const testCase = new TestCase(item.vars.name, item.threshold, item.vars.difficulties["context-length"], item.vars.difficulties["reasoning-depth"], item.vars.difficulties["instruction-compliance"], item.description, this.decode(prompt ?? ""), asserts);
            testCase.readonly = true;
            result.push(testCase);
        });
        return result;
    }
    key(name) {
        return name;
    }
    decode(data) {
        return decodeURIComponent(escape(atob(data)));
    }
}
const testCaseService = new TestCaseService();
export { testCaseService };
