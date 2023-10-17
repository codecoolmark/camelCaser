import { methodNames } from "../data/dictionaries.js"
import { windows } from "../tensorflow/data.js"

const names = await methodNames()

const windowSize = 10

const testWindows = Array.from(windows(5, "helloworld"))
const allWindows = names.flatMap(name => Array.from(windows(10, name)))

// easy make a neural network
// second step train
// third step enjoy