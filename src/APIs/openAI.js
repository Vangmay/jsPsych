/**
 * Manage API issue from openAI
 *
 */


import OpenAI from "openai";
import { async } from '../../.jspsych-builder/js/app.js';

const openai = new OpenAI({
    apiKey: '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',
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