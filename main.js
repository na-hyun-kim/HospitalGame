/*Qualtrics.SurveyEngine.addOnload(function() {
    let Q = this;
	Q.disableNextButton();*/

let score = 0; // Initialize score
let timerInterval; // Variable to hold timer interval
let breakTimerInterval; // Variable to hold timer interval for breaks
let totalPatientsDiagnosed = 0;
let telemedicineCount = 0; // Initialize at the top with other variables
let playerStr = ""
let scored = true
let inDiagnosis = false
let secondsLate = 0
let cumulativeDayStats = []
let playerActions = ""
let breakTimerStatus = ""

//use this structure to store the names and symptoms of diagnoses if we want to use them anywhere
const chart = {
    "Cardiac Arrest": [],
    "Stroke": [],
    "Pneumonia": [],
    "Tuberculosis": [],
}


//edit the main configurations of the game
let GameConfig = {
    //first dimension is day, second is shift, value is number of patients
    MainJob: [[3, 3], [2, 3], [1, 1]],
    //same dimensions as main job, first shift should be 0
    Telemedicine: [[0, 2], [0, 2], [0, 0]],
    NumberSearch: [[0, 2], [0, 2], [0, 0]],
    //same length as # of days
    SurpriseVisits: [true, false, false],
    BreakLength: 10,
    DayBreakLength: 30,
}

