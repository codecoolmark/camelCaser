import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { convertToCamelcase as convertToCamelcaseString2String } from './tensorflow/string2String/converter.js';
import { convertToCamelcase as convertToCamelcaseString2Indices } from './tensorflow/string2Indices/converter.js';
import { convertToCamelCaseDictionary } from './explicitmodel/camelCaser.js';
import { englishWords } from './data/dictionaries.js';

const rl = readline.createInterface({ input, output });

const setOfEnglishWords = await englishWords()

const models = {
    "string2string": convertToCamelcaseString2String,
    "string2indices": convertToCamelcaseString2Indices,
    "dictionaryModel": (input) => convertToCamelCaseDictionary(setOfEnglishWords, input)
}


async function convert(string) {
    for (const model in models) {
        let result = null
        try {
            result = await models[model](string)
        } catch (error) {
            result = error
        }

        console.log(model, result)
    }
}

let rlInput = null;

do {
    rlInput = await rl.question('Enter name to camel case\n');
    convert(rlInput)

} while (rlInput !== ".exit")

rl.close();
