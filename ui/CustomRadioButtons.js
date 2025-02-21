import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import textTheme from "../constants/TextTheme";
import Colors from "../constants/Colors";

export const CustomRadioButton = ({
                                      options,
                                      label,
                                      labelStyle,
                                      radioDescriptionStyle,
                                      radioLabelStyle,
                                      buttonInnerContainerStyle,
                                      buttonStyle,
                                      uncheckedColor,
                                      checkedColor,
                                      selectedKey,
                                      setSelectedKey,
                                      defaultValue
}) => {

    useEffect(() => {
        if (!selectedKey && options.length > 0) {
            // Find if defaultValue matches any key in the options
            const matchingOption = options.find(item => Object.keys(item)[0] === defaultValue);

            if (matchingOption) {
                setSelectedKey(defaultValue);
            } else {
                // If no match, select the first option
                const firstKey = Object.keys(options[0])[0];
                setSelectedKey(firstKey);
            }
        }
    }, [options, defaultValue]);





    return (
        <View style={styles.container}>
            <Text style={[textTheme.bodyMedium, {marginLeft: 6}, labelStyle]}>{label && label}</Text>
            {options.map((item) => {
                const key = Object.keys(item)[0];
                const value = item[key]; // Get the actual value for the key

                return (
                    <TouchableOpacity key={key} style={[styles.radioButtonContainer, buttonStyle]} onPress={() => setSelectedKey(key)}>
                        <View style={[styles.radioButtonInnerContainer, buttonInnerContainerStyle]}>
                            <RadioButton
                                value={key}
                                status={selectedKey === key ? "checked" : "unchecked"}
                                onPress={() => setSelectedKey(key)}
                                uncheckedColor={uncheckedColor}
                                color={checkedColor}


                            />
                            <Text style={[styles.radioLabel, radioLabelStyle]}>{key}</Text>
                        </View>
                        <Text style={[textTheme.bodyMedium, styles.description, radioDescriptionStyle]}>{value}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
    },
    radioButtonContainer: {
    },
    radioLabel: {
        textAlignVertical: "top",
        marginLeft: 8

    },
    description: {
        marginLeft: 36 + 8,
        color: Colors.grey500,
    },
    radioButtonInnerContainer: {
        flexDirection: "row",
        alignItems: "center",
    }
});
