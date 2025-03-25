const { extractCodeBlock } = require("../utils/extractCode")

module.exports = (output, { vars }) => {
    const expectedOutput = new Set([
        "django/db/models/sql/compiler.py",
        "django/db/models/sql/query.py",
    ]);
    let score = 0;
    const generatedCode = extractCodeBlock(output);
    if(output.startsWith("```")){
        score += 0.1;
    }
    try {
        const jsonContent = JSON.parse(
            String(generatedCode)
                .replace(/^```json\n/, "") // Remove the prefix
                .replace(/\n```$/, "") // Remove the suffix
        );
        const { target_files: targetFiles } = jsonContent;

        // check if targetFiles is an array
        if (!Array.isArray(targetFiles)) {
            return false;
        }
        const outputSet = new Set(targetFiles);
        if (outputSet.size == expectedOutput.size) {
            score += 0.1;
        }

        // check if targetFiles contains the expected output
        for (const file of expectedOutput) {
            if (outputSet.has(file)) {
                score += 0.4;
            }
        }
    } catch (error) {
        return false;
    }
    return score;
};
