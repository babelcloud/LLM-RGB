module.exports = (output, { vars }) => {
    output = output.toLowerCase();
    const C1_PATTERN_ACTION = "action: discard c1";
    const C1_PATTERN_TARGET = "target winning pattern: mixed-win";
    const C1_PATTERN_WAITING = "winning tile(s): b8\n";

    const B8_PATTERN_ACTION = "action: discard b8";
    const B8_PATTERN_TARGET = "target winning pattern: mixed-win";
    const B8_PATTERN_WAITING = "winning tile(s): c1\n";

    if (output.includes(C1_PATTERN_ACTION) && output.includes(C1_PATTERN_TARGET) && output.includes(C1_PATTERN_WAITING)) {
        return 1;
    }
    if (output.includes(B8_PATTERN_ACTION) && output.includes(B8_PATTERN_TARGET) && output.includes(B8_PATTERN_WAITING)) {
        return 0.6;
    }
    if (output.includes(C1_PATTERN_TARGET)){
        return 0.2;
    }
    return 0;
};
