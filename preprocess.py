import pandas as pd
import json

data = []

df = pd.read_csv('data.csv')

for comuna in df.iterrows():
    data.append({
        comuna[1]['Comuna']: {
            2015: comuna[1]['2015'],
            2016: comuna[1]['2016'],
            2017: comuna[1]['2017'],
            2018: comuna[1]['2018'],
            2019: comuna[1]['2019'],
            2020: comuna[1]['2020'],
            2021: comuna[1]['2021'],
            2022: comuna[1]['2022'],
            2023: comuna[1]['2023'],
        }
    })

print(data)

with open('data.json', 'w', encoding="utf-8") as f:
    json.dump(data, f)
