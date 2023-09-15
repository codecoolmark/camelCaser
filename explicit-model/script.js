import { convertToCamelCaseDictionary, convertToCamelCaseWeighted } from "./camelCaser.js"
import { englishWords, methodNames, methodNamesAndStats } from "./dictionaries.js"
import nameAndParts from "../analyze-names/namesAndParts.json" assert { type: 'json' }


console.log("getlementbyid", convertToCamelCaseDictionary(await englishWords(), "getelementbyid"))
console.log("getlementbyid", convertToCamelCaseDictionary(await methodNames(), "getelementbyid"))
console.log("getlementbyid", convertToCamelCaseWeighted(await methodNamesAndStats(), "getelementbyid"))
console.log("geta", convertToCamelCaseWeighted(await methodNamesAndStats(), "geta"))