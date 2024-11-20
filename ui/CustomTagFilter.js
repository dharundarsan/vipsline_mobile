import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from "../constants/Colors";
import colors from "../constants/Colors";

const CustomTagFilter = ({ options, onSelectionChange }) => {
    const [selectedOptions, setSelectedOptions] = useState(options);

    useEffect(() => {
        setSelectedOptions(options);
    }, [options]);

    // Remove a single option when the "x" is clicked
    const removeOption = (option) => {
        const updatedOptions = selectedOptions.filter(opt => opt !== option);
        setSelectedOptions(updatedOptions);
        onSelectionChange(updatedOptions); // Send updated array to the parent
    };

    // Clear all options
    const clearAll = () => {
        setSelectedOptions([]);
        onSelectionChange([]); // Send empty array to the parent
    };

    return (
        selectedOptions.length > 0 && <View style={styles.container}>
            <View style={styles.tagsContainer}>
                {selectedOptions.map((option, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{option}</Text>
                        <TouchableOpacity onPress={() => removeOption(option)}>
                            <Text style={styles.closeButton}>x</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {selectedOptions.length > 0 && (<TouchableOpacity onPress={clearAll} style={styles.clearAllButton}>
                    <Text style={styles.clearAll}>Clear All</Text>
                </TouchableOpacity>)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingVertical: 16,
        columnGap: 8,
        rowGap: 12
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: Colors.highlight,
        borderRadius: 6,
    },
    tagText: {
        color: Colors.highlight,
        marginRight: 5,
    },
    closeButton: {
        color: Colors.highlight,
        fontWeight: 'bold',
    },
    clearAll: {
        color: Colors.highlight,
    },
    clearAllButton: {
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    }
});

export default CustomTagFilter;
