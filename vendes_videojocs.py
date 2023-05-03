import pandas as pd
import numpy as np

df = pd.read_csv("vgsales.csv")
#df = df[["type1","type2"]]
#df['type2'] = np.where(df['type2'].isnull(), df['type1'], df['type2'])
print(df)
