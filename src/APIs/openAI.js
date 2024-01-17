/**
 * Manage API issue from openAI
 *
 */


import OpenAI from "openai";
import { openai_key } from "../../api_config.js"

const openai = new OpenAI({
    apiKey: openai_key,
    dangerouslyAllowBrowser: true
}
);

async function getHaiku_API() {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output JSON.",
            },
            { role: "user", content: "Generate a Haiku" },
        ],
        model: "gpt-3.5-turbo-1106",
        response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content;
}

export {
    openai,
    getHaiku_API
}