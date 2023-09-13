import { assertEquals } from "https://deno.land/std@0.201.0/assert/mod.ts";
import { isCamelCase, isKebabCase, isSnakeCase, splitCamelCase, splitName } from "./methodNames.js";

const isSnakeCaseTestCases = [
    [false, ""],
    [false, "word"],
    [true, "snake_case"]
]

isSnakeCaseTestCases.forEach(([expectedOutput, input]) => {
    Deno.test(`testing isSnakeCase("${input}")`, () => {
        assertEquals(expectedOutput, isSnakeCase(input))
    })
})

const isKebabCaseTestCases = [
    [false, ""],
    [false, "word"],
    [true, "kebab-case"]
]

isKebabCaseTestCases.forEach(([expectedOutput, input]) => {
    Deno.test(`testing isKebabCase("${input}")`, () => {
        assertEquals(expectedOutput, isKebabCase(input))
    })
})

const isCamelCaseTestCases = [
    [false, ""],
    [true, "word"],
    [false, "Word"],
    [false, "snake_case"],
    [false, "kebab-case"],
    [true, "camelCase"],
    [true, "getCurrentEventPriority"]
]

isCamelCaseTestCases.forEach(([expectedOutput, input]) => {
    Deno.test(`testing isCamelCase("${input}")`, () => {
        assertEquals(expectedOutput, isCamelCase(input))
    })
})


const splitCamelCaseTestCases = [
    ["", []], 
    ["word", ["word"]],
    ["twoWords", ["two", "Words"]],
    ["threeTwoWords", ["three", "Two", "Words"]],
    ["testHTMLInput", ["test", "HTML", "Input"]]
]

splitCamelCaseTestCases.forEach(([input, expectedOutput]) => {
    Deno.test(`testing input "${input}"`, () => {
        assertEquals(expectedOutput, splitCamelCase(input))
    })
});

const splitNameTestCases = [
    ["getCurrentEventPriority", ["get", "Current", "Event", "Priority"]]
]

splitNameTestCases.forEach(([input, expectedOutput]) => {
    Deno.test(`testing splitName("${input}")`, () => {
        assertEquals(expectedOutput, splitName(input))
    })
});

