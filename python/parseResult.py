# parse the JSON format results from experiment
# output:
#   - titles: chosen,all presented, own
#   - user feedback: ratings,comment, score
#   - condition: user batch, similarity, distracted, similarity table+show score+slider, attention
#   - user info: age, gender, ID
import json
import csv

# parameters
max_num_tt = 3  # max num of test trial with actual stimulus

## open and read file
fileName = './python/n_300'
f = open(fileName + '.txt')
rawData = f.readlines()
f.close()


## pick important data
pickedData = []

for rd in rawData:
    values=json.loads(rd)['values']
    # if contain any value
    if len(values)>0:
        dataList = values[0]
        pD={'other_title':[]}
        for dl in dataList:
            # user
            if 'feedback' in dl:
                pD.update(dl)#ID, score, is distracted...
            if 'stimulus' in dl:
                if dl['stimulus']=='survey-likert':
                    for kk in dl['acceptance'].keys():
                        dl['acceptance'][kk]+=1
                    pD.update(dl['acceptance'])# rates
                if dl['stimulus']=='survey-multi-choice':
                    if 'gender' in dl['acceptance']:
                        pD.update(dl['acceptance'])  # age, gender

            # titles
            if 'acceptance' in dl:
                if dl['acceptance'] in [0,1]:
                    if dl['acceptance']==0:
                         pD['other_title'].append(dl['stimulus'])
                    else:
                         pD['chosen_title']=dl['stimulus']
                         pD['other_title'].append(dl["stimulus"])
                elif 'own_title' in dl['acceptance']:
                    pD['own_title'] = dl['acceptance']['own_title']
                elif dl["acceptance"] in pD["other_title"]:
                    pD["chosen_title"] = dl["acceptance"]

            # conditions
            if 'user_batch' in dl:
                pD.update(dl)# user batch,similarity, algorithm, etc
            if 'stimulus' in dl:
                if dl['stimulus']=='survey-multi-choice':
                    if 'choice_iPhone' in dl['acceptance']:
                        pD['attention']= dl['acceptance']['choice_iPhone']
        pickedData.append(pD)


# store parsed results

# make the non-exsisted trials empty

# header

header=pickedData[0].keys()

with open(fileName + '.csv', 'a', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=header)
    writer.writeheader()
    writer.writerows(pickedData)
