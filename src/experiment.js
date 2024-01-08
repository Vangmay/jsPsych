/**
 * @title demo
 * @description 
 * demo for HCI interview, 
 * please wait approx 3 second after pressing each button so that the API response is fetched
 * do not use/copy the API key any other purpose but trying this demo, as it's my personal billing
 * @author Yawen D
 * @version 0.1.0
 *
 * @assets assets/
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import { initJsPsych } from "jspsych";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true
    }
);

/**
 * This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @type {import("jspsych-builder").RunFunction}
 */
export async function run({ assetPaths, input = {}, environment, title, version }) {
  const jsPsych = initJsPsych();

  const timeline = [];

  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
  });

    var result = ""

    var s3 = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: '<p style="font-size:48px; color:red;">Final page</p>',
        prompt: function () {
            return result;
        }
    };
    var count = 0;
    var haiku = "waiting";
    var s2 = {
        type: htmlButtonResponse,
        choices: ['Accept', 'Re-generate'],
        stimulus: function () {
            return haiku;
        },
        on_start: async function getHaiku() {
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant designed to output JSON.",
                    },
                    { role: "user", content: "Generate a Haiku"},
                ],
                model: "gpt-3.5-turbo-1106",
                response_format: { type: "json_object" },
            });
            haiku = completion.choices[0].message.content;
            console.log(haiku);
            count += 1;
        },

        on_finish: function (data) {
            addRespFromButton(data);
            if (data.response == 0) {
                jsPsych.addNodeToEndOfTimeline(s3);
            }
            else {
                if (count >= 3)
                    jsPsych.addNodeToEndOfTimeline(s3)
                else
                    jsPsych.addNodeToEndOfTimeline(s2)

            }
        }
    };

    function addRespFromButton(data) {
        var accept = "rejected";
        if (data.response == 0)
            accept = "accepted";
        result += data.stimulus + "<br>"
            + accept + " " + data.rt + "ms"
            + "<br><br>";
    }

    var s1 = {
        type: htmlButtonResponse,
        stimulus: '<p style="font-size:48px; color:red;">Intro</p>',
        choices: ['Start', 'Exit'],

        //prepare haiku for next slide
        on_start: async function getHaiku() {
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
            haiku = completion.choices[0].message.content;
            console.log(haiku);
        },

      on_finish: function (data) {
          if (data.response == 0) {
              jsPsych.addNodeToEndOfTimeline(s2);
              console.log("jump to s2")
          }
          else {
              jsPsych.addNodeToEndOfTimeline(s3)
          }
      }
  };

    timeline.push(s1);


  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