let patient_json = [
    {
        "": "0",
        "patient #": "0",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fatigue",
            "cough"
        ]
    },
    {
        "": "1",
        "patient #": "1",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "rapid heart rate",
            "short breath",
            "dizziness"
        ]
    },
    {
        "": "2",
        "patient #": "2",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "trouble walking",
            "dizziness",
            "numbness or weakness"
        ]
    },
    {
        "": "3",
        "patient #": "3",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "short breath",
            "dizziness",
            "fatigue"
        ]
    },
    {
        "": "4",
        "patient #": "4",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "short breath",
            "chills"
        ]
    },
    {
        "": "5",
        "patient #": "5",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "numbness or weakness",
            "trouble walking",
            "dizziness"
        ]
    },
    {
        "": "6",
        "patient #": "6",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "dizziness",
            "rapid heart rate"
        ]
    },
    {
        "": "7",
        "patient #": "7",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fever",
            "cough",
            "short breath"
        ]
    },
    {
        "": "8",
        "patient #": "8",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "swellings",
            "fatigue",
            "fever"
        ]
    },
    {
        "": "9",
        "patient #": "9",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fatigue",
            "swellings"
        ]
    },
    {
        "": "10",
        "patient #": "10",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "swellings",
            "fever"
        ]
    },
    {
        "": "11",
        "patient #": "11",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "cough",
            "chills",
            "short breath"
        ]
    },
    {
        "": "12",
        "patient #": "12",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "numbness or weakness",
            "trouble speaking"
        ]
    },
    {
        "": "13",
        "patient #": "13",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "swellings",
            "cough",
            "fatigue"
        ]
    },
    {
        "": "14",
        "patient #": "14",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fatigue",
            "swellings"
        ]
    },
    {
        "": "15",
        "patient #": "15",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "dizziness",
            "chest pain"
        ]
    },
    {
        "": "16",
        "patient #": "16",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "cough",
            "fever"
        ]
    },
    {
        "": "17",
        "patient #": "17",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "numbness or weakness",
            "dizziness"
        ]
    },
    {
        "": "18",
        "patient #": "18",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "cough",
            "fever",
            "short breath"
        ]
    },
    {
        "": "19",
        "patient #": "19",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "short breath",
            "fever",
            "cough"
        ]
    },
    {
        "": "20",
        "patient #": "20",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fever",
            "short breath"
        ]
    },
    {
        "": "21",
        "patient #": "21",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "chest pain",
            "fatigue",
            "short breath"
        ]
    },
    {
        "": "22",
        "patient #": "22",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "short breath",
            "cough"
        ]
    },
    {
        "": "23",
        "patient #": "23",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "rapid heart rate",
            "fatigue"
        ]
    },
    {
        "": "24",
        "patient #": "24",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "short breath",
            "cough",
            "fever"
        ]
    },
    {
        "": "25",
        "patient #": "25",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "chest pain",
            "fatigue"
        ]
    },
    {
        "": "26",
        "patient #": "26",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "short breath",
            "fever"
        ]
    },
    {
        "": "27",
        "patient #": "27",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "numbness or weakness",
            "trouble speaking"
        ]
    },
    {
        "": "28",
        "patient #": "28",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fatigue",
            "short breath"
        ]
    },
    {
        "": "29",
        "patient #": "29",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "dizziness",
            "short breath",
            "rapid heart rate"
        ]
    },
    {
        "": "30",
        "patient #": "30",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "dizziness",
            "chest pain"
        ]
    },
    {
        "": "31",
        "patient #": "31",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "swellings",
            "cough",
            "fever"
        ]
    },
    {
        "": "32",
        "patient #": "32",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "short breath",
            "cough"
        ]
    },
    {
        "": "33",
        "patient #": "33",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "swellings",
            "fever"
        ]
    },
    {
        "": "34",
        "patient #": "34",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "swellings",
            "fever"
        ]
    },
    {
        "": "35",
        "patient #": "35",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "trouble speaking",
            "trouble walking",
            "dizziness"
        ]
    },
    {
        "": "36",
        "patient #": "36",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fatigue",
            "fever"
        ]
    },
    {
        "": "37",
        "patient #": "37",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "short breath",
            "chills"
        ]
    },
    {
        "": "38",
        "patient #": "38",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "swellings",
            "cough"
        ]
    },
    {
        "": "39",
        "patient #": "39",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fever",
            "short breath",
            "chills"
        ]
    },
    {
        "": "40",
        "patient #": "40",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "short breath",
            "cough"
        ]
    },
    {
        "": "41",
        "patient #": "41",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fever",
            "cough"
        ]
    },
    {
        "": "42",
        "patient #": "42",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "dizziness",
            "short breath"
        ]
    },
    {
        "": "43",
        "patient #": "43",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "swellings",
            "fatigue",
            "cough"
        ]
    },
    {
        "": "44",
        "patient #": "44",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "cough",
            "chills"
        ]
    },
    {
        "": "45",
        "patient #": "45",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "short breath",
            "dizziness",
            "rapid heart rate"
        ]
    },
    {
        "": "46",
        "patient #": "46",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fatigue",
            "chest pain"
        ]
    },
    {
        "": "47",
        "patient #": "47",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fatigue",
            "chest pain",
            "short breath"
        ]
    },
    {
        "": "48",
        "patient #": "48",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "cough",
            "chills",
            "fever"
        ]
    },
    {
        "": "49",
        "patient #": "49",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "chest pain",
            "dizziness",
            "fatigue"
        ]
    },
    {
        "": "50",
        "patient #": "50",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fatigue",
            "fever",
            "swellings"
        ]
    },
    {
        "": "51",
        "patient #": "51",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "trouble speaking",
            "trouble walking",
            "numbness or weakness"
        ]
    },
    {
        "": "52",
        "patient #": "52",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "cough",
            "chills",
            "fever"
        ]
    },
    {
        "": "53",
        "patient #": "53",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "rapid heart rate",
            "chest pain"
        ]
    },
    {
        "": "54",
        "patient #": "54",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "short breath"
        ]
    },
    {
        "": "55",
        "patient #": "55",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "chills",
            "short breath"
        ]
    },
    {
        "": "56",
        "patient #": "56",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "dizziness",
            "trouble walking",
            "numbness or weakness"
        ]
    },
    {
        "": "57",
        "patient #": "57",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "cough",
            "fatigue",
            "fever"
        ]
    },
    {
        "": "58",
        "patient #": "58",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "cough",
            "fever",
            "chills"
        ]
    },
    {
        "": "59",
        "patient #": "59",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "short breath",
            "chest pain",
            "dizziness"
        ]
    },
    {
        "": "60",
        "patient #": "60",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "swellings",
            "fatigue",
            "fever"
        ]
    },
    {
        "": "61",
        "patient #": "61",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "numbness or weakness",
            "trouble speaking"
        ]
    },
    {
        "": "62",
        "patient #": "62",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fatigue",
            "short breath",
            "dizziness"
        ]
    },
    {
        "": "63",
        "patient #": "63",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "short breath",
            "fever"
        ]
    },
    {
        "": "64",
        "patient #": "64",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "chest pain",
            "fatigue",
            "dizziness"
        ]
    },
    {
        "": "65",
        "patient #": "65",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fatigue",
            "cough"
        ]
    },
    {
        "": "66",
        "patient #": "66",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "trouble walking",
            "numbness or weakness",
            "trouble speaking"
        ]
    },
    {
        "": "67",
        "patient #": "67",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "cough",
            "chills"
        ]
    },
    {
        "": "68",
        "patient #": "68",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "dizziness",
            "trouble speaking"
        ]
    },
    {
        "": "69",
        "patient #": "69",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "cough",
            "chills",
            "short breath"
        ]
    },
    {
        "": "70",
        "patient #": "70",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fatigue",
            "swellings",
            "fever"
        ]
    },
    {
        "": "71",
        "patient #": "71",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "chest pain",
            "dizziness"
        ]
    },
    {
        "": "72",
        "patient #": "72",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "rapid heart rate",
            "dizziness",
            "short breath"
        ]
    },
    {
        "": "73",
        "patient #": "73",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "short breath",
            "cough",
            "chills"
        ]
    },
    {
        "": "74",
        "patient #": "74",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "trouble speaking",
            "dizziness"
        ]
    },
    {
        "": "75",
        "patient #": "75",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "cough",
            "chills"
        ]
    },
    {
        "": "76",
        "patient #": "76",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "cough",
            "fever",
            "swellings"
        ]
    },
    {
        "": "77",
        "patient #": "77",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "rapid heart rate",
            "chest pain",
            "fatigue"
        ]
    },
    {
        "": "78",
        "patient #": "78",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "dizziness",
            "numbness or weakness"
        ]
    },
    {
        "": "79",
        "patient #": "79",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "dizziness",
            "numbness or weakness"
        ]
    },
    {
        "": "80",
        "patient #": "80",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fatigue",
            "dizziness",
            "rapid heart rate"
        ]
    },
    {
        "": "81",
        "patient #": "81",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "cough",
            "fatigue",
            "swellings"
        ]
    },
    {
        "": "82",
        "patient #": "82",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "trouble walking",
            "trouble speaking",
            "dizziness"
        ]
    },
    {
        "": "83",
        "patient #": "83",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "short breath",
            "cough"
        ]
    },
    {
        "": "84",
        "patient #": "84",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "trouble walking",
            "numbness or weakness"
        ]
    },
    {
        "": "85",
        "patient #": "85",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "short breath",
            "fever"
        ]
    },
    {
        "": "86",
        "patient #": "86",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "trouble speaking",
            "numbness or weakness"
        ]
    },
    {
        "": "87",
        "patient #": "87",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "trouble speaking",
            "numbness or weakness",
            "dizziness"
        ]
    },
    {
        "": "88",
        "patient #": "88",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "chest pain",
            "rapid heart rate"
        ]
    },
    {
        "": "89",
        "patient #": "89",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "swellings",
            "cough"
        ]
    },
    {
        "": "90",
        "patient #": "90",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fatigue",
            "rapid heart rate",
            "dizziness"
        ]
    },
    {
        "": "91",
        "patient #": "91",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "fever",
            "short breath",
            "cough"
        ]
    },
    {
        "": "92",
        "patient #": "92",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "trouble speaking",
            "dizziness",
            "trouble walking"
        ]
    },
    {
        "": "93",
        "patient #": "93",
        "corr diagnosis": "Cardiac Arrest",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "chest pain",
            "short breath"
        ]
    },
    {
        "": "94",
        "patient #": "94",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "trouble walking",
            "trouble speaking"
        ]
    },
    {
        "": "95",
        "patient #": "95",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "cough",
            "short breath"
        ]
    },
    {
        "": "96",
        "patient #": "96",
        "corr diagnosis": "Pneumonia",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "fever",
            "chills"
        ]
    },
    {
        "": "97",
        "patient #": "97",
        "corr diagnosis": "Stroke",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "trouble speaking",
            "trouble walking",
            "numbness or weakness"
        ]
    },
    {
        "": "98",
        "patient #": "98",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "1",
        "symptoms": [
            "swellings",
            "fever",
            "cough"
        ]
    },
    {
        "": "99",
        "patient #": "99",
        "corr diagnosis": "Tuberculosis",
        "SJ/MJ": "MJ",
        "difficulty": "0",
        "symptoms": [
            "cough",
            "fatigue"
        ]
    }
]

