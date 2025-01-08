// import React from 'react';
// import { View, StyleSheet } from 'react-native';
//
// // Default size for the nested views
// const DEFAULT_SIZE = { width: '100%', height: 50 };
// const DEFAULT_MARGIN_TOP = 16; // Default marginTop for rows
//
// // Customizable loader component that takes in rows and sizes
// const ContentLoader = ({ row, size }) => {
//     return (
//         <View style={styles.loaderContainer}>
//             {row.map((rowCount, rowIndex) => {
//                 // Get the marginTop for the row, if not provided, use default
//                 const rowMarginTop = size[rowIndex]?.[0]?.marginTop !== undefined
//                     ? size[rowIndex][0].marginTop
//                     : DEFAULT_MARGIN_TOP;
//
//                 return (
//                     <View key={rowIndex} style={[styles.row, { marginTop: rowMarginTop }]}>
//                         {Array.from({ length: rowCount }).map((_, colIndex) => {
//                             const currentSize = size[rowIndex]?.[colIndex] || DEFAULT_SIZE;
//
//                             return (
//                                 <View
//                                     key={colIndex}
//                                     style={[
//                                         styles.loaderItem,
//                                         {
//                                             width: currentSize.width || DEFAULT_SIZE.width, // Handle percentage or fixed width
//                                             height: currentSize.height || DEFAULT_SIZE.height, // Handle given or default height
//                                         },
//                                     ]}
//                                 />
//                             );
//                         })}
//                     </View>
//                 );
//             })}
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     loaderContainer: {
//         flex: 1,
//         width: '95%', // This ensures the ContentLoader fills the parent width
//         alignItems:"center",
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'flex-start', // Align items to start to respect percentage widths
//         alignItems: 'center',
//         marginBottom: 4, // Space between rows
//         flexWrap: 'wrap', // Wrap content to next line if needed
//     },
//     loaderItem: {
//         backgroundColor: '#E0E0E0', // Grey loading background
//         opacity: 0.5, // Optional: reduce opacity for visibility of content
//         marginHorizontal: 4, // Optional: space between columns
//     },
// });
//
// export default ContentLoader;


import React, { useEffect, useRef } from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from "../constants/Colors";

// Default size for the nested views
const DEFAULT_SIZE = { width: '100%', height: 50 };
const DEFAULT_MARGIN_TOP = 16; // Default marginTop for rows

const ContentLoader = ({ row, size }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start a looping animation
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        ).start();
    }, [animatedValue]);

    const screenWidth = Dimensions.get('window').width;

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-screenWidth, screenWidth],
    });

    return (
        <View style={styles.loaderContainer}>
            {row.map((rowCount, rowIndex) => {
                const rowMarginTop =
                    size[rowIndex]?.[0]?.marginTop !== undefined
                        ? size[rowIndex][0].marginTop
                        : DEFAULT_MARGIN_TOP;

                return (
                    <View key={rowIndex} style={[styles.row, { marginTop: rowMarginTop }]}>
                        {Array.from({ length: rowCount }).map((_, colIndex) => {
                            const currentSize = size[rowIndex]?.[colIndex] || DEFAULT_SIZE;

                            return (
                                <View
                                    key={colIndex}
                                    style={[
                                        styles.loaderItem,
                                        {
                                            width: currentSize.width || DEFAULT_SIZE.width,
                                            height: currentSize.height || DEFAULT_SIZE.height,
                                        },
                                    ]}
                                >
                                    {/* Add shiny effect */}
                                    <Animated.View
                                        style={[
                                            StyleSheet.absoluteFill,
                                            { transform: [{ translateX }] },

                                        ]}
                                    >
                                        <LinearGradient
                                            colors={['transparent', 'rgba(255,255,255,1.2)', 'transparent']}
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            style={StyleSheet.absoluteFill}
                                        />
                                    </Animated.View>
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        width: '95%',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    loaderItem: {
        backgroundColor: '#d6dbe0',
        opacity: 0.5,
        marginHorizontal: 4,
        overflow: 'hidden', // Ensures the shiny effect is clipped
        borderRadius: 4
    },
});

export default ContentLoader;

