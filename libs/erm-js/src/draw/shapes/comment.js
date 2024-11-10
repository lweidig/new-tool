import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';

import { toSVGPoints } from 'diagram-js/lib/util/RenderUtil';

export function renderComment(textRenderer, element, _attrs) {
    const COMMENT_FOLD_SIZE = 14;
    const { width, height, businessObject } = element;
    const foldPointDown = { x: width, y: COMMENT_FOLD_SIZE };
    const foldPointUp = { x: width - COMMENT_FOLD_SIZE, y: 0 };

    const comment = svgCreate('g');

    const mainComment = svgCreate('polygon');
    const points = [
        { x: 0, y: 0 },
        { x: 0, y: height },
        { x: width, y: height },
        foldPointDown,
        foldPointUp,
    ];
    svgAttr(mainComment, {
        points: toSVGPoints(points),
        fill: 'white',
        stroke: 'black',
    });
    svgAppend(comment, mainComment);

    const fold = svgCreate('polygon');
    const foldPoints = [
        foldPointDown,
        { x: width - COMMENT_FOLD_SIZE, y: COMMENT_FOLD_SIZE },
        foldPointUp,
    ];
    svgAttr(fold, {
        points: toSVGPoints(foldPoints),
        fill: 'white',
        stroke: 'black',
    });
    svgAppend(comment, fold);

    const textBox = textRenderer.createTextBox(businessObject.textContent, {
        x: 5,
        y: 5,
        width: width - 5,
        height: height - 5,
    });
    svgAppend(comment, textBox);

    return comment;
}
