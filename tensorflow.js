import { allPairs, allPairsOfLength, decodeString, decodeStrings, encodeStrings, maxInputLength, nPairs, normalize, produceCharacterTable, shorten } from "./tensorflow/data.js";
import { rnnModel } from "./tensorflow/model.js";

const longEnoughPairs = allPairsOfLength(10, 120);
console.log(longEnoughPairs.length)
const partLength = 10;
const trainingData = shorten(nPairs(6000, longEnoughPairs), partLength)
const validationData = shorten(nPairs(10000, longEnoughPairs), partLength)
const stringLength = Math.max(maxInputLength(validationData), maxInputLength(trainingData))
const normalizedTrainingData = normalize(trainingData, stringLength)
const normalizedValidationData = normalize(validationData, stringLength)
const charTable = produceCharacterTable([...normalizedTrainingData, ...normalizedValidationData])
const numberOfCharacters = Object.entries(charTable).length

const encodedTrainingInput = encodeStrings(normalizedTrainingData.map(([input, _]) => input), charTable)
const encodedTrainingOutput = encodeStrings(normalizedTrainingData.map(([_, output]) => output), charTable)

const encodedValidationInput = encodeStrings(normalizedValidationData.map(([input, _]) => input), charTable)
const encodedValidationOutput = encodeStrings(normalizedValidationData.map(([_, output]) => output), charTable)

console.log(encodedTrainingInput.shape)
console.log(encodedTrainingOutput.shape)
console.log(encodedValidationInput.shape)
console.log(encodedValidationOutput.shape)

//console.table([decodeStrings(encodedTrainingInput, charTable), decodeStrings(encodedTrainingOutput, charTable)])

const model = rnnModel(128, stringLength, numberOfCharacters);

const batchSize = 128

const history = await model.fit(encodedTrainingInput, encodedTrainingOutput, {
    epochs: 100,
    batchSize,
    validationData: [encodedValidationInput, encodedValidationOutput],
    yieldEvery: 'epoch'
});

const testStrings = shorten(normalize([["getelementbyid", "getElementById"], 
    validationData[0], 
    validationData[1], 
    validationData[2],
    validationData[3],
    validationData[4],
    validationData[5]], partLength), partLength)
const encodedTestString = encodeStrings(testStrings.map(([a, _]) => a), charTable)
console.log(decodeStrings(encodedTestString, charTable))

const prediction = model.predict(encodedTestString)
console.log(decodeStrings(prediction, charTable))
