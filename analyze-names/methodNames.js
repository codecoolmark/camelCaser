function isLowerCase(char) {
    return char?.toLowerCase() === char;
}

function isUpperCase(char) {
    return char?.toUpperCase() === char;
}

function* triplets(string) {
    for (let index = 1; index < string.length - 1; index++) {
        yield [string[index - 1], string[index], string[index + 1]]
    }
}

export function splitCamelCase(string) {
    const stringTriplets = Array.from(triplets(string))
    const splittingIndices = stringTriplets
        .map(([first, middle, last], tripletIndex) => {
            if (isLowerCase(first) && isUpperCase(middle)) {
                return tripletIndex + 1;
            }

            if (isUpperCase(first) && isUpperCase(middle) && isLowerCase(last)) {
                return tripletIndex + 1;
            }
        })
        .filter(value => value !== undefined);


    let lastSplittingIndex = 0;
    const parts = [];
    for (const splittingIndex of splittingIndices) {
        parts.push(string.substring(lastSplittingIndex, splittingIndex))
        lastSplittingIndex = splittingIndex
    }

    if (lastSplittingIndex < string.length) {
        parts.push(string.substring(lastSplittingIndex))        
    }

    return parts;
}