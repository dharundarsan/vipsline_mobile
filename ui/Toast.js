import { View, Text, StyleSheet, Animated, Dimensions, SafeAreaView, Platform, ToastAndroid } from 'react-native';
import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';

const { width } = Dimensions.get('window');

const Toast = forwardRef((_, ref) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(100)).current; // Start from below the screen
    const [message, setMessage] = useState(''); // Use state for message
    const [toastHeight, setToastHeight] = useState(0); // State to hold dynamic height

    useImperativeHandle(ref, () => ({
        show: (msg, duration = 2000) => {
            if (Platform.OS === 'android') {
                ToastAndroid.show(msg, ToastAndroid.SHORT);
            } else {
                setMessage(msg);
                fadeAnim.setValue(0); // Reset fade to 0
                translateY.setValue(100); // Reset position below the visible area

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
                            toValue: 100, // Move back down below the visible area
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }, duration);
            }
        },
    }));

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setToastHeight(height); // Update the toast height
                }}
                style={[
                    styles.toastContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY }],
                        height: toastHeight, // Dynamic height based on content
                    },
                ]}
            >
                <Text style={styles.toastMessage}>
                    {message}
                </Text>
            </Animated.View>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'flex-end', // Align to the bottom of the screen
        paddingBottom: 50, // Add padding for the toast
    },
    toastContainer: {
        alignSelf: 'center',
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
