import * as tf from '@tensorflow/tfjs-node';
import { decodeUppercaseIndices, encodeStrings, windows } from "./tensorflow/data.js"
import { readFile } from 'node:fs/promises';
import { methodNames } from './data/dictionaries.js';
import { modelFolder } from './tensorflow/io.js';
import { join } from 'node:path';


const windowLength = 10
const folder = await modelFolder("string2string")
const model = await tf.loadLayersModel(`file://${folder}/model/model.json`);
const charTable = await JSON.parse(await readFile(join(folder, "chartable.json"), { encoding: 'utf8' }))

function unmerge(windows) {
    const finalLength = windows.length + windows[0].length - 1
    
    const getCharsForPosition = function(position) {
        return windows.map((window, index) => window[position - index]).filter(char => char != undefined)
    }

    const majority = function(chars) {
        const countsByChar = {} 

        for (const char of chars) {
            countsByChar[char] = (countsByChar[char] ?? 0) + 1
        }

        const [maxChar, _] = Object.entries(countsByChar)
            .reduce(([charA, countA], [charB, countB]) => countA > countB ? [charA, countA] : [charB, countB], [0, ''])

        return maxChar
    }

    let result = "";

    for (let index = 0; index < finalLength; index++) {
        const chars = getCharsForPosition(index)
        result = result + majority(chars)
    }

    return result
}

const convertToCamelcase = async function(name) {
    const nameWindows = Array.from(windows(windowLength, name))
    const encodedWindows = encodeStrings(nameWindows, charTable)
    const prediction = model.predict(encodedWindows)
    const predictedWindows = await decodeUppercaseIndices(prediction, nameWindows, 0.9)
    return unmerge(predictedWindows)
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