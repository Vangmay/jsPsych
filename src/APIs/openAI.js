/**
 * Manage API issue from openAI
 *
 */


import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: GLOBAL.OPENAI_API_KEY,
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