import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const dirName = ".tensorflow"

export async function modelFolder(modelName) {
    const modelFolder = await mkdir(join(dirName, modelName), { recursive: true })
    return join(dirName, modelName)
}