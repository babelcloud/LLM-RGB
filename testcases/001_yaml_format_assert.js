module.exports = (output, { vars }) => {
    const { verify } = require("../utils/verify")
    const { extractCodeBlock } = require("../utils/extractCode")
    var score = 0;

    var code = extractCodeBlock(output);
    var codeContent = code.replace(/^```typescript\n/, "").replace(/\n```$/, "");
    const fullCode = `
${codeContent}

const yamlString = \`
thought: I need to resolve the \\\`ModuleNotFoundError: No module named 'langchain_community'\\\` error by ensuring that all necessary dependencies are correctly installed.
selfCriticism: I should have verified the installation of all required dependencies before running the code.
command:
  name: runPython
  args:
    code: |-
      import sys
      !{sys.executable} -m pip install langchain openai langchain_community
    requirements: |-
      langchain
      openai
      langchain_community
\`

const result = convertToBlockStyleYaml(yamlString);
console.log("--- Test Result ---");
console.log(result);
`
    const result = verify(fullCode, "run");
    if(result.exitCode !== 0){
        score = 0;
    }
    else{
        score += 0.2;
        // extract the test result
        const testResult = result.stdout.indexOf("--- Test Result ---")
        const testResultString = result.stdout.substring(testResult);
        score += testResultString.includes("thought: |") ? 0.4 : 0;
        score += testResultString.includes("selfCriticism: |") ? 0.4 : 0;
    }
    
    return score;
};
