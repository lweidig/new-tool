import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';

import { toSVGPoints } from 'diagram-js/lib/util/RenderUtil';

export function renderComment(visuals, element, _attrs) {
    const COMMENT_FOLD_SIZE = 14;
    const width = element.width || 0;
    const height = element.height || 0;
    const foldPointDown = { x: width, y: COMMENT_FOLD_SIZE };
    const foldPointUp = { x: width - COMMENT_FOLD_SIZE, y: 0 };

    // comment
    const comment = svgCreate('polygon');
    const points = [
        { x: 0, y: 0 },
        { x: 0, y: height },
        { x: width, y: height },
        foldPointDown,
        foldPointUp,
    ];
    svgAttr(comment, {
        points: toSVGPoints(points),
        fill: 'white',
        stroke: 'black',
    });
    svgAppend(visuals, comment);

    // fold
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
    svgAppend(visuals, fold);

    // text
    const text = svgCreate('text');
    svgAttr(text, {
        x: 5,
        y: 20,
        'font-size': '12px',
        'font-family': 'Arial, sans-serif',
    });
    text.textContent = element.text || '<COMMENT PLACEHOLDER>';
    svgAppend(visuals, text);

    return comment;
}
