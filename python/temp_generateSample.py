import pandas as pd

# read comments
path = 'E:\Download\jsPsych\python\pyModel\data_en.csv'
data = pd.read_csv(path)
com = list(data[['Note']].values)

# sampling
sC = com[0:len(com):1000]
selected = []
for ss in sC:
    selected.append(ss[0])

# save in txt,E:/Download/jsPsych/assets/sample.txt
f = open("sample.txt", "w", encoding='utf-8')
f.write('0000 0000\n'.join(selected))
f.close()
