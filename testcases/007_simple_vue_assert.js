const { verify } = require("../utils/verify")
const { extractCodeBlock } = require("../utils/extractCode")

module.exports = (output, { vars }) => {
    var score = 0;
    const generatedCode = extractCodeBlock(output);
    const fullCode = `
${generatedCode}

import type { Equal, Expect } from '@type-challenges/utils'

SimpleVue({
  data() {
    // @ts-expect-error
    this.firstname
    // @ts-expect-error
    this.getRandom()
    // @ts-expect-error
    this.data()

    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return \`\${this.firstname} \${this.lastname}\`
    },
  },
  methods: {
    getRandom() {
      return Math.random()
    },
    hi() {
      alert(this.amount)
      alert(this.fullname.toLowerCase())
      alert(this.getRandom())
    },
    test() {
      const fullname = this.fullname
      const cases: [Expect<Equal<typeof fullname, string>>] = [] as any
    },
  },
})`

    if (output.startsWith("```")){
        score += 0.2;
    }
    const result = verify(fullCode);
    if (result.exitCode == 0){
        score += 0.8
    }
    return score;
};

