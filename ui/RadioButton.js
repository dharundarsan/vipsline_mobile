import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Pressable } from 'react-native';
import Colors from "../constants/Colors";

// Radio button styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row-reverse',  // Place radio button on the right
        alignItems: 'center',          // Vertically align items
        justifyContent:"center",
        padding: 10,
        gap:85,
        backgroundColor:Colors.white
    },
    pressed: {
        backgroundColor: '#e0e0e0',  // Grey background when pressed
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,  // Margin between radio button and label
    },
    selectedCircle: {
        backgroundColor: Colors.highlight,
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 16,
        flexShrink: 1,   // Ensure text doesn't overflow and keeps circles aligned
        minWidth: 40,    // Adjust this value to ensure consistent spacing
    },
});

const RadioButton = ({ options, value, onPress }) => {
    const handlePress = (newValue) => {
        if (onPress) {
            onPress(newValue); // Call onPress regardless of selection change
        }
    };

    return (
        <View style={{ width: '100%'}}>
            {options.map((option) => (
                <Pressable
                    key={option.value}
                    style={({ pressed }) => [
                        styles.container,
                        pressed && styles.pressed, // Apply pressed style when button is pressed
                    ]}
                    onPress={() => handlePress(option.value)}
                >
                    <View
                        style={[
                            styles.circle,
                            value === option.value && styles.selectedCircle,
                        ]}
                    >
                        {value === option.value && <View style={styles.innerCircle} />}
                    </View>
                    <Text style={styles.text}>{option.label}</Text>
                </Pressable>
            ))}
        </View>
    );
};

export default RadioButton;
