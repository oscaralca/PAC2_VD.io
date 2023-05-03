import pandas as pd
import numpy as np

df = pd.read_csv("vgsales.csv")
#df = df[["type1","type2"]]
#df['type2'] = np.where(df['type2'].isnull(), df['type1'], df['type2'])
df_year = df.groupby(['Platform'])['Year'].mean().sort_values(ascending=True).reset_index()
print(df_year)
df = df.join(df_year.set_index('Platform'),on='Platform', rsuffix='_mean')
print(df)
df = df.groupby(["Platform","Year_mean"])["NA_Sales","EU_Sales","JP_Sales", "Other_Sales","Global_Sales"].sum().reset_index()
df = df[df["Global_Sales"]>50.0]
df=df.sort_values('Year_mean',ascending=True).reset_index()
df=df.drop(['index','Year_mean'], axis=1)

df_aux = df[["Platform","Global_Sales"]]
df = df.melt(id_vars=["Platform"],var_name="Type_Sales",value_name="Sales",ignore_index=False)

df.to_csv('./data/videojocs_full.csv')
df_aux.to_csv('./data/videojocs_simple.csv')
