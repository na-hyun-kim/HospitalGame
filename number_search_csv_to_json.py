import csv
import json
import ast

data = []

with open('number_search_list.csv', mode='r', encoding='utf-8') as file:
    read = csv.DictReader(file)
    for row in read:
        data.append(row)

for item in data:
    for key, value in item.items():
        if key == "number_to_search_for" or key == "difficulty":
            try:
                item[key] = int(value)
            except (SyntaxError, ValueError):
                print(f"Error evaluating {value}. Keeping original.")
        elif key == "correct_answer":
            try:
                item[key] = float(value)
            except (SyntaxError, ValueError):
                print(f"Error evaluating {value}. Keeping original.")

with open('number_search_list.json', mode='w', encoding='utf-8') as file:
    json.dump(data, file, indent=4)

print('done')