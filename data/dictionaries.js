import { open } from "node:fs/promises"

async function readLines(file) {
    const wordFile = await open(file)
    const words = new Array()

    for await (const line of wordFile.readLines()) {
        words.push(line.trim());
    }

    wordFile.close()
    return words
}

export async function englishWords() {
    return new Set(await readLines("words_alpha.txt"))
}

export async function methodNames() {
    return await readLines("names.csv")
}

export async function methodNameParts() {
    const wordFile = await open("stats.csv")
    const wordSet = new Set()

    for await (const line of wordFile.readlines()) {
        const [word, _] = line.split(",")
        wordSet.add(word);
    }

    wordFile.close();
    return wordSet;
}

export async function alphabeticMethodNames() {
    const names = await methodNames()
    const regex = new RegExp(/^[a-zA-Z]+$/, "g")
    return names.filter(name => regex.test(name))
}

export async function methodNamesAndStats() {
    const wordFile = await open("stats.csv")
    const stats = new Map()

    for await (const line of wordFile.readlines()) {
        const [word, number] = line.split(",")
        stats.set(word, Number.parseInt(number));
    }

    wordFile.close();
    return stats;
}