// CustomDropdown.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import CustomCheckbox from './CustomCheckbox';
import Divider from "./Divider";
import Colors from "../constants/Colors";
import {MaterialIcons} from "@expo/vector-icons";

const CustomDropdown = ({ options, borderColor, highlightColor, container, checkBoxSize }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleOption = (option) => {
        if (selectedOptions.includes(option)) {
            // Uncheck the option
            setSelectedOptions(selectedOptions.filter(opt => opt !== option));
        } else {
            // Check the option
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    return (
        <View style={[styles.container, container]}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
                <Text>Choose filters</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </TouchableOpacity>

            {dropdownVisible && (
                <View style={styles.dropdownContainer}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => toggleOption(item)}
                            >
                                <CustomCheckbox
                                    isChecked={selectedOptions.includes(item)}
                                    onPress={() => toggleOption(item)}
                                    borderColor={borderColor}
                                    highlightColor={highlightColor}
                                    size={checkBoxSize}
                                />
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <Divider />}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    dropdownButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    dropdownContainer: {
        marginTop: 10,
        // padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'transparent', // or you can change to a color if needed
    },
    optionButtonChecked: {
        backgroundColor: '#E0E0E0', // Optional: Color for checked options
    },
    optionText: {
        marginLeft: 10,
    },
});

export default CustomDropdown;