let formula_json = [
    {
        "": "0",
        "patient #": "0",
        "formula": "a",
        "a": 1,
        "b": 7,
        "difficulty": "0",
        "corr_answer": 1.0
    },
    {
        "": "1",
        "patient #": "1",
        "formula": "a + b/2",
        "a": 3,
        "b": 2,
        "difficulty": "2",
        "corr_answer": 4.0
    },
    {
        "": "2",
        "patient #": "2",
        "formula": "a + b",
        "a": 2,
        "b": 3,
        "difficulty": "1",
        "corr_answer": 5.0
    },
    {
        "": "3",
        "patient #": "3",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 8,
        "difficulty": "4",
        "corr_answer": 7.75
    },
    {
        "": "4",
        "patient #": "4",
        "formula": "a + b",
        "a": 3,
        "b": 2,
        "difficulty": "1",
        "corr_answer": 5.0
    },
    {
        "": "5",
        "patient #": "5",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 6,
        "difficulty": "3",
        "corr_answer": 4.0
    },
    {
        "": "6",
        "patient #": "6",
        "formula": "a + b",
        "a": 4,
        "b": 8,
        "difficulty": "1",
        "corr_answer": 12.0
    },
    {
        "": "7",
        "patient #": "7",
        "formula": "a + b/2",
        "a": 3,
        "b": 7,
        "difficulty": "3",
        "corr_answer": 6.5
    },
    {
        "": "8",
        "patient #": "8",
        "formula": "a",
        "a": 7,
        "b": 2,
        "difficulty": "0",
        "corr_answer": 7.0
    },
    {
        "": "9",
        "patient #": "9",
        "formula": "a/2",
        "a": 1,
        "b": 2,
        "difficulty": "2",
        "corr_answer": 0.5
    },
    {
        "": "10",
        "patient #": "10",
        "formula": "a + b",
        "a": 4,
        "b": 2,
        "difficulty": "1",
        "corr_answer": 6.0
    },
    {
        "": "11",
        "patient #": "11",
        "formula": "-a/4 + b",
        "a": 3,
        "b": 3,
        "difficulty": "4",
        "corr_answer": 2.25
    },
    {
        "": "12",
        "patient #": "12",
        "formula": "a + b/2",
        "a": 3,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 4.5
    },
    {
        "": "13",
        "patient #": "13",
        "formula": "a/2",
        "a": 4,
        "b": 5,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "14",
        "patient #": "14",
        "formula": "-a/4 + b",
        "a": 4,
        "b": 7,
        "difficulty": "3",
        "corr_answer": 6.0
    },
    {
        "": "15",
        "patient #": "15",
        "formula": "a/2",
        "a": 5,
        "b": 9,
        "difficulty": "2",
        "corr_answer": 2.5
    },
    {
        "": "16",
        "patient #": "16",
        "formula": "a + b",
        "a": 7,
        "b": 9,
        "difficulty": "1",
        "corr_answer": 16.0
    },
    {
        "": "17",
        "patient #": "17",
        "formula": "a + b",
        "a": 6,
        "b": 4,
        "difficulty": "1",
        "corr_answer": 10.0
    },
    {
        "": "18",
        "patient #": "18",
        "formula": "a",
        "a": 8,
        "b": 5,
        "difficulty": "0",
        "corr_answer": 8.0
    },
    {
        "": "19",
        "patient #": "19",
        "formula": "a + b/2",
        "a": 3,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 4.5
    },
    {
        "": "20",
        "patient #": "20",
        "formula": "a",
        "a": 7,
        "b": 4,
        "difficulty": "0",
        "corr_answer": 7.0
    },
    {
        "": "21",
        "patient #": "21",
        "formula": "a + b/2",
        "a": 1,
        "b": 10,
        "difficulty": "2",
        "corr_answer": 6.0
    },
    {
        "": "22",
        "patient #": "22",
        "formula": "a + b",
        "a": 1,
        "b": 3,
        "difficulty": "1",
        "corr_answer": 4.0
    },
    {
        "": "23",
        "patient #": "23",
        "formula": "a + b",
        "a": 7,
        "b": 4,
        "difficulty": "1",
        "corr_answer": 11.0
    },
    {
        "": "24",
        "patient #": "24",
        "formula": "a/2",
        "a": 4,
        "b": 6,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "25",
        "patient #": "25",
        "formula": "a",
        "a": 5,
        "b": 10,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "26",
        "patient #": "26",
        "formula": "a + b",
        "a": 2,
        "b": 10,
        "difficulty": "1",
        "corr_answer": 12.0
    },
    {
        "": "27",
        "patient #": "27",
        "formula": "a + b",
        "a": 3,
        "b": 10,
        "difficulty": "1",
        "corr_answer": 13.0
    },
    {
        "": "28",
        "patient #": "28",
        "formula": "a",
        "a": 5,
        "b": 5,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "29",
        "patient #": "29",
        "formula": "a + b",
        "a": 1,
        "b": 7,
        "difficulty": "1",
        "corr_answer": 8.0
    },
    {
        "": "30",
        "patient #": "30",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 9,
        "difficulty": "4",
        "corr_answer": 8.75
    },
    {
        "": "31",
        "patient #": "31",
        "formula": "-a/4 + b",
        "a": 6,
        "b": 3,
        "difficulty": "4",
        "corr_answer": 1.5
    },
    {
        "": "32",
        "patient #": "32",
        "formula": "a + b",
        "a": 1,
        "b": 7,
        "difficulty": "1",
        "corr_answer": 8.0
    },
    {
        "": "33",
        "patient #": "33",
        "formula": "-a/4 + b",
        "a": 4,
        "b": 4,
        "difficulty": "3",
        "corr_answer": 3.0
    },
    {
        "": "34",
        "patient #": "34",
        "formula": "a",
        "a": 7,
        "b": 9,
        "difficulty": "0",
        "corr_answer": 7.0
    },
    {
        "": "35",
        "patient #": "35",
        "formula": "a",
        "a": 8,
        "b": 6,
        "difficulty": "0",
        "corr_answer": 8.0
    },
    {
        "": "36",
        "patient #": "36",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 2,
        "difficulty": "4",
        "corr_answer": 1.75
    },
    {
        "": "37",
        "patient #": "37",
        "formula": "a + b",
        "a": 2,
        "b": 7,
        "difficulty": "1",
        "corr_answer": 9.0
    },
    {
        "": "38",
        "patient #": "38",
        "formula": "a/2",
        "a": 1,
        "b": 3,
        "difficulty": "2",
        "corr_answer": 0.5
    },
    {
        "": "39",
        "patient #": "39",
        "formula": "a",
        "a": 6,
        "b": 3,
        "difficulty": "0",
        "corr_answer": 6.0
    },
    {
        "": "40",
        "patient #": "40",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 1.0
    },
    {
        "": "41",
        "patient #": "41",
        "formula": "a + b/2",
        "a": 7,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 8.5
    },
    {
        "": "42",
        "patient #": "42",
        "formula": "a",
        "a": 3,
        "b": 4,
        "difficulty": "0",
        "corr_answer": 3.0
    },
    {
        "": "43",
        "patient #": "43",
        "formula": "a/2",
        "a": 3,
        "b": 3,
        "difficulty": "2",
        "corr_answer": 1.5
    },
    {
        "": "44",
        "patient #": "44",
        "formula": "a/2",
        "a": 7,
        "b": 9,
        "difficulty": "2",
        "corr_answer": 3.5
    },
    {
        "": "45",
        "patient #": "45",
        "formula": "a + b",
        "a": 6,
        "b": 6,
        "difficulty": "1",
        "corr_answer": 12.0
    },
    {
        "": "46",
        "patient #": "46",
        "formula": "a + b/2",
        "a": 6,
        "b": 10,
        "difficulty": "2",
        "corr_answer": 11.0
    },
    {
        "": "47",
        "patient #": "47",
        "formula": "-a/4 + b",
        "a": 6,
        "b": 7,
        "difficulty": "4",
        "corr_answer": 5.5
    },
    {
        "": "48",
        "patient #": "48",
        "formula": "a/2",
        "a": 4,
        "b": 3,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "49",
        "patient #": "49",
        "formula": "a + b/2",
        "a": 1,
        "b": 5,
        "difficulty": "3",
        "corr_answer": 3.5
    },
    {
        "": "50",
        "patient #": "50",
        "formula": "a + b",
        "a": 8,
        "b": 4,
        "difficulty": "1",
        "corr_answer": 12.0
    },
    {
        "": "51",
        "patient #": "51",
        "formula": "a",
        "a": 4,
        "b": 10,
        "difficulty": "0",
        "corr_answer": 4.0
    },
    {
        "": "52",
        "patient #": "52",
        "formula": "a",
        "a": 3,
        "b": 7,
        "difficulty": "0",
        "corr_answer": 3.0
    },
    {
        "": "53",
        "patient #": "53",
        "formula": "a + b/2",
        "a": 2,
        "b": 4,
        "difficulty": "2",
        "corr_answer": 4.0
    },
    {
        "": "54",
        "patient #": "54",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 2,
        "difficulty": "4",
        "corr_answer": 1.75
    },
    {
        "": "55",
        "patient #": "55",
        "formula": "a",
        "a": 2,
        "b": 2,
        "difficulty": "0",
        "corr_answer": 2.0
    },
    {
        "": "56",
        "patient #": "56",
        "formula": "a + b",
        "a": 6,
        "b": 9,
        "difficulty": "1",
        "corr_answer": 15.0
    },
    {
        "": "57",
        "patient #": "57",
        "formula": "-a/4 + b",
        "a": 3,
        "b": 5,
        "difficulty": "4",
        "corr_answer": 4.25
    },
    {
        "": "58",
        "patient #": "58",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 6,
        "difficulty": "3",
        "corr_answer": 4.0
    },
    {
        "": "59",
        "patient #": "59",
        "formula": "a + b/2",
        "a": 2,
        "b": 8,
        "difficulty": "2",
        "corr_answer": 6.0
    },
    {
        "": "60",
        "patient #": "60",
        "formula": "a + b",
        "a": 7,
        "b": 7,
        "difficulty": "1",
        "corr_answer": 14.0
    },
    {
        "": "61",
        "patient #": "61",
        "formula": "a/2",
        "a": 5,
        "b": 2,
        "difficulty": "2",
        "corr_answer": 2.5
    },
    {
        "": "62",
        "patient #": "62",
        "formula": "a",
        "a": 7,
        "b": 7,
        "difficulty": "0",
        "corr_answer": 7.0
    },
    {
        "": "63",
        "patient #": "63",
        "formula": "a + b/2",
        "a": 6,
        "b": 7,
        "difficulty": "3",
        "corr_answer": 9.5
    },
    {
        "": "64",
        "patient #": "64",
        "formula": "a",
        "a": 5,
        "b": 10,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "65",
        "patient #": "65",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 9,
        "difficulty": "3",
        "corr_answer": 7.0
    },
    {
        "": "66",
        "patient #": "66",
        "formula": "a",
        "a": 4,
        "b": 8,
        "difficulty": "0",
        "corr_answer": 4.0
    },
    {
        "": "67",
        "patient #": "67",
        "formula": "-a/4 + b",
        "a": 3,
        "b": 10,
        "difficulty": "4",
        "corr_answer": 9.25
    },
    {
        "": "68",
        "patient #": "68",
        "formula": "a + b/2",
        "a": 4,
        "b": 6,
        "difficulty": "2",
        "corr_answer": 7.0
    },
    {
        "": "69",
        "patient #": "69",
        "formula": "a + b",
        "a": 1,
        "b": 4,
        "difficulty": "1",
        "corr_answer": 5.0
    },
    {
        "": "70",
        "patient #": "70",
        "formula": "a + b",
        "a": 4,
        "b": 7,
        "difficulty": "1",
        "corr_answer": 11.0
    },
    {
        "": "71",
        "patient #": "71",
        "formula": "a",
        "a": 5,
        "b": 9,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "72",
        "patient #": "72",
        "formula": "a + b",
        "a": 6,
        "b": 2,
        "difficulty": "1",
        "corr_answer": 8.0
    },
    {
        "": "73",
        "patient #": "73",
        "formula": "-a/4 + b",
        "a": 1,
        "b": 5,
        "difficulty": "4",
        "corr_answer": 4.75
    },
    {
        "": "74",
        "patient #": "74",
        "formula": "a",
        "a": 5,
        "b": 5,
        "difficulty": "0",
        "corr_answer": 5.0
    },
    {
        "": "75",
        "patient #": "75",
        "formula": "a + b",
        "a": 3,
        "b": 9,
        "difficulty": "1",
        "corr_answer": 12.0
    },
    {
        "": "76",
        "patient #": "76",
        "formula": "a",
        "a": 2,
        "b": 7,
        "difficulty": "0",
        "corr_answer": 2.0
    },
    {
        "": "77",
        "patient #": "77",
        "formula": "a + b",
        "a": 5,
        "b": 6,
        "difficulty": "1",
        "corr_answer": 11.0
    },
    {
        "": "78",
        "patient #": "78",
        "formula": "a",
        "a": 4,
        "b": 3,
        "difficulty": "0",
        "corr_answer": 4.0
    },
    {
        "": "79",
        "patient #": "79",
        "formula": "a + b",
        "a": 1,
        "b": 2,
        "difficulty": "1",
        "corr_answer": 3.0
    },
    {
        "": "80",
        "patient #": "80",
        "formula": "a/2",
        "a": 4,
        "b": 10,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "81",
        "patient #": "81",
        "formula": "a/2",
        "a": 1,
        "b": 4,
        "difficulty": "2",
        "corr_answer": 0.5
    },
    {
        "": "82",
        "patient #": "82",
        "formula": "-a/4 + b",
        "a": 3,
        "b": 4,
        "difficulty": "4",
        "corr_answer": 3.25
    },
    {
        "": "83",
        "patient #": "83",
        "formula": "a + b/2",
        "a": 5,
        "b": 8,
        "difficulty": "2",
        "corr_answer": 9.0
    },
    {
        "": "84",
        "patient #": "84",
        "formula": "a/2",
        "a": 5,
        "b": 9,
        "difficulty": "2",
        "corr_answer": 2.5
    },
    {
        "": "85",
        "patient #": "85",
        "formula": "a/2",
        "a": 1,
        "b": 4,
        "difficulty": "2",
        "corr_answer": 0.5
    },
    {
        "": "86",
        "patient #": "86",
        "formula": "a",
        "a": 3,
        "b": 10,
        "difficulty": "0",
        "corr_answer": 3.0
    },
    {
        "": "87",
        "patient #": "87",
        "formula": "a + b",
        "a": 3,
        "b": 3,
        "difficulty": "1",
        "corr_answer": 6.0
    },
    {
        "": "88",
        "patient #": "88",
        "formula": "-a/4 + b",
        "a": 7,
        "b": 6,
        "difficulty": "4",
        "corr_answer": 4.25
    },
    {
        "": "89",
        "patient #": "89",
        "formula": "a + b/2",
        "a": 5,
        "b": 3,
        "difficulty": "3",
        "corr_answer": 6.5
    },
    {
        "": "90",
        "patient #": "90",
        "formula": "a + b",
        "a": 8,
        "b": 6,
        "difficulty": "1",
        "corr_answer": 14.0
    },
    {
        "": "91",
        "patient #": "91",
        "formula": "a/2",
        "a": 5,
        "b": 2,
        "difficulty": "2",
        "corr_answer": 2.5
    },
    {
        "": "92",
        "patient #": "92",
        "formula": "a + b/2",
        "a": 5,
        "b": 6,
        "difficulty": "2",
        "corr_answer": 8.0
    },
    {
        "": "93",
        "patient #": "93",
        "formula": "-a/4 + b",
        "a": 8,
        "b": 2,
        "difficulty": "3",
        "corr_answer": 0.0
    },
    {
        "": "94",
        "patient #": "94",
        "formula": "a + b/2",
        "a": 1,
        "b": 8,
        "difficulty": "2",
        "corr_answer": 5.0
    },
    {
        "": "95",
        "patient #": "95",
        "formula": "a + b",
        "a": 4,
        "b": 9,
        "difficulty": "1",
        "corr_answer": 13.0
    },
    {
        "": "96",
        "patient #": "96",
        "formula": "a + b/2",
        "a": 2,
        "b": 9,
        "difficulty": "3",
        "corr_answer": 6.5
    },
    {
        "": "97",
        "patient #": "97",
        "formula": "a + b/2",
        "a": 7,
        "b": 6,
        "difficulty": "2",
        "corr_answer": 10.0
    },
    {
        "": "98",
        "patient #": "98",
        "formula": "a/2",
        "a": 4,
        "b": 4,
        "difficulty": "1",
        "corr_answer": 2.0
    },
    {
        "": "99",
        "patient #": "99",
        "formula": "a/2",
        "a": 8,
        "b": 10,
        "difficulty": "1",
        "corr_answer": 4.0
    }
]   

