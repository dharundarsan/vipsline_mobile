// CustomCheckbox.js
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Make sure to install this package

const CustomCheckbox = ({ isChecked, onPress, borderColor, highlightColor, size }) => {

    const styles = StyleSheet.create({
        checkboxContainer: {
            width: size,
            height: size,
        },
        checkbox: {
            width: '100%',
            height: '100%',
            borderWidth: 2,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });


    return (
        <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
            <View
                style={[
                    styles.checkbox,
                    { borderColor: borderColor, backgroundColor: isChecked ? highlightColor : 'transparent' },
                ]}
            >
                {isChecked && <MaterialCommunityIcons name="check" size={size - 5} color="white" />}
            </View>
        </TouchableOpacity>
    );
};


export default CustomCheckbox;
