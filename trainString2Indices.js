import { methodNames } from "./data/dictionaries.js"
import { encodeStrings, produceCharacterTable, windows, trainingAndValidationSet, encodeUppercaseIndices } from "./tensorflow/data.js";
import { string2UppercaseIndicesModel } from "./tensorflow/model.js"
import { writeFile } from 'node:fs/promises';
import { shuffle } from "./data/arrays.js";

const windowLength = 10

const names = await methodNames();
const windowedNames = names.flatMap(name => Array.from(windows(windowLength, name)))
const pairs = windowedNames.map(name => [name.toLowerCase(), name])

console.log(pairs.length)

const [trainingData, validationData] = shuffle(trainingAndValidationSet(pairs, 80000, 1000))

const charTable = produceCharacterTable(pairs)
writeFile("chartable.json", JSON.stringify(charTable))
const numberOfCharacters = Object.entries(charTable).length

const encodedTrainingInput = encodeStrings(trainingData.map(([input, _]) => input), charTable)
const encodedTrainingOutput = encodeUppercaseIndices(trainingData.map(([_, output]) => output))
const encodedValidationInput = encodeStrings(validationData.map(([input, _]) => input), charTable)
const encodedValidationOutput = encodeUppercaseIndices(validationData.map(([_, output]) => output))

const model = string2UppercaseIndicesModel(140, windowLength, numberOfCharacters)

const batchSize = 32
let validationLossReduction = 1.0
const epochs = 20

while (validationLossReduction > 0.01) {
    const history = await model.fit(encodedTrainingInput, encodedTrainingOutput, {
        epochs,
        batchSize,
        validationData: [encodedValidationInput, encodedValidationOutput],
        yieldEvery: 'epoch',
    });

    validationLossReduction = (history.history.val_loss[0] - history.history.val_loss[epochs - 1]) / history.history.val_loss[0]
    console.log("improvement in validation loss", validationLossReduction)
    model.save("file://string2indices-model")
}
