import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';

import { renderLabel } from '../text/label';

export function renderEntity(element, textRenderer, _attrs) {
    const entity = svgCreate('g');
    const rect = createRect(element);
    svgAppend(entity, rect);
    renderLabel(entity, element, textRenderer);
    return entity;
}

const createRect = (element) => {
    const rect = svgCreate('rect');
    svgAttr(rect, {
        x: 0,
        y: 0,
        width: element.width,
        height: element.height,
        rx: 10,
        ry: 10,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    rect.setAttribute('fill', '#FFFFFF');
    return rect;
};
