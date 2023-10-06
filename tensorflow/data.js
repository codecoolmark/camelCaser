import namesAndParts from "../namesAndParts.json"  assert { type: "json" }
import * as tf from '@tensorflow/tfjs-node';


export function allPairs() {
    return namesAndParts.map(({ name }) => [name.toLowerCase(), name])
}

export function allPairsOfLength(min, max) {
    return allPairs().filter(([name, _]) => min < name.length < max)
}

export function nPairs(number, pairs = allPairs()) {
    const stack = [...pairs]
    const choosenPairs = []

    while (choosenPairs.length < number) {
        const [choosenPair] = stack.splice(Math.floor(Math.random() * stack.length), 1)
        choosenPairs.push(choosenPair)
    }

    return choosenPairs
}

export function maxInputLength(pairs) {
    return Math.max(...pairs.flatMap(([name, original]) => [name.length, original.length]))
}

export function normalize(pairs, toLength) {
    return pairs.map(([name, original]) => [name.padEnd(toLength, ' '), original.padEnd(toLength, ' ')])
}

export function shorten(pairs, length) {
    return pairs.map(([a, b]) => [a.substring(0, length), b.substring(0, length)])
}

export function produceCharacterTable(pairs) {
    const allCharacters = new Set(pairs.flatMap(([name, original]) => [...name, ...original]))
    const table = {}
    let lastIndex = 0;
    for (const char of allCharacters.values()) {
        table[char] = lastIndex;
        lastIndex = lastIndex + 1
    }

    return table
}

export function encodeStrings(normalizedStrings, charTable) {
    // explain hot encoding (equal distance between vectors)
    
    const stringLength = normalizedStrings[0].length
    const buffer = tf.buffer([normalizedStrings.length, stringLength, Object.entries(charTable).length])

    for (let stringIndex = 0; stringIndex < normalizedStrings.length; stringIndex++) {
        const currentString = normalizedStrings[stringIndex];

        for (let characterIndex = 0; characterIndex < stringLength; characterIndex++) {
            buffer.set(1, stringIndex, characterIndex, charTable[currentString[characterIndex]])
        }
    }

    return buffer.toTensor().as3D(normalizedStrings.length, stringLength, Object.entries(charTable).length);
}

function reverseTable(charTable) {
    const charByIndex = {};
    for (const char in charTable) {
        charByIndex[charTable[char]] = char
    }

    return charByIndex
}

export function decodeString(tensor, charTable) {
    const charByIndex = reverseTable(charTable)

    return tf.tidy(() => {
        const maxIndices = tensor.argMax(1);
        const indices = maxIndices.dataSync()
        let output = ''
        for (const index of Array.from(indices)) {
            output += charByIndex[index]
        }
        return output;
    });
}

export function decodeStrings(tensor, charTable) {
    const [_, maxLength, characters] = tensor.shape
    const tensors = tensor.unstack(0)
    return tensors.map(tensor => decodeString(tensor.as2D(maxLength, characters), charTable))
}