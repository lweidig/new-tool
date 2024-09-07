import fs from 'fs';
import ErmModdle from '@new-tool/erm-moddle';

export function createModdle(additionalPackages, options) {
    return new ErmModdle(additionalPackages, options);
}

export function readFile(filename) {
    return fs.readFileSync(filename, { encoding: 'UTF-8' });
}
