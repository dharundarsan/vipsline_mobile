import { Text, StyleSheet, Animated, Dimensions, Platform, View } from 'react-native';
import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';

const { width } = Dimensions.get('window');

const Toast = forwardRef((_, ref) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-100)).current; // Start from above the screen
    const [message, setMessage] = useState(''); // Use state for message

    useImperativeHandle(ref, () => ({
        show: (msg, duration = 2000) => {
            if (Platform.OS === 'android') {
                // Use Android Toast
                ToastAndroid.show(msg, ToastAndroid.SHORT);
            } else {
                setMessage(msg);
                fadeAnim.setValue(0); // Reset fade to 0
                translateY.setValue(-100); // Reset position above the visible area

                // Animate to visible position
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: 0, // Move to visible position
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start();

                // Hide after duration
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateY, {
                            toValue: -100, // Move back up above the visible area
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }, duration);
            }
        },
    }));

    return (
        <Animated.View
            style={[
                styles.toastContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                    position: 'absolute', // Use absolute positioning
                    top: 50, // Fixed position from the top
                    alignSelf: 'center',
                },
            ]}
        >
            <Text style={styles.toastMessage}>
                {message}
            </Text>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    toastContainer: {
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        maxWidth: width * 0.8,
        zIndex: 10000,
        overflow: 'hidden', // Hide overflow
    },
    toastMessage: {
        color: 'white', // Change text color to white for better contrast
        fontSize: 16,
        textAlign: 'center', // Center align the text
    },
});

// Export the Toast component
export default Toast;
