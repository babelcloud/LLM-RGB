module.exports = (output, { vars }) => {
    output = output.toLowerCase();
    const PATTERN_TARGET = "target winning pattern: mixed-win";
    const C1_PATTERN_ACTION = "action: discard c1";
    const C1_PATTERN_WAITING = "winning tile(s): b8\n";

    const B8_PATTERN_ACTION = "action: discard b8";
    const B8_PATTERN_WAITING = "winning tile(s): c1\n";

    var score = 0;
    if (output.includes(PATTERN_TARGET)){
        score += 0.3;
        if(output.includes(C1_PATTERN_ACTION)){
            score += 0.2;
            if(output.includes(C1_PATTERN_WAITING)){
                score += 0.5;
            }
        }
        else if(output.includes(B8_PATTERN_ACTION)){
            score += 0.1;
            if(output.includes(B8_PATTERN_WAITING)){
                score += 0.3;
            }
        }
    }

    return score;
};
