import pandas as pd
import numpy as np
from json import JSONEncoder
import json
#https://pynative.com/python-serialize-numpy-ndarray-into-json/
class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)

df = pd.read_csv("pokemon.csv")
df = df[["type1","type2"]]
df['type2'] = np.where(df['type2'].isnull(), df['type1'], df['type2'])
print(df)

df = np.array(df[["type1","type2"]])

#https://stackoverflow.com/questions/64464861/how-can-i-convert-a-two-column-array-to-a-matrix-with-counts-of-occurences
import networkx as nx

G = nx.from_edgelist(df, create_using=nx.MultiGraph)
df = nx.to_pandas_adjacency(G, nodelist=sorted(G.nodes()), dtype='int')
entitats= df.index
print (np.array(df))

numpyData = {"valuesData": np.array(df), "entities": np.array(entitats)}
print("serialize NumPy array into JSON and write into a file")
with open("dades.json", "w") as write_file:
    json.dump(numpyData, write_file, cls=NumpyArrayEncoder)
print("Done writing serialized NumPy array into file")
