import TestCaseScore from './TestCaseScore';
import TestAggregatedScore from './TestAggregatedScore';

export default class TestResultScore {
  llm_id: string | undefined;
  scores: TestCaseScore[] | undefined;
  aggregated_scores: TestAggregatedScore | undefined;
  total_score: number | undefined;

  constructor(
    llm_id?: string,
    scores?: TestCaseScore[],
    aggregated_scores?: TestAggregatedScore,
    total_score?: number,
  ) {
    this.llm_id = llm_id;
    this.scores = scores;
    this.aggregated_scores = aggregated_scores;
    this.total_score = total_score;
  }
}
