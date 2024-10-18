import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Divider } from "react-native-paper";
import { pieChartColorCode } from "../../data/DashboardSelection";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import { PieChart } from "react-native-gifted-charts";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";
import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from "react-native";
const PieChartBox = (props) => {
  const dateData = useSelector((state) => state.dashboardDetails.dateData);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("today");
  const getFontSize = (value) => {
    if (value > 1000000) return 12;
    if (value > 100000) return 14;
    return 16;
  };

  const handleSelection = (item) => {
    setSelectedValue(item.value);
    console.log("Selected range:", item.label);
};
const tableData1 = props.tableData?.map((service) => [
    service.name,
    service.count,
    `₹${service?.revenue?.toLocaleString()}`,
    `${service?.percent?.toFixed(2)}%`,
]);

  return (
    <View style={styles.commonContainer}>
      <View style={[styles.titleContainer, props.toggleDropdown ? { justifyContent: 'space-between' } : null]}>
        <Text
          style={[
            TextTheme.titleMedium,
          ]}
        >
          {props.title}
        </Text>
        {
            props.toggleDateDropdown ?
            <Dropdown
            dropdownPosition="bottom"
            iconColor="#6950F3"
            style={styles.dropdown}
            data={dateData}
            selectedTextStyle={{ color: '#6950F3' }}
            placeholderStyle={{ color: '#6950F3' }}
            labelField="label"
            valueField="value"
            value={selectedValue}
            onChange={handleSelection}
            placeholder="Today"
            />
            : null
        }
      </View>
      <Divider />
      <View style={styles.piechartContainer}>
        <PieChart
          data={props.pieDataArray}
          donut
          radius={150}
          centerLabelComponent={() => (
            <View style={styles.piechart}>
              <Text>Total Value</Text>
              <Text
                style={[
                  styles.totalValue,
                  { fontSize: getFontSize(props.totalCenterValue.toFixed(2)) },
                ]}
              >
                ₹{props.totalCenterValue.toFixed(2)}
              </Text>
            </View>
          )}
          innerRadius={55}
          showText
          textColor="white"
          textSize={14}
          isAnimated
        />
        <View style={[styles.legendContainer,props.labelArray !== undefined && props.labelArray.length >0 ?{marginTop: 20}:null]}>
          {props.labelArray !== undefined
            ? props.labelArray.length >0 ?props.labelArray.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.colorBox,
                      { backgroundColor: pieChartColorCode[index].color },
                    ]}
                  />
                  <Text style={styles.legendText}>{item}</Text>
                </View>
              ))
            :  <Text>"No data found! "</Text> : null}
        </View>
        {
            props.toggleDropdown ?
            <TouchableOpacity onPress={()=>{setDropdownVisible(prev => !prev)}} style={styles.revenueHeader}>
            <Text style={{color:Colors.highlight}}>{props.toggleTitle}</Text>
            <AntDesign name={dropdownVisible ? "up" : "down"} size={18} color="#6950F3" />
        </TouchableOpacity>
        : null
        }
        {dropdownVisible ?

            <View style={styles.tableContainer}>
            <TableWrapper>
                <Table style={styles.tableHeaderContainer}>
                    <Row data={["Top Services","Count","Value","%"]} style={styles.headerData} textStyle={[TextTheme.titleSmall,{textAlign:'center'}]} flexArr={[2,1,1,1]} />
                    <Rows data={tableData1} flexArr={[2,1,1,1]} textStyle={[TextTheme.bodySmall,{textAlign:'center'}]} style={styles.rowData} />
                </Table>
            </TableWrapper>
        </View>
        :null
        }
      </View>
    </View>
  );
};

export default PieChartBox;

const styles = StyleSheet.create({
  commonContainer: {
    borderWidth: 1,
    borderColor: Colors.grey250,
    marginBottom: 20,
    borderRadius: 4,
  },
  titleContainer:{
    flexDirection:'row',
    paddingHorizontal:20,
    paddingVertical:16,
  },
  piechartContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  piechart: {
    justifyContent: "center",
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap:10
},
legendItem: {
    backgroundColor:"#F2F2F7",
    borderWidth:1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderColor:Colors.grey250,
    width: "45%",
    borderRadius:10,
    paddingVertical:10,
    paddingHorizontal:15
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dropdown: {
    width: "35%",
    color:Colors.highlight,
    paddingHorizontal: 10,
  },
  revenueHeader:{
    marginTop: 20,
    gap:10,
    borderRadius:99,
    borderWidth:1,
    paddingVertical:10,
    paddingHorizontal:15,
    borderColor:Colors.grey250,
    flexDirection:'row',
  },
  tableContainer: {
    width: '100%',
    marginTop: 10,
    marginHorizontal:10
  },
  tableHeaderContainer: {
    width: "100%", // Make the table container take up full width
    // marginHorizontal:20,
    padding: 5,
  },
  headerData:{
    borderTopColor:Colors.grey250,
    borderBottomColor:Colors.grey250,
    borderTopWidth:1,
    borderBottomWidth:1,
    paddingVertical:10
  },
  rowData:{
    paddingVertical:10,
    borderBottomWidth:1,
    borderBottomColor:Colors.grey250,
    overflow:'hidden'
  }
});
