import { splittings } from './splittings.js';

function capitalize(word) {
    if (word === "") {
        return word;
    }
    const [firstLetter, ...rest] = word;
    return firstLetter.toUpperCase() + rest.join("");
}

export function convertToCamelCaseDictionary(words, identifier) {
    const nextBest = function(bestScore, bestSplitting, splitting) {
        const wordCount = splitting.filter(part => words.has(part)).length;

        if (splitting.every(part => words.has(part))) {
            if (bestSplitting === null || splitting.length < bestSplitting.length || bestScore > 0) {
                return [splitting.length - wordCount, splitting]
            }
        } else if (bestSplitting === null) {
            return [splitting.length - wordCount, splitting]
        } else if ((splitting.length - wordCount) < bestScore) {
            return [splitting.length - wordCount, splitting]
        }

        return [bestScore, bestSplitting]
    }

    return convertToCamelCase(identifier, nextBest, null, identifier.length)
}

export function convertToCamelCase(identifier, nextBest, initialBestSplitting = undefined, initialScore = undefined) {
    const allSplittings = splittings(identifier);

    let bestSplitting = initialBestSplitting;
    let bestScore = initialScore;

    for (const splitting of allSplittings) {
        [bestScore, bestSplitting] = nextBest(bestScore, bestSplitting, splitting)
    }

    const [firstWord, ...restWords] = bestSplitting
    const camelCaseIdentifier = firstWord + restWords.map(word => capitalize(word)).join("");

    return camelCaseIdentifier
}

export function convertToCamelCaseWeighted(wordStats, identifier) {
    const nextBest = function(bestScore, bestSplitting, splitting) {
        const score = splitting
            .map(word => wordStats.get(word.toLowerCase()) ?? 0)
            .reduce((sum, score) => sum + score, 0) / splitting.length

        if (bestScore < score) {
            return [score, splitting]
        }

        return [bestScore, bestSplitting]
    }

    return convertToCamelCase(identifier, nextBest, 0, null)
}