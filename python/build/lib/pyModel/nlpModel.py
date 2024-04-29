# NLP via python
# caculate similarity between text
# APIs:find_similar

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
# import gensim.downloader as api
# from gensim import matutils


# s1 is a string, database is a list of strings
# distance: a float, find the string with the closest distance
# output: a string
# consine distance
def find_similar(s1, database, distance,pool):
    print("s1 passed to Python: " + s1 + " similarity: " + str(distance))

    text_0 = [s1]
    text_1 = list(database)  # just in case of wrong proxy type
    used=list(pool)

    text_1=list(set(text_1).difference(set(used))) # titles that has not appeared yet
    print("Python not shown titles: " + ', '.join(text_1))

    similarity_matrix = calCosineDistance(text_0, text_1)

    # find the target distance
    distances = abs(similarity_matrix - distance)
    minIndex = np.argmin(distances)

    print("Python caculated: " + text_1[minIndex])
    print("Python actual similarity: " + str(similarity_matrix[minIndex]))

    return text_1[minIndex]


def calCosineDistance(text_0, text_1):
    vectorizer = TfidfVectorizer()
    vectorizer.fit(text_0 + text_1)
    tfidf_0 = vectorizer.transform(text_0)
    tfidf_1 = vectorizer.transform(text_1)

    similarity_matrix = cosine_similarity(tfidf_0, tfidf_1)[0]

    return similarity_matrix


def calWord2vec(text_0, text_1):
    model = api.load("word2vec-google-news-300")
    similarity_matrix = []
    for tt in text_1:
        similarity_matrix.append(model.similarity(text_0, tt))

    return similarity_matrix
