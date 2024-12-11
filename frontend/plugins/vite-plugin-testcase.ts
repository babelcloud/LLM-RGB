import { readFileSync, readdirSync } from 'fs';
import { parse, dirname } from 'path';
import { fileURLToPath } from 'url';

type FileData = {
  type: string;
  name: string;
  content: string;
};

function listFiles(filePath: string): string[] {
  const files: string[] = [];
  readdirSync(filePath).forEach((file: string) => {
    files.push(file);
  });
  return files;
}

function resolveFileData(filePath: string, filename: string): FileData {
  const basename = parse(filename).name;
  const parts = basename.split('_');
  const fileType = parts.pop();
  const testName = parts.join('_');
  return {
    type: fileType,
    name: testName,
    content: Buffer.from(readFileSync(filePath + filename)).toString('base64'),
  };
}

function assembleSetter(data: FileData) {
  switch (data.type) {
    case 'config':
      return `ConfigMap.set('${data.name}', '${data.content}');`;
    case 'prompt':
      return `PromptMap.set('${data.name}', '${data.content}');`;
    case 'assert':
      return `AssertMap.set('${data.name}', '${data.content}');`;
  }
  return '';
}

function buildModuleContent(filePath: string) {
  const moduleTemplate = [
    'const ConfigMap = new Map();',
    'const PromptMap = new Map();',
    'const AssertMap = new Map();',
    '__SETTERS__',
    'export { ConfigMap, PromptMap, AssertMap };',
  ];

  const files = listFiles(filePath);
  const setters: string[] = [];
  files.map((file: string) => {
    const fileData = resolveFileData(filePath, file);
    const setter = assembleSetter(fileData);
    setters.push(setter);
    return file;
  });
  return moduleTemplate.join('\n').replace('__SETTERS__', setters.join('\n'));
}

export default function testcasePlugin() {
  const moduleId = '@TestCaseData';
  const resolvedModuleId = `\0${moduleId}`;
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const testcasePath = `${__dirname}/../../testcases/`;

  return {
    name: 'testcase-plugin', // required, will show up in warnings and errors
    resolveId(id: string) {
      if (id === moduleId) {
        return resolvedModuleId;
      }
      return null;
    },
    load(id: string) {
      if (id === resolvedModuleId) {
        return buildModuleContent(testcasePath);
      }
      return null;
    },
  };
}
