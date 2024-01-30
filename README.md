# Perception experiment
A JsPsych website for psychology experiment involving human perception to stimulis.
Author: Yawen, research assistant in SSE, HCI lab

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

