module.exports = (output, { vars }) => {
    //output = output.toLowerCase();

    var score = 0;
    if (output.includes(`.split('\\n')`)){
        if(output.includes(`.startsWith('thought:')`)){
            score = 1
        }
        else if(output.includes(`.match`)){
            score = 1;
        }
    }

    return score;
};
