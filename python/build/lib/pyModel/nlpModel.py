# NLP via python
# caculate similarity between text
# APIs:testAPI

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def testAPI():
	vectorizer = TfidfVectorizer()

	text_0=['this is no for it','when u come to me','for now, we cant do this','sdfsdfetewer' ]
	text_1=['this is no for it.','when u come to me','for now, u can do this','for now, we cant do this','nope, u will fix that','there got some problem']

	vectorizer.fit(text_0+text_1)
	tfidf_0=vectorizer.transform(text_0)
	tfidf_1=vectorizer.transform(text_1)


	similarity_matrix = cosine_similarity(tfidf_0,tfidf_1)
	print(similarity_matrix)