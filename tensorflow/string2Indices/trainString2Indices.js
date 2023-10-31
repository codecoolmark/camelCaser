import { alphabeticMethodNames, methodNames } from "../../data/dictionaries.js"
import { encodeStrings, produceCharacterTable, windows, trainingAndValidationSet, encodeUppercaseIndices, alphaNumericCharacterTable, replaceUnknownCharacters } from "../data.js";
import { string2UppercaseIndicesModel } from "../model.js"
import { writeFile } from 'node:fs/promises'
import { shuffle } from "../../data/arrays.js"
import { join } from 'node:path'
import { modelFolder } from "../io.js"

const windowLength = 10
const folder = await modelFolder("string2indices") 

const placeholder = "#"
const charTable = alphaNumericCharacterTable(placeholder)
writeFile(join(folder, "chartable.json"), JSON.stringify(charTable))
const numberOfCharacters = Object.entries(charTable).length

const names = await methodNames();
const cleanedUpNames = names.map(name => replaceUnknownCharacters(charTable, placeholder, name))

const windowedNames = shuffle(Array.from(new Set(cleanedUpNames.flatMap(name => Array.from(windows(windowLength, name))))))
const pairs = windowedNames.map(name => [name.toLowerCase(), name])

const numberOfPairs = pairs.length
console.log(numberOfPairs)

const validationSize = 1000
const [trainingData, validationData] = trainingAndValidationSet(pairs, numberOfPairs - validationSize, validationSize)

const encodedTrainingInput = encodeStrings(trainingData.map(([input, _]) => input), charTable, placeholder)
const encodedTrainingOutput = encodeUppercaseIndices(trainingData.map(([_, output]) => output))
const encodedValidationInput = encodeStrings(validationData.map(([input, _]) => input), charTable)
const encodedValidationOutput = encodeUppercaseIndices(validationData.map(([_, output]) => output))

const model = string2UppercaseIndicesModel(100, windowLength, numberOfCharacters)

const batchSize = 32
let validationLossReduction = 1.0
const epochs = 50

while (validationLossReduction > 0.01) {
    const history = await model.fit(encodedTrainingInput, encodedTrainingOutput, {
        epochs,
        batchSize,
        validationData: [encodedValidationInput, encodedValidationOutput],
        yieldEvery: 'epoch',
    });

    validationLossReduction = (history.history.val_loss[0] - history.history.val_loss[epochs - 1]) / history.history.val_loss[0]
    console.log("improvement in validation loss", validationLossReduction)
    model.save(`file://${folder}/model`)
}
