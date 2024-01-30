# parse the JSON format results from experiment
import json
import re
import csv

# parameters
max_num_tt=3 # max num of test trial with actual stimulus

## open and read file
fileName='../results/jatos_results_data_20240130112329'
f=open(fileName+'.txt')
rawData = f.readlines()
f.close()

# clear the stimulus
# select between "haiku:" and "}"
# clean special symbols
def cleanStimulus(st):
    t1=st.split('"haiku":')[1]
    t2=t1.split('}')[0]
    cln=re.sub('[\t\n\\"{}]', '', t2)

    return cln

## pick important data
pickedData=[]
acptDict={0:"accepted",1:"rejected"}

for id in range(len(rawData)):
    rD=rawData[id]
    rD=json.loads(rD)# read and convert JSON to data
    numTrial=len(rD)
    pD={"id":id}#picked data for the participant with id=..

    # select data for the participant
    for ii in range(numTrial):
        eachTrial=rD[ii]

        # those trials between the first and last page
        if (eachTrial["trial_index"]!=0) & (eachTrial["trial_index"]!=numTrial-1):
            stimulus=eachTrial["stimulus"]
            # clear the stimulus
            pD["stimulus " + str(ii)]=cleanStimulus(stimulus)
            pD["response_time "+str(ii)] = eachTrial["rt"]
            pD["acceptance "+str(ii)] = acptDict[eachTrial["response"]]

    pickedData.append(pD)

## store parsed results
header = ["id"]
for ii in range(1,max_num_tt+1):
    header.append("stimulus " + str(ii))
    header.append("response_time " + str(ii))
    header.append("acceptance " + str(ii))

# make the non-exsisted trials empty
for ii in range(len(pickedData)):
    for hd in header:
        if not hd in pickedData[ii]:
            pickedData[ii][hd]=" "

with open(fileName+'.csv', 'a', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=header)
    writer.writeheader()
    writer.writerows(pickedData)