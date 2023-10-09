import { opendir, readFile, open, writeFile } from "node:fs/promises"
import * as path from "node:path"
import * as acorn from "acorn-loose"
import * as walk from "acorn-walk"
import { splitName } from "./methodNames.js"

async function scanFolder(folderPath, collector) {
    const directory = await opendir(folderPath, { recursive: true })

    for await (const fileOrDir of directory) {
        if (fileOrDir.isFile() && fileOrDir.name.endsWith(".js")) {
            await scanFile(path.join(folderPath, fileOrDir.name), collector)
        } else if (fileOrDir.isDirectory()) {
            await scanFolder(path.join(folderPath, fileOrDir.name), collector) 
        }
    }
}

scanFolder(".", () => {})

async function scanFile(path, collector) {
    const source = await readFile(path)
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
    const file = await open(path, 'w')
    const writeStream = file.createWriteStream()
    const textEncoder = new TextEncoder()
    
    for (const [word, frequency] of stats.entries()) {
        writeStream.write(textEncoder.encode(`${word}, ${frequency}\n`))
    }

    writeStream.close()
    file.close()
}

const names = [];

for (const sourceFolder of process.argv.slice(2)) {
    console.log("Scanning", sourceFolder)
    await scanFolder(sourceFolder, name => {
        names.push(name)
    })
}

const splittedNames = names
    .flatMap(splitName)
    .map(name => name.toLowerCase())

await writeStats(countOccurences(splittedNames), "./stats.csv")
await writeFile("./names.csv", Array.from(new Set(names)).map(name => name + "\n"))

