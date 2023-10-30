import * as tf from '@tensorflow/tfjs-node';
import { decodeUppercaseIndices, encodeStrings, windows } from "../data.js"
import { readFile } from 'node:fs/promises';
import { modelFolder } from '../io.js';
import { join } from 'node:path';

export const windowLength = 10
const folder = await modelFolder("string2indices")
const model = await tf.loadLayersModel(`file://${folder}/model/model.json`);
const charTable = await JSON.parse(await readFile(join(folder, "chartable.json"), { encoding: 'utf8' }))

function unmerge(windows, name) {
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

    let result = name[0];

    for (let index = 1; index < finalLength; index++) {
        const chars = getCharsForPosition(index)
        result = result + majority(chars)
    }

    return result
}

export async function convertToCamelcase(name) {
    const nameWindows = Array.from(windows(windowLength, name))
    const encodedWindows = encodeStrings(nameWindows, charTable)
    const prediction = model.predict(encodedWindows)
    const predictedWindows = await decodeUppercaseIndices(prediction, nameWindows, 0.5)
    return unmerge(predictedWindows, name)
}