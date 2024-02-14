# Perception experiment
A JsPsych website for psychology experiment. During the experiment, openAI API will be called multiple times to generate the stimuli. The website is interactive, i.e the displayed content may change according to participants' choices. The introduction pages, stimuli pages and conclusion pages are sequentially shown to the participants.

This readme will explain how to install and use the website, as well as the design principles. For the design process, please refer to [issues](https://github.com/wdhub/jsPsych/issues).

For research purpose, the project is led by [Hui Sun](https://www.huisunsh.com/) from House of Innovation, Stockholm School of Economics. See paper (not published yet)...
Contact: [Yawen](yawend@kth.se), research assistant, if you have any question.

## Update:
In the latest release, the experiment is about letting participants decide if they accept the realtime-generated Haiku or not. If accepted, their reaction time and choices will be shown on the final page. Participants can reject the stimuli for maximun 3 times. This, however, is only a demo to build and test the tech stack.

Here is a screen record of how it works.
![s5](https://github.com/wdhub/jsPsych/assets/56460190/e25d39c5-dd27-4393-a664-e2f19b5f9512)


## Tech Stack:
The website is built around the [Jspsych](https://www.jspsych.org/7.3/) framework. The reason why we adopt this framework rather than React or VueX is that it provides ready-to-use process control plugins for behavioral experiments. Such as the timeline that navigates throughout the experiment, reaction time recorder, eye-tracker, etc. Besides the framework, [jsPsych Builder](https://github.com/bjoluc/jspsych-builder) is ultilized to set up and update the environment. With the simple commands like "npm run build" or "npm run jatos", the program could be packaged via the CLI.

[Jatos](https://www.jatos.org/) is used to manage experiment results. The reason why Jatos is preferred than Firebase is the built-in access control. For instance, researchers can choose in the panel the participant's access level of the shared URL link. Some could be submitted multiple times, some could be submitted only once in the same IP. 

To host the webiste remotely, a server in German with Docker on Ubuntu pre-installed is picked from [DigitalOcean](https://www.digitalocean.com/). The location is selected due to performance requirement and academic ethics. 

OpenAI API is maily called to generate the stimuli. In specific, [gpt-3.5-turbo-0125](https://platform.openai.com/docs/guides/text-generation/completions-api) is the currently used model, with the purpose of text generation. Each fetch of the API may take around 1 second, depending on the current load of openAI platform and the local network of the participant. Therefore, a loading feature is needed in the UI.

![图片1](https://github.com/wdhub/jsPsych/assets/56460190/691771bd-d73e-412b-bc14-aaf96f5b416e)

## installation:

- pip install jspsych-builder
- npm start
- create a "result" folder in the root and put txt experiment result inside, if you want to use the python file to parse result

## Configuration
Create a "api_config.js" in the root and add your own openAI api key, as:
```
const openai_key = '<your_api_key>';
export { openai_key};
```

## File structure
- views/
	- introView.js: the introduction page display, jump to stimuli page or end page
	- stimuliView.js: display the stimuli, jump to the same page under certain condition or to the end page
	- endView.js: display the results

- models/
	- resultModel.js:contain the global data related to API fetch results, user reactions
	- jsPsychModel.js:manage the jsPsych object

- APIs/
	- openAI.js:init and call openAI for various purposes

- utilities.js:repetitively used functions
- experiment.js: initialize and mount the exp

