import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from "../constants/Colors";
import colors from "../constants/Colors";
import {useDispatch} from "react-redux";
import {clearAppliedFilters, loadClientFiltersFromDb, updateAppliedFilters} from "../store/clientFilterSlice";
import textTheme from "../constants/TextTheme";

const CustomTagFilter = ({ options, onSelectionChange, filter }) => {
    const [selectedOptions, setSelectedOptions] = useState(options);

    useEffect(() => {
        setSelectedOptions(options.filter(str => /^[A-Za-z\s-]+$/.test(str)));
    }, [options]);

    // Remove a single option when the "x" is clicked
    const removeOption = (option) => {
        const updatedOptions = selectedOptions.filter(opt => opt !== option);
        setSelectedOptions(updatedOptions);
        onSelectionChange(updatedOptions); // Send updated array to the parent
    };
    const dispatch = useDispatch();

    // Clear all options
    const clearAll = () => {
        setSelectedOptions([]);
        onSelectionChange([]); // Send empty array to the parent
        dispatch(loadClientFiltersFromDb(10, filter))
        dispatch(clearAppliedFilters());

    };

    useEffect(() => {
        setSelectedOptions([]);
        onSelectionChange([]); // Send empty array to the parent
        dispatch(loadClientFiltersFromDb(10, filter));
        dispatch(clearAppliedFilters());
    }, [filter]);


    return (
        (selectedOptions.length > 0) && <View style={styles.container}>
            <View style={styles.tagsContainer}>
                {selectedOptions.map((option, index) => (
                    /^[A-Za-z\s-]+$/.test(option) ?
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText} key={index}>{option}</Text>
                        <TouchableOpacity onPress={() => {
                            removeOption(option);
                            dispatch(loadClientFiltersFromDb(10, filter))
                        }}>
                            <Text style={[styles.closeButton, textTheme.titleSmall]} >x</Text>
                        </TouchableOpacity>
                    </View> : <></>
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
