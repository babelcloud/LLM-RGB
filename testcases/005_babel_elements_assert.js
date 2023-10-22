const yaml = require('js-yaml');
module.exports = (output, { vars }) => {
    if (output.length < 500) {
        return 0;
    } 
    var score = 0;
    var babel;
    try {
        babel = yaml.load(output);
    } catch (e) {
        var manifest = getManifest(output);
        babel = yaml.load(manifest);
    } finally {
        if (babel == null){
            return score;
        }
    }
    if (babel?.dependencies) {
        score = score + 0.1;
        if (Object.keys(babel.dependencies).length == 1){
            score = score + 0.1;
        }
    }
    if (babel?.elements) {
        score = score + 0.1;
        if (babel.elements.length >= 4) {
            score = score + 0.2;
        }
        var db = getElementByKind(babel.elements, "Database");
        if (db != null) {
            score = score + 0.2;
        }
        var frontend = getElementByKind(babel.elements, "Assets");
        if (frontend != null) {
            score = score + 0.1;
            if (frontend.items?.length > 1) {
                score = score + 0.2;
            }
        }
    }
    
    return Number(score.toFixed(1));
  };

function getManifest(input) {
    input = getDelimited(input);
    input = input.replace(/^---\n/, '');
    var yamlStart = input.indexOf("```yaml");
    if (yamlStart === -1) {
        return input;
    }
    var yamlEnd = input.indexOf("```", yamlStart + 7);
    if (yamlEnd === -1) {
        yamlEnd = input.length;
    }
    return input.substring(yamlStart + 7, yamlEnd).trim();
}

function getDelimited(input) {
    //if the input is delimited by ###
    var hashTagDelimiterStart = input.indexOf("###");
    if (hashTagDelimiterStart === -1) {
        return input;
    }
    var hashTagDelimiterEnd = input.indexOf("###", hashTagDelimiterStart + 3);
    if (hashTagDelimiterEnd === -1) {
        return input.substring(0, hashTagDelimiterStart);
    }
    return input.substring(hashTagDelimiterStart + 3, hashTagDelimiterEnd);
}

function getElementByKind(elements, kind) {
    for (let element of elements) {
        if (element.kind === kind) {
            return element;
        }
    }
    return null;
}