import React from 'react';
import { View, StyleSheet } from 'react-native';

// Default size for the nested views
const DEFAULT_SIZE = { width: '100%', height: 50 };
const DEFAULT_MARGIN_TOP = 16; // Default marginTop for rows

// Customizable loader component that takes in rows and sizes
const ContentLoader = ({ row, size }) => {
    return (
        <View style={styles.loaderContainer}>
            {row.map((rowCount, rowIndex) => {
                // Get the marginTop for the row, if not provided, use default
                const rowMarginTop = size[rowIndex]?.[0]?.marginTop !== undefined
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
                                            width: currentSize.width || DEFAULT_SIZE.width, // Handle percentage or fixed width
                                            height: currentSize.height || DEFAULT_SIZE.height, // Handle given or default height
                                        },
                                    ]}
                                />
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
        width: '95%', // This ensures the ContentLoader fills the parent width
        alignItems:"center",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Align items to start to respect percentage widths
        alignItems: 'center',
        marginBottom: 4, // Space between rows
        flexWrap: 'wrap', // Wrap content to next line if needed
    },
    loaderItem: {
        backgroundColor: '#E0E0E0', // Grey loading background
        opacity: 0.5, // Optional: reduce opacity for visibility of content
        marginHorizontal: 4, // Optional: space between columns
    },
});

export default ContentLoader;
