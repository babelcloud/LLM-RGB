const yaml = require('js-yaml');
module.exports = (output, { vars }) => {
    var score = 0;
    var plan;
    try{
        plan = yaml.load(output);
    } catch (e){
        var manifest = getManifest(output);
        plan = yaml.load(manifest);
    } finally {
        if (plan == null){
            return score;
        }
    }
    
    if (plan.goal){
        score = score + 0.1;
    }
    if (plan.tasks){
        score = score + 0.1;
        if(plan.tasks.length > 3){
            score = score + 0.4;
        }
    }
    if (plan.next_task){
        score = score + 0.2;
        if (plan.next_task == 1){
            score = score + 0.2
        }
    }
    
    return Number(score.toFixed(1));
  };

function getManifest(input) {
    input = input.replace('---', '');
    const yamlStart = input.indexOf("```yaml");
    const yamlEnd = input.lastIndexOf("```");
    if (yamlStart >= 0) {
        const yamlEnd = input.indexOf("```", yamlStart + 7);
        if (yamlEnd > 0) {
            return input.substring(yamlStart + 7, yamlEnd);
        }
        else
            return input.substring(yamlStart + 7);
    } else if (yamlEnd >= 0) {
        return input.substring(0, yamlEnd);
    }
    else
        return input;
}