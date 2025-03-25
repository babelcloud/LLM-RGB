const { extractCodeBlock } = require("../utils/extractCode")

module.exports = (output, { vars }) => {

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
        if(jsonContent.color.toLowerCase() === "red"){
            score += 0.9;
        }
    } catch (error) {
        return score;
    }
    return score;
};
