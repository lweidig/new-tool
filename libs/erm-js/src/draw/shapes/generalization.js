import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';

import { assign } from 'min-dash';

import { isFrameElement } from 'diagram-js/lib/util/Elements';

export function renderGeneralization(
    visuals,
    element,
    frameStyle,
    shapeStyle,
    attrs,
) {
    const rect = svgCreate('rect');

    svgAttr(rect, {
        x: 0,
        y: 0,
        width: element.width || 0,
        height: element.height || 0,
    });

    if (isFrameElement(element)) {
        svgAttr(rect, assign({}, frameStyle, attrs || {}));
    } else {
        svgAttr(rect, assign({}, shapeStyle, attrs || {}));
    }

    svgAppend(visuals, rect);

    return rect;
}
