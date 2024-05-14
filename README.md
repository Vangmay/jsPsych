# Perception experiment
A JsPsych website for psychology experiment. During the experiment, openAI API will be called multiple times to generate the stimuli. The website is interactive, i.e the displayed content may change according to participants' choices. Sequentially, the participants would be shown with the introductions, interaction pages, surveys and an ending page.

This readme will explain how to install and use the program, as well as the design principles. For the design process, please refer to [issues](https://github.com/wdhub/jsPsych/issues).

For research purpose, the project is led by [Hui Sun](https://www.huisunsh.com/) from House of Innovation, Stockholm School of Economics. See paper (not published yet)...
Contact: [Yawen](yawend@kth.se), research assistant, if you have any question.

## Features:
- Intergrated with `openAI API`
- Basic level of security for keys and user data
- Customized `Jspysch-based` components
- Easy developing with components as building blocks
- Customized Python algorithm for parsing experiment result into `.csv`
- Integrated with basic Python libraries via `Pyodide`, e.g `scikit-learn`, `numpy`, etc.
- User guidance, preventing participant's distraction, inproper login devices, incorrect operations, etc
- Easy launching via `Jatos`

## Update:
In the latest release, the experiment allows participants to come up with a painting title collaborating with the AI. After reading the instructions, they have the choice to accept the generated title or to generate a new one, as well as controlling the similarity of the coming title via a slider. Once a title is picked, participant could optionally propose their own titles. In the following survey, user validation on the interaction and some additional information are required. Finally, participants would be directed to a Prolific page for their rewards, etc.

Here is a link to try it out: [demo at Jatos](http://157.230.27.41/publix/hs9Qsc19DJ0)

If the link no long works, this is a screen record of how it works.
![demo](https://github.com/wdhub/jsPsych/assets/56460190/e30b7e45-11cf-420f-9f9d-21fc3414f0c1)

## Get Started: Launching the experiment
- Before you get started: 
	- make sure you have git bash/github desktop and `npm` installed in your computer
	- In need of hosting the webiste remote, there should be a server with Jatos installed. 
	- In need of parsing the results via the python codes, a python IDE, e.g PyCharm, might need to be used.
	- recommended version: `Node.js>=18`, browser `Firefox>=112`, as required by Pyodide.

### Local installation and configuration
#### Download the repository under your chosen directory via
```
git clone https://github.com/wdhub/jsPsych.git
```
If you have downloaded it before, fetch the latest via `pull` or `merge` it to your local branch.

#### Configuration: 
- Load the plugin that enables webpack knowing the environment variables. Open the CMD under the directory and enter this line. 
	```
	npm i webpack-define-envs-plugin
	```	
- Choose to use the prepared similarity table. Before enabling API calls, you may want to try the program all at local. We provide a solution, which simulate the user-API interaction via a look-up table. To activate the table, set the `algo.useTable` to `true` in src/experiment.js. I.e,
`const algo = { "useTable": true};`

How different building blocks are activated are further explained in the Programing Guide.

#### Local Run: 
- Run the website locally: open the CMD under the directory and enter this line. It might take some minutes in the first time. 
```
npm start
```
Enter `localhost:3000` in your browser as the npm indicates project running. If the website is able to interact as the demo, the environment are set up successfully.

### Integrate OpenAI API
#### Get your own [OpenAI key](https://platform.openai.com/docs/quickstart). 
About the [price](https://platform.openai.com/docs/guides/rate-limits/usage-tiers?context=tier-free), free OpenAI API is limited to 3 requests per minutes. To enable multiple participants, we recommend you to at least update the billing plan to Tier1. This, in the case of painting title generation, allow maximum 20 simultaneous visits.

#### Encrypt your openai key. 
The leakage of API key will results to unwanted billings and ban from OpenAI. So it is vital to protect the key. In this program, base64 encryption is used. To encrypt your key, run this line in a JS environment, e.g Visual studio, the console of browser, and then copy the result.
```
btoa(your_encrypted_key);
```

However, we recommend you to use more complex methods and then modify the decoding function in `API/openAI,js` accordingly. Because the current method merely serves as an example of encryption and could be decrypted with some effort.
	
#### Add the encrypted key as a system environment variable.
Open the advanced setting in your PC and add a new system environment variable. This is adviced by openAI for [security reasons](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).
```
	Variable name:OPENAI_API_KEY
	Variable value:<your_encrypted_key>
```
#### Disable the look-up table.
To activate the real API interaction, set the `algo.useTable` to `false` in `src/experiment.js`. I.e,
```
const algo = { "useTable": false};
```
How different building blocks are activated are further explained in the Programing Guide.

Now run the experiment again via `npm start` in CMD. If your OpenAI API is successfully configured, the interface should generate the titles in realtime,  just as the look-up table simulated.

### Launching in Jatos
#### Hosting Jatos locally
If there's no server yet, you can validate the data management in local Jatos temporally. This is done by:
- Package the experiment in the CMD under the directory and the packaged `.jzip` file will be found in the `/packaged`
```
npm run jatos
```
- [Download Jatos](https://www.jatos.org/Get-started.html).
-  Double-click on loader.bat in the Jatos folder.
- Open [localhost:9000](http://localhost:9000/) in your browser.
- Import `.jzip` file in Jatos GUI and run the experiment. 

After finishing the experiment, there should be an entry of result in _Study Results_ in local Jatos GUI. If the state of the result is marked as FINISHED and the message contains data, it means Jatos can now manage the experiment.

#### Hosting Jatos in a server
In this project, DigitalOcean is used to host Jatos. However, you may use other cloud providers as AWS, Google Cloud, Azure etc. Here are the steps:
- Set up an account with [DigitalOcean](https://www.digitalocean.com/)
- Create a [Droplet](https://cloud.digitalocean.com/droplets/new?appId=87786318&image=docker-20-04&type=applications) by setting Marketplace with Docker on Ubuntu, plan, datacenter region, password, backup, etc. Please check the regulation about data storage in your project/institution and select the proper datacenter.
- Activate User Data, type the script and wait for the setup finishing in some minutes:
```
#!/bin/bash
# Run JATOS as docker container
docker run -d --restart=always -p 80:9000 jatos/jatos:latest
```
- Login the Jatos server with the Droplet IP address into your browser. Both username and password are ‘admin’
- Change the password
- Package the experiment in the CMD under the directory and the packaged `.jzip` file will be found in the `/packaged`
```
npm run jatos
```
- Import `.jzip` file in Jatos GUI. 
- Share the experiment to participants by creating various study links. To test the experiment, it's recommended to create a personal-multiple link which enable you to examin the prototype many times. To limit the participants, you may provide them with personal-single link. The access and limitation of each link can be found [here](https://www.jatos.org/Run-your-Study-with-Study-Links.html).

After submitting, there should be an entry of result in _Study Results_ in Jatos server. If the state of the result is marked as FINISHED and the message contains data, the server is successfully set up.

### Analyse Results
Here a Python program is provided to save the results into .csv file. You could use it or parse the results in other tools. Please make sure you have installed `json` and `csv` Python libraries before you run the program. To use the tool:
- Download the plain results. Go to Jatos _Study Results_ and select the results you wish to process. Export the results by clicking _Export Results_->Data only->Plain Text.
- Create a `/result` folder in the root and put `jatos_results_data_2024xxxxxx.txt` inside
- Open the `parseResult.py` from the `/Python` folder in a Python IDE. 
- Change the `fileName` to the actual txt name and run the script. 

You should be able to see a `jatos_results_data_2024xxxxxx.csv`(same as file name) from the `/result` folder. The parsed result contains the following:
    - titles: chosen,all presented, own
    - user feedback: ratings,comment, score
    - condition: user batch, similarity, distracted, similarity table+show score+slider, attention
    - user info: age, gender, ID



## Programming Guide
You are welcome to customize your own experiment on this project. Here I will explain the most frequently asked questions during the iterations of prototypes.

### Frontend
#### How to change experiment settings: conditions(incl URL), assets, title&version?
These are set in the `experiment.js` from `/src`.  Files that we want to use in other Js scripts has to be claimed in the assets, like images, tables, etc. Please do not include massive files here, as they take longer to package and import, and space in the server. Title, author, version, etc will not be excuted but serve as notes in Jatos that seperates the experiment from others. Conditions are determined before models and timelines are initialized. By setting the conditions, various building blocks, algorithms are chosen as well. An example is shown below.
![1](https://github.com/wdhub/jsPsych/assets/56460190/e608b50e-d362-43ff-b9fb-c335b0dec978)
![2](https://github.com/wdhub/jsPsych/assets/56460190/fe477fa5-6727-4fd3-8df6-d0385299e306)

Specifically about the conditions, these are parameters passed to initialize the conditionManager. The conditionManager is a model that controlls the UI, parameters, algorithm, etc. It has the functions such as init_conditio(), prepare_data(), and get_condition(), which is frequently used in various experiment pages. 

#### How adjust current pages?
There are 4 types of views in the program. introView, stimuliView, surveyView and endView, corresponding to the introduction pages, interaction pages, survey pages and ending pages. To modify certain page, find the variable in the specific view.js and modify the codes. 

For instance, if we want to change the background color of the slider, then we would go to _stimuliView_, find `var s2_img`, notice the layout is controlled by class `input-slider` in the `main.css` and update the `background` property in the input-slider there. Or if we want to delay less after looking up the similarity table, we would go to _stimuliView_, find `var s2_img`, notice it's controlled by the parameters passing to the resultModel and update the parameters in `on_load()` of `var s2_img`. 

If new plugins from Jspsych are needed, first install the plugins via npm and import it in the specific view. E.g,
In CMD,
```
npm i @jspsych/plugin-html-button-response
```
In .js,
```
import htmlButtonResponse from '@jspsych/plugin-html-button-response
```
Please notice that the name of the imported plugin might be different from the Jspsych instructions. Because NPM is used to manage nodes instead of CDN. For example, we write `htmlButtonResponse`, instead of [`jsPsychHtmlButtonResponse`](https://www.jspsych.org/7.3/plugins/html-button-response/).

#### How to test the codes?
It's suggested to first validate the program locally, then in server. Because the local changes could be seen in the browser once the local scripts are saved. Execute `npm start` in CMD and open [localhost](localhost:3000) in the browser. With F12 pressed, common tools such as console and elements are useful in debugging. Just remember to comment the logs out if `console.log` is used before launching the product.

### API
#### How to modify the task/settings of API?
These can modified in `/src/APIs/openAI.js`. You may adjust your API key, the method to decode your key, prompts and parameters towards the API and the output format. Be careful with the asynchronization when resolving results! See instructions about prompt and parameters [here](https://platform.openai.com/docs/guides/text-generation/json-mode?lang=node.js).
#### Is my key save enough?
It's definitely safer than storing it in configuration file in Github or in clear text. But base64 is a very basic encryption algorithm. Theoretically, the participants could simply press F12, locate the decoding method in the corresponding file within the many files (if they manage to find it somehow), execute the decoding themselves and get the API key. This is complex to normal participants, but not impossible for someone experienced. So we advice you to use one of these methods:
- store the key in a server and route to it when needed
- update the encryption method
- forbid F12/seeing source file during interaction

### Backend
#### How to manipulate, store and submit data to server?
As the Js files are devided into views and models, models are the ones that manipulate, store and submit the data. Specifically, - _conditionManager_ store the data related to experiment settings; 
- _resultModel_ store and calculate the data from user interaction, e.g ID, next_stimuli, score, database, title pool, isDistracted, feedback, etc; 
- _jsPsychModel_ manage the jsPsych object and the data submission to Jatos;
- _jsPyModel_ manage the communication between Js and Python.

If you want to adjust the calculation algorithm of the titles or to store additional data, modify the initialization, operation and saving method of the corresponding model.

#### How to use python libraries?
The program built a bridge between Python libraries and node,js. Here are the steps and tips of implementation.
To use the title similarity program directly:
- Set `algo.useTable` to false in `experiment.js`
- Uncomment the Python package initialization in `prepare_data()`, conditionManage
- Uncomment the Python method in `calTitle() `, resultModel and comment out the openAI method.
- Run the codes.
To write your own Python functions:
- Write or modify the Python files in `/python/pyModel`. 
- Modify the `setup.py` in `/python`, if you import new libraries. 
- Open CMD in the `/python`  and package the python files via: `python setup.py bdist_wheel`
- Copy the generated `.whl` from `/python/dist` and paste it in `/assets`
- Claim the assets in `experiment.js`
- Modify jsPyModel and call the python function through the model in views.

Please note:
- the _first_ time installing the packages and the _first call_ of Python function takes around 2 minutes in the browser, depending on the participant's device. And this may influence the user experience. 
- Some Python libraries cannot be packaged in .whl, due to the pure python library.

### Useful Links
- [Plugins in Jspsych](https://www.jspsych.org/7.3/plugins/list-of-plugins/)
- [How to set up a new experiment via jsPsych Builder](https://github.com/bjoluc/jspsych-builder)
- [Step-by-step install Jatos in DigitalOcean](https://www.jatos.org/next/JATOS-on-DigitalOcean.html)
- [Examples of experiments using Jatos (Jspsych, React, etc)](https://www.jatos.org/Example-Studies.html)


## Tech Stack:
The website is built around the [Jspsych](https://www.jspsych.org/7.3/) framework. The reason why we adopt this framework rather than React or VueX is that it provides ready-to-use process control plugins for behavioral experiments. Such as the timeline that navigates throughout the experiment, reaction time recorder, eye-tracker, etc. Besides the framework, [jsPsych Builder](https://github.com/bjoluc/jspsych-builder), a React ClI, is ultilized to set up and update the environment. With the simple commands like "npm run build" or "npm run jatos", the program could be packaged.

[Jatos](https://www.jatos.org/) is used to manage experiment results. The reason why Jatos is preferred than Firebase is the built-in access control. For instance, researchers can choose in the panel the participant's access level of the shared URL link. Some could be submitted multiple times, some could be submitted only once in the same IP. 

To host the webiste remotely, a server in German with Docker on Ubuntu pre-installed is picked from [DigitalOcean](https://www.digitalocean.com/). The location is selected due to performance requirement and academic ethics. 

OpenAI API is maily called to generate the stimuli. In specific, [gpt-3.5-turbo-0125](https://platform.openai.com/docs/guides/text-generation/completions-api) is the currently used model, with the purpose of text generation. Each fetch of the API may take around 1 second, depending on the current load of openAI platform and the local network of the participant. Therefore, a loading feature is needed in the UI.

![图片1](https://github.com/wdhub/jsPsych/assets/56460190/691771bd-d73e-412b-bc14-aaf96f5b416e)

### File Structure
- views/
	- introView.js: the introduction page display, jump to stimuli page
	- stimuliView.js: display the stimuli, jump to the same page under certain condition or to the end page
	- surveyView.js: user evaluation on the interaction and information gathering
	- endView.js: display the results and call data submission

- models/
	- resultModel.js:contain the global data related to API fetch results, user reactions
	- jsPsychModel.js:manage the jsPsych object and Jatos
	- conditionManager.js: store the data related to experiment settings; 
	- jsPyModel.js: manage the communication between Js and Python.

- APIs/
	- openAI.js:init and call openAI for various purposes
	
- styles/
	- main.css: layout of components
	
- python/
	- parseResult.py: parse the txt plain data and save as csv
	- setup.py: configure the packaging
	- pyModel/
		- nlpModel.py: calculate similarity between text
	
- utilities.js:repetitively used functions
- experiment.js: initialize and mount the exp
