import { open } from "node:fs/promises"

export async function englishWords() {
    const wordFile = await open("words_alpha.txt")
    const wordSet = new Set()

    for await (const line of wordFile.readLines()) {
        wordSet.add(line.trim());
    }

    wordFile.close();
    return wordSet;
}

export async function methodNames() {
    const wordFile = await open("stats.csv")
    const wordSet = new Set()

    for await (const line of wordFile.readlines()) {
        const [word, _] = line.split(",")
        wordSet.add(word);
    }

    wordFile.close();
    return wordSet;
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