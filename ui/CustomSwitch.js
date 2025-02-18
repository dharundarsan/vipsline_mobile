import React, { useState } from "react";
import { View, TouchableWithoutFeedback, Animated, StyleSheet } from "react-native";

const CustomSwitch = ({ isOn, onToggle, color, display }) => {
    const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

    const toggleSwitch = () => {
        if (display) return; // Prevent toggle when display is true

        Animated.timing(animatedValue, {
            toValue: isOn ? 0 : 1,
            duration: 200,
            useNativeDriver: false,
        }).start();

        onToggle(!isOn);
    };

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#E0E0E0", color], // Adjust these colors as needed
    });

    const circleTranslate = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 21], // Adjust based on the size
    });

    return (
        <TouchableWithoutFeedback onPress={toggleSwitch} disabled={display}>
            <Animated.View style={[styles.container, { backgroundColor }]}>
                <Animated.View
                    style={[
                        styles.circle,
                        {
                            transform: [{ translateX: circleTranslate }],
                        },
                    ]}
                />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 50, // Adjust width to match the design
        height: 28, // Adjust height to match the design
        borderRadius: 20,
        padding: 2,
        justifyContent: "center",
    },
    circle: {
        width: 22, // Adjust size to match the design
        height: 22,
        borderRadius: 11,
        backgroundColor: "white",
    },
});

export default CustomSwitch;
