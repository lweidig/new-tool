import ErmModdle from '@new-tool/erm-moddle';

export function createModdle(additionalPackages, options) {
    return new ErmModdle(additionalPackages, options);
}
