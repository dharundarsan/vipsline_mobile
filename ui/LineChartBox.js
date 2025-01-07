import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import TextTheme from "../constants/TextTheme";
import Colors from "../constants/Colors";
import { Dropdown } from "react-native-element-dropdown";
import { LineChart } from "react-native-gifted-charts";
import { Divider } from "react-native-paper";
import PopoverIconText from "./PopoverIconText";
import PropTypes from 'prop-types';

const { width: screenWidth } = Dimensions.get('window');
const LineChartBox = (props) => {
    const [selectedValue, setSelectedValue] = useState("currentmonth");
    const isLoading = useRef(false);
    async function handleSelection(item) {
        setSelectedValue(item.value)
        isLoading.current = true;
        await props.handleSelected(item.value)
        isLoading.current = false;
    }
    const dropdownWidth = screenWidth * 0.4;
    return (
        <View style={styles.commonContainer}>
            <View
                style={[
                    styles.titleContainer,
                    props.toggleDateDropdown ? { justifyContent: "space-between" } : null,
                ]}
            >
                <PopoverIconText title={props.title} titleStyle={[TextTheme.titleMedium, props.toggleDateDropdown ? { maxWidth: "100%" } : null]}
                    popoverText={props.popoverText} popoverOffset={Platform.OS === "ios" ? -15 : -32} popoverArrowShift={props.popoverArrowShift}
                    containerStyle={styles.containerStyle}
                />
                {/* <Text
                style={[
                    TextTheme.titleMedium,
                    props.toggleDateDropdown ? { maxWidth: "60%" } : null,
                ]}
                >
                {props.title}
                </Text> */}
                {props.toggleDateDropdown ? (
                    <Dropdown
                        dropdownPosition="auto"
                        iconColor="#6950F3"
                        style={[styles.dropdown, { width: dropdownWidth }]}
                        data={props.dateArray}
                        selectedTextStyle={{ color: "#6950F3" }}
                        placeholderStyle={{ color: "#6950F3" }}
                        labelField="label"
                        valueField="value"
                        value={selectedValue}
                        onChange={handleSelection}
                        placeholder="Current month"
                        disable={isLoading.current}
                        inverted={false}
                    />
                ) : null}
            </View>
            <Divider />
            <View style={styles.lineChartContainer}>
                <LineChart
                    data={props.lineChartData}
                    yAxisLabelTexts={props.yAxisLabelTexts}
                    color="#4E64D8"
                    dataPointsColor1="#EB8B34"
                    xAxisColor="#D3D3D3"
                    xAxisLabelTexts={props.xLabelArrayData}
                    xAxisLabelTextStyle={{ color: "#6E6E6E", fontSize: 6 }}
                    spacing={80}
                    yAxisThickness={0}
                    // adjustToWidth
                    yAxisLabelWidth={props.page === "SalesOverTime" ? 100 : 50}
                    // yAxisLabelWidth={50}
                    maxValue={props.max}
                    style={{ width: "100%" }}
                    noOfSections={props.sections}
                    focusEnabled
                    showTextOnFocus
                    delayBeforeUnFocus={3000}
                    focusedDataPointHeight={20}
                />
            </View>
        </View>
    );
};

LineChartBox.propTypes = {
    title: PropTypes.string,
    toggleDateDropdown: PropTypes.bool,
    dateArray: PropTypes.arrayOf(PropTypes.object),
    xLabelArrayData: PropTypes.arrayOf(PropTypes.string),
    lineChartData: PropTypes.arrayOf(PropTypes.object),
    max: PropTypes.number,
    sections: PropTypes.number,
    page: PropTypes.string,
    popoverText: PropTypes.string,
    popoverArrowShift: PropTypes.number,
    handleSelected:PropTypes.func.isRequired
}

export default React.memo(LineChartBox);

const styles = StyleSheet.create({
    commonContainer: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginBottom: 20,
        borderRadius: 4,
        width: "100%",
    },
    titleContainer: {
        flexDirection: "row",
        // paddingHorizontal: 20,
        paddingLeft: 20,
        paddingVertical: 16,
    },
    dropdown: {
        // width: "40%",
        color: Colors.highlight,
        paddingHorizontal: 20,
    },
    lineChartContainer: {
        overflow: 'hidden',
        marginVertical: 20,
    },
    containerStyle: {
        width: '55%'
    }
});
