export const simple = {
    $type: 'erm:Root',
    id: 'root1',
    cells: [
        {
            $type: 'erm:Entity',
            id: 'entity1',
            name: 'Customer',
            attributes: [],
        },
        {
            $type: 'erm:Entity',
            id: 'entity2',
            name: 'Product',
            attributes: [],
        },
        {
            $type: 'erm:Relationship',
            id: 'relationship1',
            name: 'buys',
        },
        {
            $type: 'erm:Association',
            id: 'association1',
            sourceRef: 'entity1',
            targetRef: 'relationship1',
        },
        {
            $type: 'erm:Association',
            id: 'association2',
            sourceRef: 'relationship1',
            targetRef: 'entity2',
        },
    ],
};
