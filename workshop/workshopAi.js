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
const numberOfLabels = Object.keys(labelByLetter).length

function encodeWords(words, wordSize, labelByLetter) {
    const numberOfLabels = Object.keys(labelByLetter).length

    const buffer = tf.buffer([words.length, wordSize, numberOfLabels])

    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        const word = words[wordIndex]

        for (let letterIndex = 0; letterIndex < wordSize; letterIndex++) {
            const currentLetter = word[letterIndex];
    
            for (let labelIndex = 0; labelIndex < numberOfLabels; labelIndex++) {
                buffer.set(labelByLetter[currentLetter] === labelIndex ? 1 : 0, wordIndex, letterIndex, labelIndex)
            }
        }

    }

    return buffer.toTensor()
}

function encodeUppercaseIndices(words, wordSize) {
    const buffer = tf.buffer([words.length, wordSize])

    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        const word = words[wordIndex]

        for (let characterIndex = 0; characterIndex < wordSize; characterIndex++) {
            const character = word[characterIndex]

            buffer.set(character === character.toUpperCase() ? 1 : 0, wordIndex, characterIndex)
        }
    }

    return buffer.toTensor()
}

async function decodeUppercaseIndices(tensor, words, wordSize) {
    const tensorData = await tensor.array();

    return words.map((word, wordIndex) => 
        Array.from(word).map((char, characterIndex) => 
        tensorData[wordIndex][characterIndex] > 0.5 ? char.toUpperCase(): char).join(""))
}

const hiddenSize = 100;

// easy make a neural network
const model = tf.sequential();

model.add(tf.layers.dense({
    inputShape: [windowSize, numberOfLabels],
    units: hiddenSize
}))

model.add(tf.layers.dense({
    units: hiddenSize * 2
}))

model.add(tf.layers.dense({
    units: windowSize,
    activation: "sigmoid"
}))

model.compile({
    loss: 'binaryCrossentropy',
    optimizer: tf.train.adam(),
    metrics: ['accuracy'],
})

model.summary()


// second step train
// third step enjoy