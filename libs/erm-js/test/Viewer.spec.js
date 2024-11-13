import { simple } from './fixtures';
import TestContainer from 'mocha-test-container-support';
import Viewer from '../src/Viewer';

describe('Viewer', function () {
    let container;

    beforeEach(function () {
        container = TestContainer.get(this);
    });

    describe('#saveJson', function () {
        it('should export JSON', async () => {
            // given
            const diagram = JSON.stringify(simple);

            const viewer = new Viewer({ container: container });

            await viewer.importJson(diagram);

            const json = await viewer.saveJson();

            expect(json).to.deep.equal(diagram);
        });

        it('should emit <saveJson.*> events', async () => {
            // given
            const diagram = JSON.stringify(simple);
            const events = [];

            const viewer = new Viewer({ container: container });

            viewer.on(
                ['saveJson.start', 'saveJson.serialized', 'saveJson.done'],
                (e) => {
                    events.push([
                        e.type,
                        Object.keys(e).filter((key) => key !== 'type'),
                    ]);
                },
            );

            // when
            await viewer.importJson(diagram);
            await viewer.saveJson();

            // then
            expect(events).to.eql([
                ['saveJson.start', ['root']],
                ['saveJson.serialized', ['json']],
                ['saveJson.done', ['error', 'json']],
            ]);
        });
    });
});
