export default class TestCaseScore {
    test_name;
    assertion_score;
    test_score;
    constructor(test_name, assertion_score, test_score) {
        this.test_name = test_name;
        this.assertion_score = assertion_score;
        this.test_score = test_score;
    }
}
