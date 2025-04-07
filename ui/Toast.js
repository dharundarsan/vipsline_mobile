import { Text, StyleSheet, Animated, Dimensions, View } from 'react-native';
import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import Colors from "../constants/Colors";

const { width } = Dimensions.get('window');

const Toast = forwardRef((_, ref) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-100)).current;
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const hideTimeout = useRef(null);

    useImperativeHandle(ref, () => ({
        show: (msg, error = false, duration = 2000) => {
            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current);
                hideTimeout.current = null;
            }

            setMessage(msg);
            setIsError(error);

            // Stop ongoing animations
            fadeAnim.stopAnimation();
            translateY.stopAnimation();

            // Reset initial state
            fadeAnim.setValue(0);
            translateY.setValue(-100);

            // Animate in
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Schedule hide
            hideTimeout.current = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: -100,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    hideTimeout.current = null;
                });
            }, duration);
        },
    }));

    return (
        <Animated.View
            style={[
                styles.toastContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                    position: 'absolute',
                    top: 50,
                    alignSelf: 'center',
                    backgroundColor: isError ? Colors.error : 'black',
                },
            ]}
        >
            <Text style={styles.toastMessage}>{message}</Text>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    toastContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        maxWidth: width * 0.8,
        zIndex: 10000,
        overflow: 'hidden',
    },
    toastMessage: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Toast;
