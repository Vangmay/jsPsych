import pandas as pd
import gensim
from gensim.models import word2vec
from gensim import matutils
import numpy as np
from pyemd import emd

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

# train word2vec model
sentences=word2vec.Text8Corpus("E:/Download/jsPsych/python/trainingDoc.txt")
model=word2vec.Word2Vec(sentences,sg=1,size=100,window=5,min_count=2,negative=3)
model.save("wvModel")
model=word2vec.Word2Vec.load("wvModel")
tokens1 = 'infinity and beyond'.split()
tokens2 = 'a travellers\' tale'.split()
distance = model.wmdistance('infinity and beyond', 'a travellers\' tale')
similarity=model.similarity('infinity','traveller')