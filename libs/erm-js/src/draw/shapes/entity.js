import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';

import { renderLabel } from '../text/label';

export function renderEntity(visuals, element, textRenderer, _attrs) {
    const visual = svgCreate('g');
    const rect = createRect(element);
    svgAppend(visual, rect);
    renderLabel(visual, element, textRenderer);
    svgAppend(visuals, visual);
    return visual;
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
