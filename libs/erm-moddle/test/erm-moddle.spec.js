import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createModdle } from './helper.js';

describe('erm-moddle', function () {
    const moddle = createModdle();

    describe('moddle schema parsing', function () {
        it('should expose erm-moddle types and descriptors', function () {
            const ermTypes = [
                'Root',
                'BaseElement',
                'ErmMetaElement',
                'ErmMetaLink',
                'ErmElement',
                'Entity',
                'Relationship',
                'Attribute',
                'Comment',
                'Constraint',
                'Generalization',
                'DisjunctGeneralization',
                'OverlappingGeneralization',
                'Association',
                'NoteLink',
                'SubsetLink',
            ];
            // when
            const moddleTypes = ermTypes.map((ermType) => {
                return moddle.getType('erm:'.concat(ermType));
            });

            // then
            expect(moddleTypes).to.all.exist;

            const moddleDescriptors = moddleTypes.map(
                (moddleType) => moddleType.$descriptor,
            );
            expect(moddleDescriptors).to.all.exist;
        });
    });

    describe('creation', function () {
        it('should create Entity', function () {
            const entity = moddle.create('erm:Entity');

            expect(entity.$type).to.eql('erm:Entity');
        });

        it('should create Relationship', function () {
            const relationship = moddle.create('erm:Relationship');

            expect(relationship.$type).to.eql('erm:Relationship');
        });

        it('should create Attributes inside Entity', function () {
            const zipCode = moddle.create('erm:Attribute');
            const city = moddle.create('erm:Attribute');
            const address = moddle.create('erm:Entity', {
                attributes: [zipCode, city],
            });

            expect(zipCode.$type).to.eql('erm:Attribute');
            expect(city.$type).to.eql('erm:Attribute');
            expect(address.attributes).to.eql([zipCode, city]);
        });

        it('should create Comment', function () {
            const comment = moddle.create('erm:Comment');

            expect(comment.$type).to.eql('erm:Comment');
        });

        it('should create Constraint', function () {
            const constraint = moddle.create('erm:Constraint');

            expect(constraint.$type).to.eql('erm:Constraint');
        });

        it('should create Generalization', function () {
            const generalization = moddle.create('erm:Generalization');

            expect(generalization.$type).to.eql('erm:Generalization');
        });

        it('should create DisjunctGeneralization', function () {
            const generalization = moddle.create('erm:DisjunctGeneralization');

            expect(generalization.$type).to.eql('erm:DisjunctGeneralization');
            expect(generalization.$instanceOf('erm:Generalization')).to.be.true;
        });

        it('should create OverlappingGeneralization', function () {
            const generalization = moddle.create(
                'erm:OverlappingGeneralization',
            );

            expect(generalization.$type).to.eql(
                'erm:OverlappingGeneralization',
            );
            expect(generalization.$instanceOf('erm:Generalization')).to.be.true;
        });

        it('should create Association', function () {
            const generalization = moddle.create('erm:Association');

            expect(generalization.$type).to.eql('erm:Association');
            expect(generalization.$instanceOf('erm:ErmMetaLink')).to.be.true;
        });

        it('should create NoteLink', function () {
            const generalization = moddle.create('erm:NoteLink');

            expect(generalization.$type).to.eql('erm:NoteLink');
            expect(generalization.$instanceOf('erm:ErmMetaLink')).to.be.true;
        });

        it('should create SubsetLink', function () {
            const generalization = moddle.create('erm:SubsetLink');

            expect(generalization.$type).to.eql('erm:SubsetLink');
            expect(generalization.$instanceOf('erm:ErmMetaLink')).to.be.true;
        });

        describe('default values after initialization', function () {
            it('should init Entity', function () {
                const entity = moddle.create('erm:Entity');

                expect(entity.name).to.eql('<Identifier>');
                expect(entity.dragOutAllowed).to.be.false;
            });

            it('should init Relationship', function () {
                const relationship = moddle.create('erm:Relationship');

                expect(relationship.name).to.eql('<Name>');
            });

            it('should init Attribute', function () {
                const attribute = moddle.create('erm:Attribute');

                expect(attribute.name).to.eql('<Name>');
                expect(attribute.dragOutAllowed).to.be.false;
            });

            it('should init Comment', function () {
                const comment = moddle.create('erm:Comment');

                expect(comment.text).to.eql('<Comment>');
            });
        });
    });
    describe('getting and setting properties', function () {
        it('should set id attribute', function () {
            const comment = moddle.create('erm:Comment');
            expect(comment.get('id')).not.to.exist;
            comment.set('id', '1');
            expect(comment).to.deep.include({ $type: 'erm:Comment' });
            expect(comment).to.deep.include({ id: '1' });
        });

        it('should set enumerable dataType property on Attribute', function () {
            const attribute = moddle.create('erm:Attribute');
            expect(attribute.get('dataType')).not.to.exist;
            attribute.set('dataType', 'Timestamp');
            expect(attribute).to.deep.include({ $type: 'erm:Attribute' });
            expect(attribute).to.deep.include({ dataType: 'Timestamp' });
        });
    });

    describe('building hierarchies', function () {
        it('should create simple hierarchy', function () {
            const root = moddle.create('erm:Root');
            const cells = root.get('erm:cells');
            const artistEntity = moddle.create('erm:Entity');
            const performsRelationship = moddle.create('erm:Relationship');
            const songEntity = moddle.create('erm:Entity');

            artistEntity.name = 'Artist';
            performsRelationship.name = 'performs';
            songEntity.name = 'Song';

            cells.push(artistEntity, performsRelationship, songEntity);

            expect(cells).to.eql([
                artistEntity,
                performsRelationship,
                songEntity,
            ]);
            expect(root.cells).to.eql([
                artistEntity,
                performsRelationship,
                songEntity,
            ]);
            expect(JSON.stringify(root)).to.eql(
                JSON.stringify({
                    $type: 'erm:Root',
                    cells: [
                        { $type: 'erm:Entity', name: 'Artist' },
                        { $type: 'erm:Relationship', name: 'performs' },
                        { $type: 'erm:Entity', name: 'Song' },
                    ],
                }),
            );
        });
    });
});
