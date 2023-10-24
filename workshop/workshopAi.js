import { methodNames } from "../data/dictionaries.js"
import { windows } from "../tensorflow/data.js"
import * as tf from '@tensorflow/tfjs-node';


const names = await methodNames()

const windowSize = 5

const allWindows = names.flatMap(name => Array.from(windows(windowSize, name)))

const pairs = allWindows.map(window => [window.toLowerCase(), window])

function collectLetters(pairs) {
    const allLetters = new Set(pairs.flatMap(([lowerCase, origin]) => [...Array.from(lowerCase), ...Array.from(origin)]))
    return allLetters
}

function labelLetters(letters) {
    const labelByLetter = {}

    let currentIndex = 0

    for (const letter of letters) {
        labelByLetter[letter] = currentIndex
        currentIndex = currentIndex + 1
    }

    return labelByLetter
}

const labelByLetter = labelLetters(collectLetters(pairs))

function encodeWord(word, labelByLetter) {
    const numberOfLabels = Object.keys(labelByLetter).length
    const buffer = tf.buffer([word.length, numberOfLabels])

    for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
        const currentLetter = word[letterIndex];

        for (let labelIndex = 0; labelIndex < numberOfLabels; labelIndex++) {
            buffer.set(labelByLetter[currentLetter] === labelIndex ? 1 : 0, letterIndex, labelIndex)
        }
    }

    return buffer.toTensor()
}

console.log(labelByLetter, encodeWord("abaaa", labelByLetter))


// easy make a neural network
// second step train
// third step enjoy