import { alphabeticMethodNames } from '../../data/dictionaries.js';
import { convertToCamelcase, windowLength } from './converter.js';

console.log(await convertToCamelcase("getelementbyid"))

const names = await alphabeticMethodNames()
const longEnoughNames = names.filter(name => name.length > windowLength)
console.log(longEnoughNames.length)

console.log(await convertToCamelcase("addeventlistener"))
console.log(await convertToCamelcase("sendbeacon"))

function equalsIgnoreFirstLetter(string1, string2) {
    return string1.substring(1) === string2.substring(1)
}

const results = await Promise.all(longEnoughNames.map(async name => ({ name, prediction: await convertToCamelcase(name.toLowerCase())})))
const correctAnswers = results.filter(({ name, prediction }) => equalsIgnoreFirstLetter(name, prediction))
const incorrectAnswers = results.filter(({ name, prediction }) => !equalsIgnoreFirstLetter(name, prediction))
console.log(correctAnswers.length / longEnoughNames.length)
console.log(incorrectAnswers.slice(0, 20))
console.log(correctAnswers.slice(0, 10))