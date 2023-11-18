const fs = require('fs');
const path = require('path');

type FileData = {
  type: string,
  name: string,
  content: string
};

function listFiles(filePath: string): string[] {
  const files: string[] = [];
  fs.readdirSync(filePath).forEach(file => {
      files.push(file);
  });
  return files;
}

function resolveFileData(filePath: string, filename: string): FileData {
  const basename = path.parse(filename).name;
  const parts = basename.split('_');
  const fileType = parts.pop();
  const testName = parts.join('_');
  return {
    type: fileType,
    name: testName,
    content: btoa(unescape(encodeURIComponent(fs.readFileSync(filePath + filename)))),
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
  files.map(file => {
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
  const testcasePath = `${__dirname}/../../testcases/`;

  return {
    name: 'testcase-plugin', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === moduleId) {
        return resolvedModuleId;
      }
      return null;
    },
    load(id) {
      if (id === resolvedModuleId) {
        return buildModuleContent(testcasePath);
      }
      return null;
    },
  };
}
