import TestCaseDifficulties from "./TestCaseDifficulties";

export default class TestCaseStat {
  name: string;
  max_score: number;
  difficulties: TestCaseDifficulties;

  constructor(
    name: string,
    max_score: number,
    difficulties: TestCaseDifficulties,
  ) {
    this.name = name;
    this.max_score = max_score;
    this.difficulties = difficulties;
  }
}
