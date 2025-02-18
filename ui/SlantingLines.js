import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from "../constants/Colors";

const SlantingLines = () => {
    return (
        <View style={styles.slantingLinesContainer}>
            {/* Slanting Lines */}
            <View style={[styles.line, { top: 0, left: 0 }]} />
            <View style={[styles.line, { top: 5, left: -5 }]} />
            <View style={[styles.line, { top: 10, left: -10 }]} />
            <View style={[styles.line, { top: 15, left: -15 }]} />
            <View style={[styles.line, { top: 20, left: -20 }]} />
            <View style={[styles.line, { top: 25, left: -25 }]} />
            <View style={[styles.line, { top: 30, left: -30 }]} />
            <View style={[styles.line, { top: 35, left: -35 }]} />
            <View style={[styles.line, { top: 40, left: -40 }]} />
            <View style={[styles.line, { top: 45, left: -45 }]} />
            <View style={[styles.line, { top: 50, left: -50 }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    slantingLinesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',  // Make sure the slanting lines don't block interaction with other elements
    },
    line: {
        position: 'absolute',
        width: '200%', // Full-width for slant effect
        height: 2,
        backgroundColor: Colors.grey300,
        transform: [{ rotate: '45deg' }],
    },
});

export default SlantingLines;
