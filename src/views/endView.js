/**
 * Ending page of the exp
 *
 */
import { getResult } from "../models/resultModel.js"
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

var s3 = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: '<p style="font-size:48px; color:red;">Final page</p>',
    prompt: function () {
        return getResult();
    }
};

export {
    s3
}