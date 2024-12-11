const fs = require('fs');
const path = require('path');

function listFiles(filePath) {
  const files = [];
  fs.readdirSync(filePath).forEach((file) => {
    files.push(file);
  });
  return files;
}

function resolveFileData(filePath, filename) {
  const basename = path.parse(filename).name;
  const parts = basename.split('_');
  const fileType = parts.pop();
  const testName = parts.join('_');
  return {
    type: fileType,
    name: testName,
    content: Buffer.from(fs.readFileSync(path.join(filePath, filename))).toString('base64'),
  };
}

function assembleSetter(data) {
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

function buildModuleContent(filePath) {
  const moduleTemplate = [
    'const ConfigMap = new Map();',
    'const PromptMap = new Map();',
    'const AssertMap = new Map();',
    '__SETTERS__',
    'export { ConfigMap, PromptMap, AssertMap };',
  ];

  const files = listFiles(filePath);
  const setters = [];
  files.map((file) => {
    const fileData = resolveFileData(filePath, file);
    const setter = assembleSetter(fileData);
    setters.push(setter);
    return file;
  });
  return moduleTemplate.join('\n').replace('__SETTERS__', setters.join('\n'));
}

module.exports = function testcasePlugin() {
  const moduleId = '@TestCaseData';
  const resolvedModuleId = `\0${moduleId}`;
  const testcasePath = path.resolve(__dirname, '../../testcases/');

  return {
    name: 'testcase-plugin',
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
};
