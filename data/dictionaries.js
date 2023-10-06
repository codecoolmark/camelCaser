import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

export async function englishWords() {
    const wordFile = await Deno.open("words_alpha.txt")
    const textDecoder = new TextDecoder()
    const wordSet = new Set()

    for await (const line of readline(wordFile)) {
        const trimmedLine = textDecoder.decode(line).trim();
        wordSet.add(trimmedLine);
    }

    wordFile.close();
    return wordSet;
}

export async function methodNames() {
    const wordFile = await await Deno.open("stats.csv")
    const textDecoder = new TextDecoder()
    const wordSet = new Set()

    for await (const lineBytes of readline(wordFile)) {
        const line = textDecoder.decode(lineBytes);
        const [word, _] = line.split(",")
        wordSet.add(word);
    }

    wordFile.close();
    return wordSet;
}

export async function methodNamesAndStats() {
    const wordFile = await await Deno.open("stats.csv")
    const textDecoder = new TextDecoder()
    const stats = new Map()

    for await (const lineBytes of readline(wordFile)) {
        const line = textDecoder.decode(lineBytes);
        const [word, number] = line.split(",")
        stats.set(word, Number.parseInt(number));
    }

    wordFile.close();
    return stats;
}