# 002_code_completion

## Prompt

You are an AI software developer. You will be provided with the TypeScript code that the user is working on, delimited by triple hashtags. The user is currently stopped at "<cursor_is_here>". Please complete this line of code. Code only, no explanations.

###
import Config from "#config";
import { Configuration, OpenAIApi } from "openai";

export default async function (history:[], instruction: string) {
    const configuration = new Configuration({
        apiKey: Config.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const messages = await build<cursor_is_here>

}

/*
* Build messages for OpenAI based on instructions.
*/
async function buildMessages (history: [], instruction: string) {
    switch (instruction) {
        case "chat":
            history.unshift({
                "role": "system",
                "content": "You are a helpful assistant."
            });
            break;
        case "summarize":
            history.unshift({
                "role": "system",
                "content": "Summarize user's message within 20 words."
            });
            break;
        case "complete":
            history.unshift({
                "role": "system",
                "content": "Complete the following text within 60 words."
            });
            break
        case "code":
            history.unshift({
                "role": "system",
                "content": "Complete the following code."
            });
            break
        default:
        //do nothing
    }
    return history;
}
###

## Response

openai.createChatCompletion

