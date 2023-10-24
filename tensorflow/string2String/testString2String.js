import { methodNames } from '../../data/dictionaries.js';
import { filterAlphabetic } from '../../data/methodNames.js';
import { convertToCamelcase, windowLength } from './converter.js';

console.log(convertToCamelcase("filterbooksbytitle"))

const names = filterAlphabetic(await methodNames())
const longEnoughNames = names.filter(name => name.length > windowLength)
const results = longEnoughNames.map(name => ({ name, prediction: convertToCamelcase(name.toLowerCase())}))
const correctAnswers = results.filter(({ name, prediction }) => name === prediction)
const incorrectAnswers = results.filter(({ name, prediction }) => name !== prediction)
console.log(correctAnswers.length / longEnoughNames.length)
console.log(incorrectAnswers.slice(0, 10))
console.log(correctAnswers.slice(0, 10))