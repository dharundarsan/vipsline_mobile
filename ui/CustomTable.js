import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Row, Table } from "react-native-table-component";

const CustomTable = ({
                         headers,
                         data,
                         headerStyle,
                         rowStyle,
                         textStyle,
                         removeVerticalBorders = false,
                         removeHorizontalBorders = false,
                         headerBorderColor = "#c8e1ff",
                         rowBorderColor = "#c8e1ff",
                         containerStyle
                     }) => {
    // ✅ Ensure consistent column widths
    const calculateColumnWidths = () => {
        return headers.map((header, index) => {
            const headerWidth =
                typeof header === "string" ? header.length * 10 : 80; // Default for JSX elements
            const maxDataWidth = data.reduce((maxWidth, row) => {
                const cellContent = row[index] || "";
                return Math.max(maxWidth, (typeof cellContent === "string" ? cellContent.length : 8) * 10);
            }, 0);
            return Math.max(headerWidth, maxDataWidth);
        });
    };

    const columnWidths = calculateColumnWidths();

    return (
        <View style={[{ flex: 1 }, containerStyle]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Table
                    borderStyle={{
                        borderWidth: removeHorizontalBorders ? 0 : 1,
                        borderColor: headerBorderColor,
                    }}
                >
                    {/* ✅ Fix: Ensure JSX is properly wrapped */}
                    <Row
                        data={headers.map((header, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.cell,
                                    { width: columnWidths[index] },
                                    removeVerticalBorders && { borderRightWidth: 0 },
                                ]}
                            >
                                {typeof header === "string" ? (
                                    <Text style={[styles.text, textStyle]}>{header}</Text>
                                ) : (
                                    <View style={{ alignItems: "center" }}>{header}</View> // Wrap JSX
                                )}
                            </View>
                        ))}
                        style={[styles.header, headerStyle, { borderColor: headerBorderColor }]}
                        widthArr={columnWidths}
                    />

                    {/* ✅ Fix: Ensure data is properly wrapped */}
                    {data.map((rowData, rowIndex) => (
                        <Row
                            key={rowIndex}
                            data={rowData.map((cell, cellIndex) => (
                                <View
                                    style={[
                                        styles.cell,
                                        { width: columnWidths[cellIndex] },
                                        removeVerticalBorders && { borderRightWidth: 0 },
                                    ]}
                                    key={cellIndex}
                                >
                                    {typeof cell === "string" || typeof cell === "number" ? (
                                        <Text style={[styles.text, textStyle]}>{cell}</Text>
                                    ) : (
                                        <View style={{ alignItems: "center" }}>{cell}</View> // Wrap JSX
                                    )}
                                </View>
                            ))}
                            style={[
                                styles.row,
                                rowStyle,
                                { borderColor: rowBorderColor },
                                removeHorizontalBorders && { borderBottomWidth: 0 },
                            ]}
                            widthArr={columnWidths}
                        />
                    ))}
                </Table>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#f1f8ff",
        borderBottomWidth: 1,
    },
    row: {
        borderBottomWidth: 1,
    },
    text: {
        margin: 6,
        textAlign: "center",
    },
    cell: {
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        borderRightWidth: 1,
    },
});

export default CustomTable;
