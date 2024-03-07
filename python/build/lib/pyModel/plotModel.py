# plot random process via matplotlib

import matplotlib.pyplot as plt
import numpy as np

def plotRandom():
    n = 50
    x = np.random.uniform(0,1,n)
    y = np.random.uniform(-1,0,n)

    plt.scatter(x, y)
    plt.show()