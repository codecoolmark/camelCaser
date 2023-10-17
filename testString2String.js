import * as tf from '@tensorflow/tfjs-node';
import { decodeStrings, encodeStrings, windows } from "./tensorflow/data.js"
import { readFile } from 'node:fs/promises';
import { methodNames } from './data/dictionaries.js';


const windowLength = 10
const model = await tf.loadLayersModel("file://string2string-model/model.json");
const charTable = await JSON.parse(await readFile("chartable.json", { encoding: 'utf8' }))

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

const convertToCamelcase = function(name) {
    const nameWindows = Array.from(windows(windowLength, name))
    const encodedWindows = encodeStrings(nameWindows, charTable)
    const prediction = model.predict(encodedWindows)
    const predictedWindows = decodeStrings(prediction, charTable)
    return unmerge(predictedWindows)
}

console.log(convertToCamelcase("filterbooksbytitle"))

const names = await methodNames()
const longEnoughNames = names.filter(name => name.length > windowLength)
const results = longEnoughNames.map(name => ({ name, prediction: convertToCamelcase(name.toLowerCase())}))
const correctAnswers = results.filter(({ name, prediction }) => name === prediction)
const incorrectAnswers = results.filter(({ name, prediction }) => name !== prediction)
console.log(correctAnswers.length / longEnoughNames.length)
console.log(incorrectAnswers.slice(0, 10))
console.log(correctAnswers.slice(0, 10))