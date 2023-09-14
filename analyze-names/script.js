import { walk as walkFs } from "https://deno.land/std@0.200.0/fs/mod.ts"
import * as acorn from "acorn-loose"
import * as walk from "acorn-walk"
import { splitName } from "./methodNames.js"

async function scanFolder(path, collector) {
    for await (const entry of walkFs(path, { includeDirs: false, exts: ['.js']})) {
        scanFile(entry.path, collector)
    }
}

async function scanFile(path, collector) {
    const source = await Deno.readTextFile(path)
    try {
        const ast = acorn.parse(source, {
            ecmaVersion: "latest",
            sourceType: "module",
            sourceFile: path
        })
        walk.simple(ast, {
            Identifier(node) {
                collector(node.name)
            }
        })
    } catch (e) {
        console.error(e)
    }
   
}

function countOccurences(array) {
    const countsByEntry = new Map()

    for (const entry of array) {
        if (!countsByEntry.has(entry)) {
            countsByEntry.set(entry, 0)
        }
        countsByEntry.set(entry, countsByEntry.get(entry) + 1)
    }

    return countsByEntry
}

async function writeStats(stats, path) {
    const file = await Deno.open(path, { write: true, create: true })
    const textEncoder = new TextEncoder()
    const writer = file.writable.getWriter()
    for (const [word, frequency] of stats.entries()) {
        await writer.write(textEncoder.encode(`${word}, ${frequency}\n`))
    }

    file.close()
}

const names = [];

for (const sourceFolder of Deno.args) {
    console.log("Scanning", sourceFolder)
    await scanFolder(sourceFolder, name => {
        names.push(name)
    })
}

const splittedNames = names
    .flatMap(splitName)
    .map(name => name.toLowerCase())

writeStats(countOccurences(splittedNames), "./stats.csv")

const originalAndSplittedNames = names.map(name => ({ name, parts: splitName(name)}))
await Deno.writeTextFile("./namesAndParts.json", JSON.stringify(originalAndSplittedNames))

