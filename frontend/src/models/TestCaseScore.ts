export default class TestCaseScore {
    test_name: string;
    assertion_score: string;
    test_score: number;

    constructor(test_name: string, assertion_score: string, test_score: number) {
        this.test_name = test_name;
        this.assertion_score = assertion_score;
        this.test_score = test_score;
    }
}
