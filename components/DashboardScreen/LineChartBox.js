import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TextTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import { Dropdown } from "react-native-element-dropdown";
import { LineChart } from "react-native-gifted-charts";
import { Divider } from "react-native-paper";
import { useDispatch } from "react-redux";
import { loadDailyAppointmentAnalyticsForBusiness } from "../../store/dashboardSlice";

const { width: screenWidth } = Dimensions.get('window');
const LineChartBox = (props) => {
    const dispatch = useDispatch();
    const [selectedValue, setSelectedValue] = useState("currentmonth");
    const [isLoading,setIsLoading] = useState(false);
    async function handleSelection(item) {
        setSelectedValue(item.value)
        
        if(props.page === "SalesOverTime"){
            setIsLoading(true);
            dispatch(loadDailyAppointmentAnalyticsForBusiness(false,item.value))
        }
        else if(props.page === "AppointmentOverTime"){
            setIsLoading(true);
            dispatch(loadDailyAppointmentAnalyticsForBusiness(true,item.value))
        }
        setIsLoading(false);
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
                <Text
                style={[
                    TextTheme.titleMedium,
                    props.toggleDateDropdown ? { maxWidth: "60%" } : null,
                ]}
                >
                {props.title}
                </Text>
                {props.toggleDateDropdown ? (
                <Dropdown
                    dropdownPosition="auto"
                    iconColor="#6950F3"
                    style={[styles.dropdown,{width:dropdownWidth}]}
                    data={props.dateArray}
                    selectedTextStyle={{ color: "#6950F3" }}
                    placeholderStyle={{ color: "#6950F3" }}
                    labelField="label"
                    valueField="value"
                    value={selectedValue}
                    onChange={handleSelection}
                    placeholder="Current month"
                    disable={isLoading}
                    inverted={false}
                    />
                ) : null}
            </View>
            <Divider/>
            <View style={styles.lineChartContainer}>
                <LineChart
                    data={props.lineChartData}
                    yAxisLabelTexts={props.yAxisLabelTexts}
                    color="#4E64D8"
                    dataPointsColor1="#EB8B34"
                    xAxisColor="#D3D3D3"
                    xAxisLabelTexts={props.xLabelArrayData}
                    xAxisLabelTextStyle={{ color: "#6E6E6E", fontSize:  6 }}
                    spacing={80}
                    yAxisThickness={0}
                    // adjustToWidth
                    yAxisLabelWidth={props.page === "SalesOverTime" ? 100 : 50}
                    maxValue={props.max}
                    style={{width:"100%"}}
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

export default LineChartBox;

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
    paddingLeft:20,
    paddingVertical: 16,
  },
  dropdown: {
    // width: "40%",
    color: Colors.highlight,
    paddingHorizontal: 20,
  },
  lineChartContainer:{
    overflow:'hidden',
    marginVertical:20,
  }
});
