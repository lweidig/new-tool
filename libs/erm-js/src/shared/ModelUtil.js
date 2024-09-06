/**
 * Checks if the given element is of the provided type.
 */
export function is(element, type) {
    var bo = getBusinessObject(element);

    return bo && typeof bo.$instanceOf === 'function' && bo.$instanceOf(type);
}

/*
 * Return the business object for a given diagram element.
 */
export function getBusinessObject(element) {
    return (element && element.businessObject) || element;
}
