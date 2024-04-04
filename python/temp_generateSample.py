import pandas as pd

from itertools import combinations

import gensim
from gensim.models import word2vec
from gensim import matutils
import numpy as np
from pyemd import emd

# ----------------use wine comments as samples-----------------------
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


# --------------------generate fake similarity table-----------------------
# read titles from txt
f = open("sample.txt", encoding='utf-8')
titles=f.read().splitlines()
f.close()

# create title pairs and similarity
pairs = list(combinations(titles, 2))
table=[]
for ii,pp in zip(range(len(pairs)),pairs):
    table.append([pp[0],pp[1],ii/300])

# save as csv
column = ['title_0', 'title_1', 'similarity']
sim_data = pd.DataFrame(columns=column, data=table)
sim_data.to_csv('sample.csv',index=False)

# --------------------train word2vec model--------------------------------
sentences=word2vec.Text8Corpus("E:/Download/jsPsych/python/trainingDoc.txt")
model=word2vec.Word2Vec(sentences,sg=1,size=100,window=5,min_count=2,negative=3)
model.save("wvModel")
model=word2vec.Word2Vec.load("wvModel")
tokens1 = 'infinity and beyond'.split()
tokens2 = 'a travellers\' tale'.split()
distance = model.wmdistance('infinity and beyond', 'a travellers\' tale')
similarity=model.similarity('infinity','traveller')