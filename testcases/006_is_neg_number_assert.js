const { verify } = require("../utils/verify")
const { extractCodeBlock } = require("../utils/extractCode")

module.exports = (output, { vars }) => {
    var score = 0;
    const generatedCode = extractCodeBlock(output);
    const fullCode = `
${generatedCode}

import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsNegativeNumber<0>, false>>,
  Expect<Equal<IsNegativeNumber<number>, never>>,
  Expect<Equal<IsNegativeNumber<-1 | -2>, never>>,
  Expect<Equal<IsNegativeNumber<-1>, true>>,
  Expect<Equal<IsNegativeNumber<-1.9>, true>>,
  Expect<Equal<IsNegativeNumber<-100_000_000>, true>>,
  Expect<Equal<IsNegativeNumber<1>, false>>,
  Expect<Equal<IsNegativeNumber<1.9>, false>>,
  Expect<Equal<IsNegativeNumber<100_000_000>, false>>,
]`

    if (output.startsWith("```")){
        score += 0.2;
    }
    const result = verify(fullCode);
    if (result.exitCode == 0){
        score += 0.8
    }
    return score;
};

