# NLP via python
# caculate similarity between text
# APIs:find_similar

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# s1 is a string, database is a list of strings
# distance: a float, find the string with the closest distance
# output: a string
# consine distance
def find_similar(s1,database,distance):
	print("s1 passed to Python: "+s1+" similarity: "+str(distance))
	vectorizer = TfidfVectorizer()

	text_0=[s1]
	text_1= list(database)#just in case of wrong proxy type

	vectorizer.fit(text_0+text_1)
	tfidf_0=vectorizer.transform(text_0)
	tfidf_1=vectorizer.transform(text_1)

	similarity_matrix = cosine_similarity(tfidf_0,tfidf_1)[0]

	# find the target distance
	distances=abs(similarity_matrix-distance)
	minIndex=np.argmin(distances)

	print("Python caculated: "+database[minIndex])

	return database[minIndex]
