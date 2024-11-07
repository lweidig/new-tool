import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe, it } from 'mocha';
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
        expect(result.cells[0].name).to.equal('Customer');
        for (const cell of result.cells) {
            expect(cell.$instanceOf('erm:BaseElement')).to.be.true;
        }
    });

    it('should read complete example json', async function () {
        const jsonString = readFile('./test/resources/complete.json');
        const result = await moddle.fromJson(jsonString);

        // Grundlegende Struktur
        expect(result).to.exist;
        expect(result.$type).to.equal('erm:Root');
        expect(result.cells).to.be.an('array');
        expect(result.cells).to.have.length(14);

        // Prüfe spezifische Elementtypen
        const elementTypes = result.cells.reduce((types, cell) => {
            types[cell.$type] = (types[cell.$type] || 0) + 1;
            return types;
        }, {});

        // Erwartete Anzahl pro Typ
        expect(elementTypes['erm:Entity']).to.equal(3); // Person, Employee, Manager
        expect(elementTypes['erm:Relationship']).to.equal(1); // Employment
        expect(elementTypes['erm:DisjunctGeneralization']).to.equal(1);
        expect(elementTypes['erm:OverlappingGeneralization']).to.equal(1);
        expect(elementTypes['erm:Comment']).to.equal(1);
        expect(elementTypes['erm:Constraint']).to.equal(1);
        expect(elementTypes['erm:Association']).to.equal(4);
        expect(elementTypes['erm:NoteLink']).to.equal(1);
        expect(elementTypes['erm:SubsetLink']).to.equal(1);

        // Prüfe Person Entity und seine Attribute
        const personEntity = result.cells.find(
            (cell) => cell.$type === 'erm:Entity' && cell.id === 'person',
        );
        expect(personEntity).to.exist;
        expect(personEntity.name).to.equal('Person');
        expect(personEntity.attributes).to.have.length(4);
        // Prüfe Attribute Typen
        const personIdAttr = personEntity.attributes.find(
            (attr) => attr.id === 'personId',
        );
        expect(personIdAttr).to.exist;
        expect(personIdAttr.name).to.equal('PersonID');
        expect(personIdAttr.dataType).to.equal('Integer');

        // Prüfe, dass alle Elemente von BaseElement erben
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

        return expect(
            moddleFromJsonWithMissingRootElement(),
        ).to.be.rejectedWith(
            Error,
            'Could not find root element. Please provide a valid ERM JSON string.',
        );
    });

    it('should reject not parseable string', async function () {
        const jsonString = 'invalid json';

        const moddleFromInvalidJson = () => moddle.fromJson(jsonString);

        return expect(moddleFromInvalidJson()).to.be.rejectedWith(
            Error,
            'Unexpected token \'i\', "invalid json" is not valid JSON',
        );
    });
});
