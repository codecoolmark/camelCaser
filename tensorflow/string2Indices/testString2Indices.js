import { methodNames } from '../../data/dictionaries.js';
import { convertToCamelcase, windowLength } from './converter.js';

console.log(await convertToCamelcase("getelementbyid"))

const names = await methodNames()
const longEnoughNames = names.filter(name => name.length > windowLength)
console.log(longEnoughNames.length)

console.log(await convertToCamelcase("addeventlistener"))
console.log(await convertToCamelcase("sendbeacon"))

const results = await Promise.all(longEnoughNames.map(async name => ({ name, prediction: await convertToCamelcase(name.toLowerCase())})))
const correctAnswers = results.filter(({ name, prediction }) => name === prediction)
const incorrectAnswers = results.filter(({ name, prediction }) => name !== prediction)
console.log(correctAnswers.length / longEnoughNames.length)
console.log(incorrectAnswers.slice(0, 20))
console.log(correctAnswers.slice(0, 10))