# parse the JSON format results from experiment
import json
import re
import csv

# parameters
max_num_tt = 3  # max num of test trial with actual stimulus

## open and read file
fileName = '../results/jatos_results_data_20240215152224'
f = open(fileName + '.txt')
rawData = f.readlines()
f.close()


# clear the stimulus
# select between "haiku:" and "}"
# clean special symbols
def cleanStimulus(st):
    t1 = st.split('"haiku":')[1]
    t2 = t1.split('}')[0]
    cln = re.sub('[\t\n\\"{}]', '', t2)

    return cln


## pick important data
pickedData = []
acptDict = {0: "accepted", 1: "rejected"}

for id in range(len(rawData)):
    rD = rawData[id]
    rD = json.loads(rD)  # read and convert JSON to data
    numTrial = len(rD)
    pD = {"id": id}  # picked data for the participant with id=..

    # select data for the participant
    myResult = {}
    for ii in range(numTrial):
        eachTrial = rD[ii]

        # those trials contain the results we want
        if 'myResult' in eachTrial:
            myResult = eachTrial["myResult"]
            break

    for jj in range(len(myResult)):
        rr = myResult[jj]
        # clear the stimulus
        pD["stimulus " + str(jj)] = cleanStimulus(rr["stimulus"])
        pD["response_time " + str(jj)] = rr["rspTime"]
        pD["acceptance " + str(jj)] = rr["acceptance"]

    pickedData.append(pD)

## store parsed results
header = ["id"]
for ii in range(max_num_tt):
    header.append("stimulus " + str(ii))
    header.append("response_time " + str(ii))
    header.append("acceptance " + str(ii))

# make the non-exsisted trials empty
for ii in range(len(pickedData)):
    for hd in header:
        if hd not in pickedData[ii]:
            pickedData[ii][hd] = " "

with open(fileName + '.csv', 'a', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=header)
    writer.writeheader()
    writer.writerows(pickedData)
