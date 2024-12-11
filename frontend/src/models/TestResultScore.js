export default class TestResultScore {
    llm_id;
    scores;
    aggregated_scores;
    total_score;
    constructor(llm_id, scores, aggregated_scores, total_score) {
        this.llm_id = llm_id;
        this.scores = scores;
        this.aggregated_scores = aggregated_scores;
        this.total_score = total_score;
    }
}
