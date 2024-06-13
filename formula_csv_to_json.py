import csv
import json
import ast

data = []

with open('formula_list.csv', mode='r', encoding='utf-8') as file:
    read = csv.DictReader(file)
    for row in read:
        data.append(row)

for item in data:
    for key, value in item.items():
        if key == "a" or key == "b":
            try:
                item[key] = int(value)
            except (SyntaxError, ValueError):
                print(f"Error evaluating {value}. Keeping original.")
        elif key == "corr_answer":
            try:
                item[key] = float(value)
            except (SyntaxError, ValueError):
                print(f"Error evaluating {value}. Keeping original.")

with open('formula_list.json', mode='w', encoding='utf-8') as file:
    json.dump(data, file, indent=4)

print('done')