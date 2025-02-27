import React, { useEffect, useRef } from "react";
import { View, TouchableWithoutFeedback, Animated, StyleSheet } from "react-native";

const CustomSwitch = ({ isOn, onToggle, color, display }) => {
    const animatedValue = useRef(new Animated.Value(isOn ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isOn ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isOn]); // Runs animation whenever `isOn` prop changes

    const toggleSwitch = () => {
        if (display) return; // Prevent toggle when display is true
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
                        { transform: [{ translateX: circleTranslate }] },
                    ]}
                />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 28,
        borderRadius: 20,
        padding: 2,
        justifyContent: "center",
    },
    circle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "white",
    },
});

export default CustomSwitch;
