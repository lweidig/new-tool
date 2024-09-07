import { describe, it } from 'mocha';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createModdle, readFile } from './helper.js';

chai.use(chaiAsPromised);

describe('erm-moddle reading', function () {
    const moddle = createModdle();

    it('should read empty root element', async function () {
        const jsonString = JSON.stringify({ $type: 'erm:Root' });

        const result = await moddle.fromJson(jsonString);

        expect(result).to.exist;
        expect(result.$type).to.equal('erm:Root');
        expect(result.cells).to.be.an('array');
        expect(result.cells).to.have.length(0);
    });

    it('should read simple example json', async function () {
        const jsonString = readFile('./test/resources/simple.json');

        const result = await moddle.fromJson(jsonString);

        expect(result).to.exist;
        expect(result.$type).to.equal('erm:Root');
        expect(result.cells).to.be.an('array');
        expect(result.cells).to.have.length(5);
        expect(result.cells[0].$type).to.equal('erm:Entity');
        expect(result.cells[0].name).to.equal('Kunde');
        for (const cell of result.cells) {
            expect(cell.$instanceOf('erm:BaseElement')).to.be.true;
        }
    });

    it('should return best effort instance when one element is missing its $type attribute', async function () {
        const jsonString = readFile(
            './test/resources/simple_with_cell_missing_type.json',
        );

        const result = await moddle.fromJson(jsonString);

        expect(result).to.exist;
        expect(result.cells).to.be.an('array');
        expect(result.cells).to.have.length(4);
        expect(result.cells[3].id).to.equal('association2');
    });

    it('should reject json without root element', async function () {
        const jsonString = readFile(
            './test/resources/simple_without_root.json',
        );

        const moddleFromJsonWithMissingRootElement = () =>
            moddle.fromJson(jsonString);

        await expect(moddleFromJsonWithMissingRootElement()).to.be.rejectedWith(
            Error,
            'Could not find root element',
        );
    });

    it('should reject not parseable string', async function () {
        const jsonString = 'invalid json';

        const moddleFromJsonWithMissingRootElement = () =>
            moddle.fromJson(jsonString);

        await expect(moddleFromJsonWithMissingRootElement()).to.be.rejectedWith(
            Error,
            'Unexpected token \'i\', "invalid json" is not valid JSON',
        );
    });
});
