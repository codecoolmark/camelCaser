import { plot } from "nodeplotlib"
import { alphabeticMethodNames, methodNames } from "./data/dictionaries.js"
import { average, count, numericalHistogram, numericalMax, std } from "./data/arrays.js"
import { splitCamelCase } from "./data/methodNames.js"

const names = await methodNames() 
console.log("Data contains", names.length, "unique method names.")
const lengths = names.map(name => name.length)
const alphabeticNames = await alphabeticMethodNames()
console.log("Data contains", alphabeticNames.length, "alphabetic method names")
console.log(alphabeticNames)

const longestName = numericalMax(lengths)
console.log("Longest name is", longestName, "charcters.")
console.log("The average method name length is", average(lengths))

const methodLengths = count(0, longestName)
const counts = numericalHistogram(lengths)

plot([{x: methodLengths, y: counts, type: "bar"}], { title: "Distribution of method name lengths" })

const numberOfParts = names.map(name => splitCamelCase(name).length)
const maximumNumberOfParts = numericalMax(numberOfParts)

console.log("Maximum number of parts", maximumNumberOfParts)
console.log("The average number of parts is", average(numberOfParts))

const partNumbers = count(0, maximumNumberOfParts)
const partCounts = numericalHistogram(numberOfParts)

plot([{x: partNumbers, y: partCounts, type: "bar"}], { title: "Distribution of the number of parts" })

const parts = names.flatMap(name => splitCamelCase(name))
const partLengths = parts.map(part => part.length)
const maximumPartLength = numericalMax(partLengths)

console.log("The longest part is", maximumPartLength, "characters long")
console.log("The average part length is", average(partLengths), "with a std of", std(partLengths))

const partLengthCounts = numericalHistogram(partLengths)

plot([{ x: count(0, maximumPartLength), y: partLengthCounts, type: "bar" }], { title: "Distribution of part lengths" })