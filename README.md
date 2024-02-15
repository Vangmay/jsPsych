# Perception experiment
A JsPsych website for psychology experiment. During the experiment, openAI API will be called multiple times to generate the stimuli. The website is interactive, i.e the displayed content may change according to participants' choices. The introduction pages, stimuli pages and conclusion pages are sequentially shown to the participants.

This readme will explain how to install and use the website, as well as the design principles. For the design process, please refer to [issues](https://github.com/wdhub/jsPsych/issues).

<<<<<<< Updated upstream
For research purpose, the project is led by [Hui Sun](https://www.huisunsh.com/) from House of Innovation, Stockholm School of Economics. See paper (not published yet)...
Contact: [Yawen](yawend@kth.se), research assistant, if you have any question.
=======
- pip install jspsych-builder
- npm start
- create a "result" folder in the root and put txt experiment result inside, if you want to use the python file to parse result. 
>>>>>>> Stashed changes

## Update:
In the latest release, the experiment is about letting participants decide if they accept the realtime-generated Haiku or not. If accepted, their reaction time and choices will be shown on the final page. Participants can reject the stimuli for maximun 3 times. This, however, is only a demo to build and test the tech stack.

Here is a screen record of how it works.
![s5](https://github.com/wdhub/jsPsych/assets/56460190/e25d39c5-dd27-4393-a664-e2f19b5f9512)


## Tech Stack:
The website is built around the [Jspsych](https://www.jspsych.org/7.3/) framework. The reason why we adopt this framework rather than React or VueX is that it provides ready-to-use process control plugins for behavioral experiments. Such as the timeline that navigates throughout the experiment, reaction time recorder, eye-tracker, etc. Besides the framework, [jsPsych Builder](https://github.com/bjoluc/jspsych-builder), a React ClI, is ultilized to set up and update the environment. With the simple commands like "npm run build" or "npm run jatos", the program could be packaged.

[Jatos](https://www.jatos.org/) is used to manage experiment results. The reason why Jatos is preferred than Firebase is the built-in access control. For instance, researchers can choose in the panel the participant's access level of the shared URL link. Some could be submitted multiple times, some could be submitted only once in the same IP. 

To host the webiste remotely, a server in German with Docker on Ubuntu pre-installed is picked from [DigitalOcean](https://www.digitalocean.com/). The location is selected due to performance requirement and academic ethics. 

OpenAI API is maily called to generate the stimuli. In specific, [gpt-3.5-turbo-0125](https://platform.openai.com/docs/guides/text-generation/completions-api) is the currently used model, with the purpose of text generation. Each fetch of the API may take around 1 second, depending on the current load of openAI platform and the local network of the participant. Therefore, a loading feature is needed in the UI.

![图片1](https://github.com/wdhub/jsPsych/assets/56460190/691771bd-d73e-412b-bc14-aaf96f5b416e)

## Get Started
- Before you get started: 
	- make sure you have git bash/github desktop and `npm` installed in your computer
	- In need of hosting the webiste remote, there should be a server with Jatos installed. 
	- In need of parsing the results via the python codes, a python IDE, e.g PyCharm, might need to be used.

- Download the repository under your chosen directory via
```
git clone https://github.com/wdhub/jsPsych.git
```

- Configuration: Create a "api_config.js" in the root and add your own openAI api key, as:
```
const openai_key = '<your_api_key>';
export { openai_key};

```

- Run the website locally: open the CMD under the directory and enter this line. It might take some minutes in the first time. 
```
npm start
```
Enter `localhost:3000` in your browser as the npm indicates project running. If the website is able to interact as the demo, the environment are set up successfully.

- Run the experiment remotely: Package the experiment via
```
npm run jatos
```
The packaged `.jzip` file will be found in the `/packaged`. Then import it in your remote Jatos server and run. If it runs as local, congratulations! The project is installed in your cloud server.

- Parse results: create a `/result` folder in the root and put txt experiment result inside, if you want to use the python file to parse results.The parsed result will be saved as CSV file in the same `/result` folder.

## Programming Guide
You are welcome to customize your own experiment on this project. Here I will explain the design of the architecture a bit, so that it's easier to follow. Instead of the full MVP model, we use a simplified version, consisting only of views and models. 

The views only care about UI and pass the data to models by calling the methods from models. Such as `setResult()` and `getHaiku_API()`. Given the nature of experiments, 3 kinds of views are designed, focusing on introducing the experiment, interacting with the participants with actual stimulis and showing the result respectively. Each view may have multiple slides, depending on the experiment. Yet we try to keep the structure clean, with intro view merely displaying instructions and end view merely indicating the end of the experiment. The rest of the API fetch and so on should be in the stimuli view. In the future, there might be a personal-data view and a try-out view, if required in the experiment. Models are the ones which actually process and store the data, and handling API requests. As for updating the data to Jatos, this is currently handled by jspsych-builder automatically.

### Useful Links
- [Plugins in Jspsych](https://www.jspsych.org/7.3/plugins/list-of-plugins/)
- [How to set up a new experiment via jsPsych Builder](https://github.com/bjoluc/jspsych-builder)
- [Step-by-step install Jatos in DigitalOcean](https://www.jatos.org/next/JATOS-on-DigitalOcean.html)
- [Examples of experiments using Jatos (Jspsych, React, etc)](https://www.jatos.org/Example-Studies.html)

### File Structure
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

