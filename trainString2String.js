import { methodNames } from "./data/dictionaries.js"
import { decodeStrings, encodeStrings, produceCharacterTable, windows, trainingAndValidationSet } from "./tensorflow/data.js";
import { string2StringModel } from "./tensorflow/model.js"
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { modelFolder } from "./tensorflow/io.js"
import { filterAlphabetic } from "./data/methodNames.js"
import { shuffle } from "./data/arrays.js"


const windowLength = 10
const folder = await modelFolder("string2string") 
const names = filterAlphabetic(await methodNames());
const windowedNames = Array.from(new Set(names.flatMap(name => Array.from(windows(windowLength, name)))))
const pairs = windowedNames.map(name => [name.toLowerCase(), name])

console.log(pairs.length)

const [trainingData, validationData] = shuffle(trainingAndValidationSet(pairs, 50000, 2000))

const charTable = produceCharacterTable(names)
writeFile(join(folder, "chartable.json"), JSON.stringify(charTable))
const numberOfCharacters = Object.entries(charTable).length

const encodedTrainingInput = encodeStrings(trainingData.map(([input, _]) => input), charTable)
const encodedTrainingOutput = encodeStrings(trainingData.map(([_, output]) => output), charTable)

const encodedValidationInput = encodeStrings(validationData.map(([input, _]) => input), charTable)
const encodedValidationOutput = encodeStrings(validationData.map(([_, output]) => output), charTable)

console.log(encodedTrainingInput.shape)
console.log(encodedTrainingOutput.shape)
console.log(encodedValidationInput.shape)
console.log(encodedValidationOutput.shape)

const model = string2StringModel(256, windowLength, numberOfCharacters);

const batchSize = 32

const history = await model.fit(encodedTrainingInput, encodedTrainingOutput, {
    epochs: 100,
    batchSize,
    validationData: [encodedValidationInput, encodedValidationOutput],
    yieldEvery: 'epoch'
});

model.save(`file://${folder}/model`)

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