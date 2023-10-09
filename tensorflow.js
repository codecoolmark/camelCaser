import { methodNames } from "./data/dictionaries.js"
import { decodeStrings, encodeStrings, produceCharacterTable, windows, trainingAndValidationSet } from "./tensorflow/data.js";
import { rnnModel } from "./tensorflow/model.js"

const windowLength = 10

const names = await methodNames();
const windowedNames = names.flatMap(name => Array.from(windows(windowLength, name)))
const pairs = windowedNames.map(name => [name.toLowerCase(), name])

const [trainingData, validationData] = trainingAndValidationSet(pairs, 6000, 12000)

const charTable = produceCharacterTable(pairs)
const numberOfCharacters = Object.entries(charTable).length

const encodedTrainingInput = encodeStrings(trainingData.map(([input, _]) => input), charTable)
const encodedTrainingOutput = encodeStrings(trainingData.map(([_, output]) => output), charTable)

const encodedValidationInput = encodeStrings(validationData.map(([input, _]) => input), charTable)
const encodedValidationOutput = encodeStrings(validationData.map(([_, output]) => output), charTable)

console.log(encodedTrainingInput.shape)
console.log(encodedTrainingOutput.shape)
console.log(encodedValidationInput.shape)
console.log(encodedValidationOutput.shape)

const model = rnnModel(128, windowLength, numberOfCharacters);

const batchSize = 128

const history = await model.fit(encodedTrainingInput, encodedTrainingOutput, {
    epochs: 60,
    batchSize,
    validationData: [encodedValidationInput, encodedValidationOutput],
    yieldEvery: 'epoch'
});

const testStrings = [ 
    validationData[0], 
    validationData[1], 
    validationData[2],
    validationData[3],
    validationData[4],
    validationData[5]]

const encodedTestString = encodeStrings(testStrings.map(([a, _]) => a), charTable)
console.log(decodeStrings(encodedTestString, charTable))

const prediction = model.predict(encodedTestString)
console.log(decodeStrings(prediction, charTable))