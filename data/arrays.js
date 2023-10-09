/**
 * Produces an array of consecutive numbers starting from start until endin steps of step. 
 * @param {Number} start The number to start
 * @param {Number} end The last number
 * @param {Number} step The step size
 * @returns Number[] an array numbers
 */
export function count(start = 0, end, step = 1) {
    return Array.from({ length: end - start + 1 }).map((v, index) => start + index * step)
}

export function numericalMin(numbers) {
    return numbers.reduce((a, b) => Math.min(a, b))
}

export function numericalMax(numbers) {
    return numbers.reduce((a, b) => Math.max(a, b))
}

export function numericalHistogram(numbers) {
    const min = numericalMin(numbers)
    const max = numericalMax(numbers)

    const bins = count(min, max)

    for (const number of numbers) {
        bins[number] = bins[number] + 1
    }

    return bins
}