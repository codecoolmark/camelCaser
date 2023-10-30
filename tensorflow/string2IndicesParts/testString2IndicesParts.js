import * as tf from '@tensorflow/tfjs-node';
import { decodeUppercaseIndices, encodeStrings, parts } from "../data.js"
import { readFile } from 'node:fs/promises';
import { methodNames } from '../../data/dictionaries.js';
import { modelFolder } from '../io.js';
import { join } from 'node:path';

const windowLength = 5
const folder = await modelFolder("string2indicesParts")
const model = await tf.loadLayersModel(`file://${folder}/model/model.json`);
const charTable = await JSON.parse(await readFile(join(folder, "chartable.json"), { encoding: 'utf8' }))

const convertToCamelcase = async function(name) {
    const nameParts = Array.from(parts(windowLength, name))
    const encodedParts = encodeStrings(nameParts, charTable)
    const prediction = model.predict(encodedParts)
    const predictedParts = await decodeUppercaseIndices(prediction, nameParts, 0.5)
    return predictedParts.join("").trim()
}

console.log(await convertToCamelcase("getelementbyid"))

const names = await methodNames()
const longEnoughNames = names.filter(name => name.length > windowLength)
console.log(longEnoughNames.length)

console.log(await convertToCamelcase("addeventlistener"))
console.log(await convertToCamelcase("sendbeacon"))

const results = await Promise.all(longEnoughNames.map(async name => ({ name, prediction: await convertToCamelcase(name.toLowerCase())})))
const correctAnswers = results.filter(({ name, prediction }) => name === prediction)
const incorrectAnswers = results.filter(({ name, prediction }) => name !== prediction)
console.log(correctAnswers.length / longEnoughNames.length)
console.log(incorrectAnswers.slice(0, 20))
console.log(correctAnswers.slice(0, 10))