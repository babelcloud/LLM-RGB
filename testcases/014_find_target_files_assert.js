module.exports = (output, { vars }) => {
    const expectedOutput = new Set([
        "django/db/models/sql/compiler.py",
        "django/db/models/sql/query.py",
    ]);
    try {
        const jsonContent = JSON.parse(
            String(output)
                .replace(/^```json\n/, "") // Remove the prefix
                .replace(/\n```$/, "") // Remove the suffix
        );
        const { target_files: targetFiles } = jsonContent;

        // check if targetFiles is an array
        if (!Array.isArray(targetFiles)) {
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
