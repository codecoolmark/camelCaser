import * as tf from '@tensorflow/tfjs-node';

export function* windows(windowLength, string) {
    for (let offset = 0; (offset + windowLength) <= string.length; offset++) {
        yield string.substring(offset, offset + windowLength)
    }
}

export function trainingAndValidationSet(pairs, trainingSize, validationSize) {
    const [trainingSet, rest] = nPairs(trainingSize, pairs)
    const [validationSet, _] = nPairs(validationSize, rest)

    return [trainingSet, validationSet]
}

function nPairs(number, pairs) {
    const stack = [...pairs]
    const choosenPairs = []

    while (choosenPairs.length < number) {
        const [choosenPair] = stack.splice(Math.floor(Math.random() * stack.length), 1)
        choosenPairs.push(choosenPair)
    }

    return [choosenPairs, stack]
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