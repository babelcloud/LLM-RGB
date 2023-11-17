import LLM from '@models/LLM';
import TestCase from '@models/TestCase';
import YAML from 'yaml';
import { AssertMap } from '@TestCaseData';

function encode(data: string): string {
  return btoa(unescape(encodeURIComponent(data)));
}

class CustomTestCaseRequest {
  test_name: string;
  config: string;
  prompt: string;
  assert: string | undefined;

  constructor(test_name: string, config: string, prompt: string, assert?: string) {
    this.test_name = test_name;
    this.config = config;
    this.prompt = prompt;
    this.assert = assert;
  }
}

class RunTestRequest {
  llms: object[];
  testcases: string[] = [];
  custom_testcases: CustomTestCaseRequest[] = [];

  constructor(llms: object[], custom_testcases?: CustomTestCaseRequest[]) {
    this.llms = llms;
    if (custom_testcases !== undefined) {
      this.custom_testcases = custom_testcases;
    }
  }
}

export type RunTestProgress = {
  testId: string;
  progress: number;
  total: number;
};

export interface onProgress {
  (arg0: RunTestProgress): void;
}

export async function runTest(
  llms: LLM[],
  tests: TestCase[],
  onProgress?: onProgress
): Promise<string> {
  const llmItems: object[] = [];
  llms.map((llm) => {
    let targetItem = {};
    if (llm.key === 'custom') {
      const key = `webhook:${llm.config.url}`;
      let config: { id?: string | null } = {};
      if (typeof llm.config.config === 'string') {
        try {
          config = JSON.parse(llm.config.config);
        } catch (e) {
          console.log(e);
        }
      }
      config.id = llm.config.id;
      targetItem = {
        [key]: config,
      };
    } else {
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

  const customTestCases: CustomTestCaseRequest[] = [];

  tests.map((test) => {
    let assertJs = '';
    const assets = test.asserts.map(a => {
      const { id: _, ...requestAssert } = a;
      // Use external assert js for default test case
      if (test.readonly && a.type === 'javascript') {
        assertJs = AssertMap.get(`${test.name}_assert`) ?? '';
        if (assertJs !== '') {
          requestAssert.value = `file://testcases/${test.name}_assert.js`;
        }
      }
      return requestAssert;
    });

    const configYaml = YAML.stringify([{
      description: test.description,
      threshold: test.threshold,
      vars: {
        name: test.name,
        difficulties: {
          'context-length': test.contextLength,
          'reasoning-depth': test.reasoningDepth,
          'instruction-compliance': test.instructionCompliance,
        },
        prompt: `file://testcases/${test.name}_prompt.txt`,
      },
      assert: assets,
    }]);
    customTestCases.push(
      new CustomTestCaseRequest(
        test.name,
        encode(configYaml),
        encode(test.prompt),
        assertJs,
      )
    );
    console.log(configYaml);
    return true;
  });

  const request = new RunTestRequest(llmItems, customTestCases);
  console.log(JSON.stringify(request));

  const response = await fetch('/run-test', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const bodyStream = response.body;
  const reader = bodyStream?.getReader();

  let testId = '';

  while (reader !== undefined) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const text = new TextDecoder('utf-8')
      .decode(value)
      .replace(/\s|"/g, '')
      .replace(/([\w-]+)/g, '"$1"')
      .replace(/"(\d+)"/g, '$1');
    try {
      const progress: RunTestProgress = JSON.parse(text);
      if (onProgress !== undefined) {
        testId = progress.testId;
        onProgress(progress);
      }
    } catch (e) {
      break;
    }
  }

  return testId;
}
