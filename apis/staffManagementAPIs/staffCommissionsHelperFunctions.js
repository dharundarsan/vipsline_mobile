export function transformData(original, edited) {
    if (original === undefined) {
        return edited;
    }

    // Extract type_ids from edited data
    const editedTypeIds = new Set(edited.map(item => item.type_id));

    // Transform original data: Remove commission_id and add activation: true for edited items
    let transformed = edited.map(({ commission_id, ...rest }) => ({
        ...rest,
        activation: true
    }));

    // Find items in original but missing in edited and mark activation: false
    original.forEach(({ commission_id, ...item }) => {
        if (!editedTypeIds.has(item.type_id)) {
            transformed.push({
                ...item,
                activation: false
            });
        }
    });

    return transformed;
}


export function transformDataForQualifyingItem(original, edited) {
    const normalizeType = (type) => (type === "Custom services" ? "Custom_services" : type);

    console.log(original)



    if (original === undefined) {
        return edited.map((item) => ({
            type: item,
            type_id: null
        }))
    }

    const editedSet = new Set(edited.map(normalizeType));

    // Process original data: Mark existing types as true/false
    let result = original.map(({ type_id, type }) => {
        const normalizedType = normalizeType(type);
        return {
            type: normalizedType,
            type_id,
            activation: editedSet.has(normalizedType) // true if in edited list, otherwise false
        };
    });

    // Add new types from edited that are not in original
    edited.forEach(type => {
        const normalizedType = normalizeType(type);
        if (!original.some(item => normalizeType(item.type) === normalizedType)) {
            result.push({
                type: normalizedType,
                type_id: null,
                activation: true
            });
        }
    });

    return result;
}