import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const ThreeDotActionIndicator = (props) => {
    const [scale1] = useState(new Animated.Value(1));
    const [scale2] = useState(new Animated.Value(1));
    const [scale3] = useState(new Animated.Value(1));

    useEffect(() => {
        const animateDots = () => {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(scale1, {
                        toValue: 1.5,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale2, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale3, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(scale1, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale2, {
                        toValue: 1.5,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale3, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(scale1, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale2, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale3, {
                        toValue: 1.5,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => {
                animateDots(); // Repeat animation
            });
        };

        animateDots();
    }, [scale1, scale2, scale3]);

    return (
        <View style={[styles.container, props.container]}>
            <Animated.View style={[styles.dot, { transform: [{ scale: scale1 }] }, props.dot]} />
            <Animated.View style={[styles.dot, { transform: [{ scale: scale2 }] }, props.dot]} />
            <Animated.View style={[styles.dot, { transform: [{ scale: scale3 }] }, props.dot]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        marginHorizontal: 5,
    },
});

export default ThreeDotActionIndicator;
