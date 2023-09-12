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
    const parts = [];
    let currentPart = ""

    let isLower = isLowerCase(string[0])
    for (const char of string) {
        if (isLower && isUpperCase(char)) {
            parts.push(currentPart)
            currentPart = ""
        }

        if (!isLower && isLowerCase(char)) {
            parts.push(currentPart)
            currentPart = ""
        }

        isLower = isLowerCase(char)
        currentPart += char
    }

    if (currentPart.length > 0) {
        parts.push(currentPart)
    }

    return parts
}