let number_search_json = [
    {
        "": "0",
        "NS_number": "0",
        "NS_image": "https://www.dropbox.com/scl/fi/9jdxjtdyrk8md8e1f0f5q/table0.png?rlkey=imzoioqbf3d6lxf072gm4m1a5&st=pk5thnlw&dl=0",
        "number_to_search_for": 7,
        "difficulty": 1,
        "correct_answer": 3.0
    },
    {
        "": "1",
        "NS_number": "1",
        "NS_image": "https://www.dropbox.com/scl/fi/638ssf6y61qx5qj8fmox5/table1.png?rlkey=orr139jmsws2z5dt39ispxe1w&st=ppj8mxra&dl=0",
        "number_to_search_for": 6,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "2",
        "NS_number": "2",
        "NS_image": "https://www.dropbox.com/scl/fi/aqjaqx45ivgvl4nkcog5y/table2.png?rlkey=qwc06w0cli1lzobb3564znta9&st=5vlv3oq1&dl=0",
        "number_to_search_for": 1,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "3",
        "NS_number": "3",
        "NS_image": "https://www.dropbox.com/scl/fi/vn7ldbqkt8se5p7nlvlee/table3.png?rlkey=fvvqufmdyf41wp47jlaf4pwex&st=ctxi9lys&dl=0",
        "number_to_search_for": 6,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "4",
        "NS_number": "4",
        "NS_image": "https://www.dropbox.com/scl/fi/s29mby4ignatwq0b9zajg/table4.png?rlkey=dq0ouqw6rb21u1pb13yvicot6&st=ekpg64kz&dl=0",
        "number_to_search_for": 6,
        "difficulty": 2,
        "correct_answer": 8.0
    },
    {
        "": "5",
        "NS_number": "5",
        "NS_image": "https://www.dropbox.com/scl/fi/fkqfrkbhjai700gaihrhq/table5.png?rlkey=2dskja0yy46z89aaa0g92znss&st=jhl6fuoo&dl=0",
        "number_to_search_for": 2,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "6",
        "NS_number": "6",
        "NS_image": "https://www.dropbox.com/scl/fi/0gvo6m7uc21nsvu5mhl1b/table6.png?rlkey=py8qwiamct5cuvu205hfg7uqd&st=p4j82ipx&dl=0",
        "number_to_search_for": 8,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "7",
        "NS_number": "7",
        "NS_image": "https://www.dropbox.com/scl/fi/1hht0qjl0wpbkkylfyrvx/table7.png?rlkey=cwm3yqiwmtp5fu1qh4mcse519&st=f4sh76q2&dl=0",
        "number_to_search_for": 4,
        "difficulty": 0,
        "correct_answer": 0.0
    },
    {
        "": "8",
        "NS_number": "8",
        "NS_image": "https://www.dropbox.com/scl/fi/x7swp4bho7e3hsr2pi4hk/table8.png?rlkey=abt8sf1sgppuagtja6waft97d&st=5ix95r2x&dl=0",
        "number_to_search_for": 3,
        "difficulty": 0,
        "correct_answer": 2.0
    },
    {
        "": "9",
        "NS_number": "9",
        "NS_image": "https://www.dropbox.com/scl/fi/jh50l681ifgq2pgh4ljtl/table9.png?rlkey=72k87r98kvoozwyg023853bk3&st=u4t8d6jg&dl=0",
        "number_to_search_for": 7,
        "difficulty": 0,
        "correct_answer": 0.0
    },
    {
        "": "10",
        "NS_number": "10",
        "NS_image": "https://www.dropbox.com/scl/fi/j1d9oavufiucja5tv2z58/table10.png?rlkey=l5tcr4kacb6tnk0brgkvcbyqg&st=qvci1uof&dl=0",
        "number_to_search_for": 9,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "11",
        "NS_number": "11",
        "NS_image": "https://www.dropbox.com/scl/fi/j3zhbw3iz63h9by17ypn8/table11.png?rlkey=855ggaaumzmycemm26w9hm727&st=byac6f7j&dl=0",
        "number_to_search_for": 9,
        "difficulty": 1,
        "correct_answer": 1.0
    },
    {
        "": "12",
        "NS_number": "12",
        "NS_image": "https://www.dropbox.com/scl/fi/32gg14c0p964mfmub256s/table12.png?rlkey=4wttbui90nuynstmfnrmu58n0&st=1jvbhw94&dl=0",
        "number_to_search_for": 9,
        "difficulty": 0,
        "correct_answer": 1.0
    },
    {
        "": "13",
        "NS_number": "13",
        "NS_image": "https://www.dropbox.com/scl/fi/q2hz4owsw4836i5nav0v6/table13.png?rlkey=oi9xwyofzo6nalplfx9g0rm9k&st=ow70q6ez&dl=0",
        "number_to_search_for": 1,
        "difficulty": 1,
        "correct_answer": 2.0
    },
    {
        "": "14",
        "NS_number": "14",
        "NS_image": "https://www.dropbox.com/scl/fi/ikw7edly2x53neowgq1v4/table14.png?rlkey=x4z2uxpwiayquxtypi1ujgyq3&st=nwlfdxs8&dl=0",
        "number_to_search_for": 3,
        "difficulty": 2,
        "correct_answer": 9.0
    }
]

