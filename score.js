import { convertToCamelCaseDictionary, convertToCamelCaseWeighted } from "./camelCaser.js"
import { englishWords, methodNames, methodNamesAndStats } from "./dictionaries.js"
import nameAndParts from "./namesAndParts.json" assert { type: 'json' }

const testSet = nameAndParts.filter(({ name, parts }) => name.length < 22 && parts.length > 1)

function score(convert) {
    return testSet
        .map(({ name }) => convert(name.toLowerCase()) === name)
        .reduce((sum, equals) => equals ? sum + 1 : sum, 0)
    / testSet.length
}

const setOfEnglishWords = await englishWords()
const setOfMethodNames = await methodNames()
const mapOfMethodNamesAndStats = await methodNamesAndStats()

console.log("getlementbyid", convertToCamelCaseDictionary(setOfEnglishWords, "getelementbyid"))
console.log("getlementbyid", convertToCamelCaseDictionary(setOfMethodNames, "getelementbyid"))
console.log("getlementbyid", convertToCamelCaseWeighted(mapOfMethodNamesAndStats, "getelementbyid"))

console.log(score(word => convertToCamelCaseDictionary(setOfEnglishWords, word)))
console.log(score(word => convertToCamelCaseDictionary(setOfMethodNames, word)))
console.log(score(word => convertToCamelCaseWeighted(mapOfMethodNamesAndStats, word)))