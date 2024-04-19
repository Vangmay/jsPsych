/**
 * Manage API issue from openAI
 *
 */


import OpenAI from "openai";
import { getBase64 } from "../utilities";

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

//ask openai to generate titles from base64 image
async function base64toTitle(base64) {
    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "Generate 26 different titles out of this image." },
                    {
                        type: "image_url",
                        image_url: {
                            "url": `${base64}`,
                        },
                    },
                ],
            },
        ],
        max_tokens: 300,
    });
    return response.choices[0].message.content;
}

//clean the numbers and symbols
function cleanTitles(titles) {
    var tArray = titles.split("\n");
    //remove the numbers, symbols, blank space fpr valid titles
    var clean = [];
    tArray.forEach((tt,index) => {
        if ((tt.length < 50) && (tt.length > 2))
            clean.push(tt.replace(/[^a-zA-Z ]/g, '').trim());
    });
    console.log("the titles are cleaned");
    return clean;
}
async function getTitle_API(path) {
    return new Promise((resolve) => {
        //convert to base64
        window.URL = window.URL || window.webkitURL;
        var xhr = new XMLHttpRequest();
        xhr.open("get", path, true);
        xhr.responseType = "blob";

        xhr.onload = function () {
            if (this.status == 200) {
                var blob = this.response;
                let oFileReader = new FileReader();
                oFileReader.onloadend = async function (e) {
                    let base64 = e.target.result;
                    //fetch from openai
                    var rawTitles = await base64toTitle(base64);
                    //clean the format
                    resolve(cleanTitles(rawTitles));
                };
                oFileReader.readAsDataURL(blob);
            }
        }
        xhr.send();
    });  
}

export {
    openai,
    getHaiku_API,
    getTitle_API,
}