let timeline = {
    Day: 0,
    Shift: 0,
    Patient: 0,
}

let mainPatientList = [patient_json, formula_json]
let telemedicinePatientList = patient_json
let numberSearchPatientList = number_search_json
let queues = {
    "Main": [],
    "Telemedicine": [],
    "NumberSearch": [],
    "DayBreak": [],
}
let currentPatient = null
let currentJob = "Main"

function startBreakTimer(duration, callback) {
    let timer = duration, minutes, seconds;
    breakTimerInterval = setInterval(function () {
        minutes = parseInt(Math.abs(timer) / 60, 10);
        seconds = parseInt(Math.abs(timer) % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        
        
        if (currentJob == "DayBreak") {
            //put the random pop ins here
            if (minutes == 0 && seconds == 20 && GameConfig.SurpriseVisits[timeline.Day] && !inDiagnosis) {
                surpriseVisit()
            }
        }
        if (--timer < 0) {
            if (queues[currentJob].length > 0 && inDiagnosis) {
                //overtime!!
                document.getElementById('break-timer').textContent = "Break over! You are " + minutes + ":" + seconds + " late";
                breakTimerStatus = "late " + minutes + ":" + seconds
                secondsLate += 1
            } else {
                clearInterval(breakTimerInterval);
                callback();
            }
        } else {
            document.getElementById('break-timer').textContent = "Break: " + minutes + ":" + seconds;
            breakTimerStatus = minutes + ":" + seconds
        }
    }, 1000);
}

function stopBreakTimer() {
    clearInterval(breakTimerInterval);
    document.getElementById('break-timer').textContent = ''; // Clear timer text
    breakTimerStatus = ""
}

function startTimer() {
    let startTime = Date.now();
    timerInterval = setInterval(function() {
        let elapsedTime = Date.now() - startTime;
        let seconds = Math.floor(elapsedTime / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60; // Remainder gives seconds past the last full minute
        document.getElementById('timer').textContent = 'Time: ' +
            (minutes < 10 ? '0' : '') + minutes + ':' +
            (seconds < 10 ? '0' : '') + seconds;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function surpriseVisit() {
    document.getElementById('scene-title').textContent = "Incoming call!"
    document.getElementById('scene-story').textContent = "A patient is calling to ask for a diagnosis. You may 1) choose to give a diagnosis without pay   or  2) do nothing. What will you do?"
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices
    let btn = document.createElement('button');
    btn.textContent = "Answer?";
    btn.onclick = () => {
        scored = false
        clearQueues()
        queuePatients()
        nextPatient()
    };
    choicesContainer.appendChild(btn);
}

//use this function to add patients to the queues.
let mainDiagnosisCounter = 0
let mainFormulaCounter = 0
let telemedicinePatientCounter = 0
let numberSearchPatientCounter = 0

function queuePatients() {
    if (currentJob == "Main") {
        //main job
        for (let i=0; i<GameConfig.MainJob[timeline.Day][timeline.Shift]; i++) {
            if ((mainFormulaCounter + mainDiagnosisCounter) % 3 == 2) {
                let patient = mainPatientList[1][mainFormulaCounter]
                patient.type = "formula"
                queues[currentJob].push(patient)
                mainFormulaCounter += 1
            } else {
                let patient = mainPatientList[0][mainDiagnosisCounter]
                patient.type = "diagnosis"
                queues[currentJob].push(patient)
                mainDiagnosisCounter += 1
            }
        }
    } else if (currentJob == "Telemedicine") {
        //side job
        for (let i=0; i<GameConfig.Telemedicine[timeline.Day][timeline.Shift]; i++) {
            queues[currentJob].push(telemedicinePatientList[telemedicinePatientCounter])
            telemedicinePatientCounter += 1
        }
    } else if (currentJob == "NumberSearch") {
        for (let i=0; i<GameConfig.NumberSearch[timeline.Day][timeline.Shift]; i++) {
            queues[currentJob].push(numberSearchPatientList[numberSearchPatientCounter])
            numberSearchPatientCounter += 1
        }
    } else {
        //surprise visits
        queues[currentJob].push(mainPatientList[0][mainDiagnosisCounter])
        mainDiagnosisCounter += 1
    }
}

function clearQueues() {
    for (const key in queues) {
        queues[key] = []
    }
}

function nextPatient() {
    if (queues[currentJob].length == 0) {
        //if queues becomes empty, start a break
        if (currentJob == "Main") {
            startBreak()
        } else {
            breakRoom()
        }
        return
    }
    inDiagnosis = true
    currentPatient = queues[currentJob][0]
    if (currentPatient.type == "formula") {
        sliderPatient()
    } else if (currentPatient.type == "numberSearch") {
        numberSearchPatient()
    } else {
        diagnosePatient()
    }
}

function numberSearchPatient() {
    document.getElementById('scene-title').textContent = "Number Search " + currentPatient["NS_number"];
    document.getElementById('scene-story').textContent = "Find the ";
}

function sliderPatient() {
    document.getElementById('formula-container').classList.remove('hidden');
    document.getElementById('scene-title').textContent = "Patient " + currentPatient["patient #"];
    document.getElementById('scene-story').textContent = "Solve for x = " + currentPatient["formula"] + ", where a=" + currentPatient["a"] + ", b=" + currentPatient["b"];
    document.getElementById('patients-left').classList.remove("hidden")
    document.getElementById('patients-left').textContent = "Patients left: " + queues[currentJob].length
    let answeredValue = false
    let answerInput = document.getElementById('formulaInput');
    answerInput.disabled = false
    let slider = document.getElementById('myRange');
    let output = document.getElementById('value');
    slider.min = 0; // Set minimum value
    slider.max = 10; // Maximum can be adjusted as needed
    slider.value = 0; // Start at 0
    slider.step = 0.25
    output.textContent = slider.value; // Display initial value

    slider.oninput = function() {
        output.textContent = this.value; // Update the displayed value
        let percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
        this.style.background = `linear-gradient(90deg, #14284b ${percentage}%, #BCBCBC ${percentage}%)`;
    };

    let container = document.getElementById('choices');
    container.innerHTML = ''; // Clear previous choices

    let submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit Answer';
    submitBtn.onclick = function() {
        if (answeredValue) {
            if (parseFloat(slider.value) == currentPatient["corr_answer"]) {
                correct()
            } else {
                wrong()
            }
        } else {
            if (parseFloat(answerInput.value) == currentPatient["corr_answer"]) {
                answeredValue = true
                answerInput.disabled = true
                document.getElementById('slider-container').classList.remove('hidden');
            } else {
                wrong()
            }
        }
    };
    container.appendChild(submitBtn);
}
function diagnosePatient() {
    //
    let symptoms = []
    symptoms = currentPatient["symptoms"]
    let symptomsStr = symptoms.join(", ")
    document.getElementById('scene-title').textContent = "Patient " + currentPatient["patient #"];
    document.getElementById('scene-story').textContent = "This patient is experiencing the symptoms: " + symptomsStr + ". What is your diagnosis?";
    document.getElementById('patients-left').classList.remove("hidden")
    document.getElementById('patients-left').textContent = "Patients left: " + queues[currentJob].length
    //add choices
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices
    for (const element in chart) {
        let btn = document.createElement('button');
        btn.textContent = element;
        btn.onclick = () => {
            if (element == currentPatient["corr diagnosis"]) {
                correct()
            } else {
                wrong()
            }
        };
        choicesContainer.appendChild(btn);
    };
    
    //add option to skip or switch back to leisure if it is telemedicine
    if (currentJob == "Telemedicine") {
        telemedicineCount += 1
        let btn = document.createElement('button');
        btn.textContent = "Skip";
        btn.onclick = () => {
            telemedicineCount -= 1
            skipPatient()
        };
        choicesContainer.appendChild(btn);

        btn = document.createElement('button');
        btn.textContent = "Back to Break";
        btn.onclick = () => {
            telemedicineCount -= 1
            breakRoom()
        };
        choicesContainer.appendChild(btn);
    }
    document.getElementById('game-view').classList.remove('hidden');
    document.getElementById('start-button').classList.add('hidden');
}

function correct() {
    totalPatientsDiagnosed += 1;
    document.getElementById('patient-counter').textContent = "Patients Diagnosed: " + totalPatientsDiagnosed
    if (scored) {
        score += 1
    }
    timeline.Patient += 1
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('scene-title').textContent = "Correct!";
    if (currentPatient.type == "formula") {
        document.getElementById('scene-story').textContent = "The correct value is " + currentPatient["corr_answer"] + ".";
        document.getElementById('formula-container').classList.add('hidden');
        document.getElementById('slider-container').classList.add('hidden'); // Hide slider after submission
    } else {
        document.getElementById('scene-story').textContent = "This patient exhibits symptoms for " + currentPatient["corr diagnosis"] + ". What would you like to next?"
    }
    
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Next";
    btn.onclick = () => {
        queues[currentJob] = queues[currentJob].slice(1)
        nextPatient()
    };
    choicesContainer.appendChild(btn);
}

function wrong() {
    totalPatientsDiagnosed += 1;
    document.getElementById('patient-counter').textContent = "Patients Diagnosed: " + totalPatientsDiagnosed
    timeline.Patient += 1
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('scene-title').textContent = "Incorrect!";
    if (currentPatient.type == "formula") {
        document.getElementById('scene-story').textContent = "Incorrect! The correct value is " + currentPatient["corr_answer"] + ".";
        document.getElementById('formula-container').classList.add('hidden');
        document.getElementById('slider-container').classList.add('hidden'); // Hide slider after submission
    } else {
        document.getElementById('scene-story').textContent = "Incorrect! This patient exhibits symptoms for " + currentPatient["corr diagnosis"] + ". What would you like to next?"
    }
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Next";
    btn.onclick = () => {
        queues[currentJob] = queues[currentJob].slice(1)
        nextPatient()
    };
    choicesContainer.appendChild(btn);
}

function skipPatient() {
    //put any other functionality we may want to add for skipping here (like showing text)
    queues[currentJob] = queues[currentJob].slice(1)
    timeline.Patient += 1
    //diagnose the next patient
    nextPatient()
}

function startMainJob() {
    scored = true
    clearQueues()
    currentJob = "Main"
    queuePatients()
    nextPatient()
}

function startTelemedicine() {
    scored = true
    currentJob = "Telemedicine"
    queuePatients()
    //do not diagnose beacuse user needs to opt in
}

function startNumberSearch() {
    scored = true
    currentJob = "NumberSearch"
    queuePatients()
}

function startBreak() {
    inDiagnosis = false
    timeline.Patient = 0
    timeline.Shift += 1;
    if (timeline.Shift >= GameConfig.MainJob[timeline.Day].length) {
        //end of day
        endDay()
        return
    }
    startBreakTimer(GameConfig.BreakLength, endBreak)
    clearQueues()
    //queues patients for telemedicine and number search
    startTelemedicine()
    startNumberSearch()
    breakRoom()
}

function endDay() {
    timeline.Shift = 0
    currentJob = "DayBreak"
    startBreakTimer(GameConfig.DayBreakLength, endDayBreak)
    breakRoom()
}

function breakRoom() {
    inDiagnosis = false
    document.getElementById('patients-left').classList.add("hidden")
    if (currentJob == "DayBreak") {
        document.getElementById('scene-title').textContent = "Breakroom"
        document.getElementById('scene-story').textContent = "You've finished your shifts for the day! Take a break"
        let choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = ''; // Clear previous choices
    } else {
        if (timeline.Patient >= GameConfig.Telemedicine[timeline.Day][timeline.Shift]) {
            timeline.Patient = 0;
            document.getElementById('scene-title').textContent = "Breakroom"
            document.getElementById('scene-story').textContent = "You've finished avaliable telemedicine visits. Sit tight and enjoy yourself until your break is over!"
            let choicesContainer = document.getElementById('choices');
            choicesContainer.innerHTML = ''; // Clear previous choices
        } else {
            document.getElementById('scene-title').textContent = "Breakroom"
            document.getElementById('scene-story').textContent = "You're back in the breakroom. You have two options: 1) Enjoy yourself      2) Work on telemedicine until your next rotation"
            let choicesContainer = document.getElementById('choices');
            choicesContainer.innerHTML = ''; // Clear previous choices

            let btn = document.createElement('button');
            btn.textContent = "Work on Telemedicine";
            btn.onclick = () => {
                currentJob = "Telemedicine"
                nextPatient()
            };
            choicesContainer.appendChild(btn);
            btn = document.createElement('button');
            btn.textContent = "Work on Number Search";
            btn.onclick = () => {
                currentJob = "NumberSearch"
                nextPatient()
            };
            choicesContainer.appendChild(btn);
        }
    }
}

function endDayBreak() {
    stopBreakTimer()
    timeline.Day += 1
    document.getElementById('day').textContent = "Day: " + (timeline.Day + 1)
    cumulativeDayStats.push({
        "Score": score,
        "Patients seen": totalPatientsDiagnosed,
        "Telemedicine visits": telemedicineCount,
        "Seconds late": secondsLate,
    })
    document.getElementById('scene-title').textContent = "Day over!"
    document.getElementById('scene-story').textContent = "Your day is over. Here is a summary: "
    let summaryContainer = document.getElementById("summary-container")
    summaryContainer.innerHTML = '';
    let lastIndex = cumulativeDayStats.length - 1
    for (const stat in cumulativeDayStats[lastIndex]) {
        let summary = document.createElement('p')
        if (cumulativeDayStats.length == 1) {
            //first day
            summary.textContent = stat + ": " + cumulativeDayStats[lastIndex][stat]
        } else {
            //second or later day
            summary.textContent = stat + ": " + (cumulativeDayStats[lastIndex][stat] - cumulativeDayStats[lastIndex - 1][stat])
        }
        summaryContainer.appendChild(summary)
    }
    document.getElementById('summary-container').classList.remove("hidden")
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Next";
    btn.onclick = () => {
        document.getElementById('summary-container').classList.add("hidden")
        if (timeline.Day >= GameConfig.MainJob.length) {
            //end of game
            gameOver()
            return
        }
        startMainJob()
    };
    choicesContainer.appendChild(btn);
}

function endBreak() {
    stopBreakTimer()
    document.getElementById('scene-title').textContent = "Break over"
    document.getElementById('scene-story').textContent = "Your break is over. Time to get back to work!"
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Next";
    btn.onclick = () => {
        startMainJob()
    };
    choicesContainer.appendChild(btn);
}

document.getElementById('start-button').addEventListener('click', startGame)
function startGame() {
    console.log('Starting game...');
    score = 0; // Reset score if restarting
    document.getElementById('start-button').classList.add('hidden')
    document.getElementById('score').textContent = 'Score: 0'; // Reset score display
    document.getElementById('scene-title').textContent = "Introduction"
    document.getElementById('scene-story').textContent = "Good Morning! Lets begin your shift"
    document.getElementById('disease-chart').classList.remove('hidden')
    document.getElementById('game-view').classList.remove('hidden');
    let choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    let btn = document.createElement('button');
    btn.textContent = "Start";
    btn.onclick = () => {
        document.getElementById('disease-chart').classList.add('hidden')
        startMainJob()
    };
    choicesContainer.appendChild(btn);
    startTimer(); // Ensure the timer starts fresh with the game
};

// When implementing game over or restart:
function gameOver() {
    stopTimer(); // Stop the timer when the game breaks or ends
    storeGameData();
    document.getElementById('game-view').classList.add('hidden');
    document.getElementById('game-over').classList.remove('hidden');
};

document.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        // logging player actions
        playerActions += document.getElementById('timer').textContent.slice(6) + " "
        playerActions += event.target.textContent + " "
        playerActions += currentJob + " "
        playerActions += timeline.Day + " "
        playerActions += timeline.Shift + " "
        playerActions += timeline.Patient + " "
        playerActions += score + " "
        playerActions += breakTimerStatus + " "
        playerActions += ";"
        //add anymore information we want to obtain here

        Qualtrics.SurveyEngine.setEmbeddedData('playerActions', playerActions);
    }
});

function storeGameData() {
    /*Qualtrics.SurveyEngine.setEmbeddedData('gameDuration', document.getElementById('timer').textContent);
    Qualtrics.SurveyEngine.setEmbeddedData('finalScore', score);
    Qualtrics.SurveyEngine.setEmbeddedData('telemedicineSessions', telemedicineCount);*/
}
/*
    function hideEl(element) {
        element.hide();
    }   
	
    var nb = $('NextButton');
	const regex = /^{"T":.*?"A":.*?]}$/;
    hideEl.defer(nb);
    $(this.questionId).down('.InputText').on('keyup', function(event) {
        if (regex.test(this.value)) nb.show();
        else nb.hide();
    });
});*/