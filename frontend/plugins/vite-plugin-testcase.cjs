"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = testcasePlugin;
var fs_1 = require("fs");
var path_1 = require("path");
var path = require("path");
function listFiles(filePath) {
    var files = [];
    (0, fs_1.readdirSync)(filePath).forEach(function (file) {
        files.push(file);
    });
    return files;
}
function resolveFileData(filePath, filename) {
    var basename = (0, path_1.parse)(filename).name;
    var parts = basename.split('_');
    var fileType = parts.pop();
    var testName = parts.join('_');
    return {
        type: fileType,
        name: testName,
        content: Buffer.from((0, fs_1.readFileSync)(path.join(filePath, filename))).toString('base64'),
    };
}
function assembleSetter(data) {
    switch (data.type) {
        case 'config':
            return "ConfigMap.set('".concat(data.name, "', '").concat(data.content, "');");
        case 'prompt':
            return "PromptMap.set('".concat(data.name, "', '").concat(data.content, "');");
        case 'assert':
            return "AssertMap.set('".concat(data.name, "', '").concat(data.content, "');");
    }
    return '';
}
function buildModuleContent(filePath) {
    var moduleTemplate = [
        'const ConfigMap = new Map();',
        'const PromptMap = new Map();',
        'const AssertMap = new Map();',
        '__SETTERS__',
        'export { ConfigMap, PromptMap, AssertMap };',
    ];
    var files = listFiles(filePath);
    var setters = [];
    files.map(function (file) {
        var fileData = resolveFileData(filePath, file);
        var setter = assembleSetter(fileData);
        setters.push(setter);
        return file;
    });
    return moduleTemplate.join('\n').replace('__SETTERS__', setters.join('\n'));
}
function testcasePlugin() {
    var moduleId = '@TestCaseData';
    var resolvedModuleId = "\0".concat(moduleId);
    var testcasePath = path.resolve(__dirname, '../../testcases/');
    return {
        name: 'testcase-plugin',
        resolveId: function (id) {
            if (id === moduleId) {
                return resolvedModuleId;
            }
            return null;
        },
        load: function (id) {
            if (id === resolvedModuleId) {
                return buildModuleContent(testcasePath);
            }
            return null;
        },
    };
}
