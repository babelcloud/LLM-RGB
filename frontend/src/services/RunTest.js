import YAML from "yaml";
import { AssertMap } from "@TestCaseData";
function encode(data) {
    return btoa(unescape(encodeURIComponent(data)));
}
class CustomTestCaseRequest {
    test_name;
    config;
    prompt;
    assert;
    constructor(test_name, config, prompt, assert) {
        this.test_name = test_name;
        this.config = config;
        this.prompt = prompt;
        this.assert = assert;
    }
}
class RunTestRequest {
    llms;
    testcases = [];
    custom_testcases = [];
    constructor(llms, custom_testcases) {
        this.llms = llms;
        if (custom_testcases !== undefined) {
            this.custom_testcases = custom_testcases;
        }
    }
}
export async function runTest(llms, tests, onProgress) {
    const llmItems = [];
    llms.map((llm) => {
        let targetItem = {};
        if (llm.key === "custom") {
            const key = `webhook:${llm.config.url}`;
            let config = {};
            if (typeof llm.config.config === "string") {
                try {
                    config = JSON.parse(llm.config.config);
                }
                catch {
                    // Handle error
                }
            }
            config.id = llm.config.id;
            targetItem = {
                [key]: config,
            };
        }
        else {
            targetItem = {
                [llm.key]: {
                    id: llm.id,
                    config: llm.config,
                },
            };
        }
        llmItems.push(targetItem);
        return false;
    });
    const customTestCases = [];
    tests.map((test) => {
        let assertJs = "";
        const assets = test.asserts.map((assert) => {
            const { ...requestAssert } = assert;
            if (test.readonly && assert.type === "javascript") {
                assertJs = AssertMap.get(`${test.name}_assert`) ?? "";
                if (assertJs !== "") {
                    requestAssert.value = `file://testcases/${test.name}_assert.js`;
                }
            }
            return requestAssert;
        });
        const configYaml = YAML.stringify([
            {
                description: test.description,
                threshold: test.threshold,
                vars: {
                    name: test.name,
                    difficulties: {
                        "context-length": test.contextLength,
                        "reasoning-depth": test.reasoningDepth,
                        "instruction-compliance": test.instructionCompliance,
                    },
                    prompt: `file://testcases/${test.name}_prompt.txt`,
                },
                assert: assets,
            },
        ]);
        customTestCases.push(new CustomTestCaseRequest(test.name, encode(configYaml), encode(test.prompt), assertJs));
        return true;
    });
    const request = new RunTestRequest(llmItems, customTestCases);
    const response = await fetch("/run-test", {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    const bodyStream = response.body;
    const reader = bodyStream?.getReader();
    let testId = "";
    while (reader !== undefined) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        const text = new TextDecoder("utf-8")
            .decode(value)
            .replace(/\s|"/g, "")
            .replace(/([\w-]+)/g, '"$1"')
            .replace(/"(\d+)"/g, "$1");
        try {
            const progress = JSON.parse(text);
            if (onProgress !== undefined) {
                testId = progress.testId;
                onProgress(progress);
            }
        }
        catch {
            break;
        }
    }
    return testId;
}
