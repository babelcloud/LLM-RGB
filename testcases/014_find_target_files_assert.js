module.exports = (output, { vars }) => {
    try {
        const json = JSON.parse(
            String(output)
                .replace(/^```json\n/, "") // Remove the prefix
                .replace(/\n```$/, "") // Remove the suffix
        );
        const { targetFiles } = json;

        // check if targetFiles is an array
        if (!Array.isArray(targetFiles)) {
            console.log("t1");
            return false;
        }
        const outputSet = new Set(targetFiles);
        if (outputSet.size !== expectedOutput.size) {
            return false;
        }

        // check if targetFiles contains the expected output
        for (const file of expectedOutput) {
            if (!outputSet.has(file)) {
                return false;
            }
        }
        return true;
    } catch (error) {
        return false;
    }
};
