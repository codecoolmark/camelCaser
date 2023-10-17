function isLowerCase(char) {
    return char !== undefined && char.toLowerCase() === char;
}

function isUpperCase(char) {
    return char !== undefined && char.toUpperCase() === char;
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

export function isSnakeCase(methodName) {
    return methodName.includes("_")
}

export function isKebabCase(methodName) {
    return methodName.includes("-")
}

export function isCamelCase(methodName) {
    return isLowerCase(methodName[0]) && !isKebabCase(methodName) && !isSnakeCase(methodName)
}

export function isPascalCase(name) {
    return isUpperCase(name[0]) && !isKebabCase(name) && !isSnakeCase(name)
}

export function splitSnakeCase(name) {
    return name.split("_")
}

export function splitKebabCase(name) {
    return name.split("-")
}

export function splitName(name) {
    return splitSnakeCase(name)
        .flatMap(name => splitKebabCase(name))
        .flatMap(name => splitCamelCase(name))
}

function capitalize(word) {
    if (word === "") {
        return word;
    }
    const [firstLetter, ...rest] = word;
    return firstLetter.toUpperCase() + rest.join("");
}

export function joinCamelCase(parts) {
    const [firstWord, ...restWords] = parts
    return firstWord.toLowerCase() + restWords.map(word => capitalize(word)).join("");
}

export function filterAlphabetic(names) {
    const regex = new RegExp("^[a-zA-Z]+$", "g")
    return names.filter(name => regex.test(name))
}