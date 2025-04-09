from flask import Flask, request, jsonify
import os
import csv

app = Flask(__name__)

@app.route('/api/upload_csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file and file.filename.endswith('.csv'):
        file_path = os.path.join("../data", file.filename)
        file.save(file_path)
        process_csv(file_path)
        return jsonify({"message": "File uploaded and processed successfully!"}), 200
    else:
        return jsonify({"message": "Invalid file type"}), 400

def process_csv(file_path):
    output_clp_path = "../data/disease-symptoms.clp"
    output_symptoms_path = "../data/symptoms.txt"

    clp_note = """; ------------------------------------------------------------------------------
; this file is generated using python
; dataset: https://www.kaggle.com/itachi9604/disease-symptom-description-dataset
; ------------------------------------------------------------------------------
"""

    all_symptoms = set()
    line_number = 0

    with open(file_path, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        with open(output_clp_path, mode='w', encoding='utf-8') as clpfile:
            clpfile.write(clp_note)
            
            for row in reader:
                line_number += 1
                if line_number == 1:
                    continue
                line = [i.strip() for i in row if i.strip()]
                disease = {
                    "name": line[0],
                    "nameWithUnderscore": line[0].replace(" ", "_"),
                    "symptoms": [symptom.replace(" ", "") for symptom in line[1:5]]
                }

                clp_format = f"""
(defrule {disease['nameWithUnderscore']}
  (disease_is {disease['nameWithUnderscore']})
  =>
  (printout t "{disease['name']}" crlf)
)

(defrule is_it_{disease['nameWithUnderscore']}
  {'\n  '.join([f'(has_symptom {symptom})' for symptom in disease['symptoms']])}
  =>
  (assert (disease_is {disease['nameWithUnderscore']}))
)
                """
                clpfile.write(clp_format)

                for symptom in disease['symptoms']:
                    all_symptoms.add(symptom)

    with open(output_symptoms_path, mode='w', encoding='utf-8') as symptomsfile:
        symptomsfile.write(",\n".join(sorted(all_symptoms)))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
