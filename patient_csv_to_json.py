import csv
import json
import ast

data = []

with open('patient_list.csv', mode='r', encoding='utf-8') as file:
    read = csv.DictReader(file)
    for row in read:
        data.append(row)

for item in data:
    for key, value in item.items():
        if isinstance(value, str) and value.startswith('[') and value.endswith(']'):
            try:
                item[key] = ast.literal_eval(value)
            except (SyntaxError, ValueError):
                print(f"Error evaluating {value}. Keeping original.")

with open('patient_list.json', mode='w', encoding='utf-8') as file:
    json.dump(data, file, indent=4)

print('done')