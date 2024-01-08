# Perception experiment
A JsPsych website for psychology experiment involving human perception to stimulis.
Author: Yawen, research assistant in SSE, HCI lab

## installation:

- pip install jspsych-builder
- npm start

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

