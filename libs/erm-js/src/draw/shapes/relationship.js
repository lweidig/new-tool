import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';

import { renderLabel } from '../text/label';

export function renderRelationship(visuals, element, textRenderer, _attrs) {
    const visual = svgCreate('g');
    const diamond = createDiamond(element);
    svgAppend(visual, diamond);
    renderLabel(visual, element, textRenderer);
    svgAppend(visuals, visual);
    return visual;
}

const createDiamond = (element) => {
    const diamond = svgCreate('path');
    svgAttr(diamond, {
        d: getDiamondPath(element),
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    diamond.setAttribute('fill', '#FFFFFF');
    return diamond;
};

const getDiamondPath = (element) => {
    const { width, height } = element;
    const middleX = width / 2;
    const middleY = height / 2;
    return `M${middleX},0 L${width},${middleY} L${middleX},${height} L0,${middleY} Z`;
};
