import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createModdle } from './helper.js';

describe('erm-moddle - writing', () => {
    const moddle = createModdle();

    it('should export simple entity to JSON', async () => {
        // arrange
        const attribute = moddle.create('erm:Attribute', {
            id: 'Attribute_1',
            name: 'customerID',
            dataType: 'String',
        });

        const entity = moddle.create('erm:Entity', {
            id: 'Entity_1',
            name: 'Customer',
            attributes: [attribute],
        });

        const root = moddle.create('erm:Root', {
            id: 'Root_1',
            cells: [entity],
        });

        // act
        const exportedJsonText = await moddle.toJson(root);

        // assert
        const exportedJson = JSON.parse(exportedJsonText);
        expect(exportedJson).to.have.property('$type', 'erm:Root');
        expect(exportedJson.cells).to.have.length(1);

        const exportedEntity = exportedJson.cells[0];
        expect(exportedEntity).to.deep.include({
            $type: 'erm:Entity',
            id: 'Entity_1',
            name: 'Customer',
        });
        expect(exportedEntity.attributes).to.have.length(1);
        expect(exportedEntity.attributes[0]).to.deep.include({
            $type: 'erm:Attribute',
            id: 'Attribute_1',
            name: 'customerID',
            dataType: 'String',
        });
    });

    it('should export entity-relationship connection', async () => {
        // arrange
        const customer = moddle.create('erm:Entity', {
            id: 'Entity_1',
            name: 'Customer',
        });
        const order = moddle.create('erm:Entity', {
            id: 'Entity_2',
            name: 'Order',
        });
        const places = moddle.create('erm:Relationship', {
            id: 'Relationship_1',
            name: 'places',
        });
        const customerAssoc = moddle.create('erm:Association', {
            id: 'Association_1',
            sourceRef: customer.id,
            targetRef: places.id,
            minCardinality: '0',
            maxCardinality: '*',
        });

        const orderAssoc = moddle.create('erm:Association', {
            id: 'Association_2',
            sourceRef: order.id,
            targetRef: places.id,
            minCardinality: '1',
            maxCardinality: '1',
        });

        const root = moddle.create('erm:Root', {
            id: 'Root_1',
            cells: [customer, order, places, customerAssoc, orderAssoc],
        });

        // act
        const exportedJsonText = await moddle.toJson(root);

        // assert
        const exportedJson = JSON.parse(exportedJsonText);
        expect(exportedJson.cells).to.have.length(5);

        const exportedAssocs = exportedJson.cells.filter(
            (cell) => cell.$type === 'erm:Association',
        );
        expect(exportedAssocs).to.have.length(2);

        const customerAssocExported = exportedAssocs.find(
            (a) => a.id === 'Association_1',
        );
        expect(customerAssocExported.sourceRef).to.equal('Entity_1');
        expect(customerAssocExported.targetRef).to.equal('Relationship_1');

        const orderAssocExported = exportedAssocs.find(
            (a) => a.id === 'Association_2',
        );
        expect(orderAssocExported.sourceRef).to.equal('Entity_2');
        expect(orderAssocExported.targetRef).to.equal('Relationship_1');
    });

    it('should export elements with positions', async () => {
        // Create entity with position
        const entity = moddle.create('erm:Entity', {
            id: 'Entity_1',
            name: 'Customer',
            x: 100,
            y: 150,
            width: 120,
            height: 80,
        });

        // Create relationship with position
        const relationship = moddle.create('erm:Relationship', {
            id: 'Relationship_1',
            name: 'orders',
            x: 300,
            y: 150,
            width: 100,
            height: 60,
        });

        // Create comment with position
        const comment = moddle.create('erm:Comment', {
            id: 'Comment_1',
            textContent: 'Important business rule',
            x: 400,
            y: 50,
            width: 150,
            height: 40,
        });

        // Create root with positioned elements
        const root = moddle.create('erm:Root', {
            id: 'Root_1',
            cells: [entity, relationship, comment],
        });

        // act
        const exportedJsonText = await moddle.toJson(root);

        // assert
        const exportedJson = JSON.parse(exportedJsonText);
        expect(exportedJson.cells).to.have.length(3);

        const exportedEntity = exportedJson.cells.find(
            (c) => c.id === 'Entity_1',
        );
        expect(exportedEntity).to.include({
            x: 100,
            y: 150,
            width: 120,
            height: 80,
        });

        const exportedRelationship = exportedJson.cells.find(
            (c) => c.id === 'Relationship_1',
        );
        expect(exportedRelationship).to.include({
            x: 300,
            y: 150,
            width: 100,
            height: 60,
        });

        const exportedComment = exportedJson.cells.find(
            (c) => c.id === 'Comment_1',
        );
        expect(exportedComment).to.include({
            x: 400,
            y: 50,
            width: 150,
            height: 40,
        });
    });

    it('should not set default positions for elements without explicit positions', async () => {
        const entity = moddle.create('erm:Entity', {
            id: 'Entity_1',
            name: 'Customer',
        });

        const root = moddle.create('erm:Root', {
            id: 'Root_1',
            cells: [entity],
        });
        // act
        const exportedJsonText = await moddle.toJson(root);

        // assert
        const exportedJson = JSON.parse(exportedJsonText);
        const exportedEntity = exportedJson.cells[0];

        expect(exportedEntity.x).to.be.undefined;
        expect(exportedEntity.y).to.be.undefined;
    });
});
