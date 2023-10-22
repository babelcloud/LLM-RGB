const yaml = require('js-yaml');
module.exports = (output, { vars }) => {
    var score = 0;
    var tool;
    try{
        tool = yaml.load(output);
    } catch (e) {
        var manifest = getManifest(output);
        tool = yaml.load(manifest);
    } finally {
        if (tool == null){
            return score;
        }
    }

    if (tool?.tool_to_use == "book_room") {
        score = score + 0.3;
    }
    if (Object.keys(tool?.parameters).length >= 3) {
        score = score + 0.3;
        if (tool.parameters.days == 4) {
            score = score + 0.3;
        }
        if (tool.parameters.hotel_name == "Marriott") {
            score = score + 0.1;
        }
    }
    return Number(score.toFixed(1));
  };

function getManifest(input) {
    input = input.replace(/^---\n/, '');
    const yamlStart = input.indexOf("```yaml");
    if (yamlStart === -1) {
        return "";
    }
    const yamlEnd = input.indexOf("```", yamlStart + 7);
    if (yamlEnd === -1) {
        return "";
    }
    return input.substring(yamlStart + 7, yamlEnd);
}