import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Divider } from "react-native-paper";
import { pieChartColorCode } from "../../data/DashboardSelection";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import { PieChart } from "react-native-gifted-charts";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import {
  loadRevenueByGender,
  loadRevenueByPrepaid,
  loadRevenueCountByGender,
  loadTopRevenueProducts,
  loadTopRevenueServices,
} from "../../store/dashboardSlice";
import {
  formatDateToWeekDayDDMMMYYYY,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDD,
  getFirstDateOfCurrentMonth,
  getFirstDateOfCurrentMonthYYYYMMDD,
  getLastDateOfCurrentMonth,
  getLastDateOfCurrentMonthYYYYMMMDD,
} from "../../util/Helpers";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PieChartBox = (props) => {
  const dispatch = useDispatch();
  const dateData = useSelector((state) => state.dashboardDetails.dateData);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const getFirstMonth = getFirstDateOfCurrentMonthYYYYMMDD();
  const getLastMonth = getLastDateOfCurrentMonthYYYYMMMDD();

  const [selectedValue, setSelectedValue] = useState(
    props.dateArray === undefined ? "today" : ""
  );

  const todayDate = formatDateYYYYMMDD(0);
  const newDate = new Date();
  const formattedDate = newDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const [fromDateVisibility, setFromDateVisibility] = useState(false);
  const [toDateVisibility, setToDateVisibility] = useState(false);
  const [selectedFromCustomDate, setSelectedFromCustomDate] = useState("0");
  const [selectedToCustomDate, setSelectedToCustomDate] = useState("0");
  const [customFromDateData, setCustomFromDateData] = useState(newDate);
  const [customTopServicesFromSelected, setCustomTopServicesFromSelected] = useState(formattedDate)
  const [customTopServicesToSelected, setCustomTopServicesToSelected] = useState(formattedDate);
  const [customTopProductFromSelected, setCustomTopProductFromSelected] = useState(formattedDate)
  const [customTopProductToSelected, setCustomTopProductToSelected] = useState(formattedDate);
  const [customClientFromCountSelected, setCustomClientFromCountSelected] = useState(formattedDate);
  const [customClientFromGenderSelected, setCustomClientFromGenderSelected] = useState(formattedDate);
  const [customClientFromRedemption, setCustomClientFromRedemption] = useState(formattedDate);
  const [customClientToCountSelected, setCustomClientToCountSelected] = useState(formattedDate);
  const [customClientToGenderSelected, setCustomClientToGenderSelected] = useState(formattedDate);
  const [customClientToRedemption, setCustomClientToRedemption] = useState(formattedDate);
  const [customTopServicesFromDateData, setCustomTopServicesFromDateData] = useState(newDate)
  const [customTopProductsFromDateData, setCustomTopProductsFromDateData] = useState(newDate);
  const [customFromCountDateData, setCustomFromCountDateData] = useState(newDate);
  const [customFromGenderDateData, setCustomFromGenderDateData] = useState(newDate);
  const [customFromRedemptionDateData, setCustomFromRedemptionDateData] = useState(newDate);
  const [customTopServicesToDateData, setCustomTopServicesToDateData] = useState(newDate)
  const [customTopProductsToDateData, setCustomTopProductsToDateData] = useState(newDate);
  const [customToCountDateData, setCustomToCountDateData] = useState(newDate);
  const [customToGenderDateData, setCustomToGenderDateData] = useState(newDate);
  const [customToRedemptionDateData, setCustomToRedemptionDateData] = useState(newDate);
  const [customTopServicesFromPassData, setCustomTopServicesFromPassData] = useState(todayDate);
  const [customTopProductsFromPassData, setCustomTopProductsFromPassData] = useState(todayDate);
  const [customFromClientGenderPassData, setCustomFromClientGenderPassData] = useState(todayDate);
  const [customFromClientCountPassData, setCustomFromClientCountPassData] = useState(todayDate);
  const [customFromClientRedemptionPassData, setCustomFromClientRedemptionPassData] = useState(todayDate);
  const [customTopServicesToPassData, setCustomTopServicesToPassData] = useState(todayDate)
  const [customTopProductsToPassData, setCustomTopProductsToPassData] = useState(todayDate)
  const [customToClientGenderPassData, setCustomToClientGenderPassData] = useState(todayDate);
  const [customToClientRedemptionPassData,setCustomToClientRedemptionPassData] = useState(todayDate);
  const [customToClientCountPassData, setCustomToClientCountPassData] = useState(todayDate);
  const [page, setPage] = useState(props.pieDataArray[0]?.page);
  const [isCustomRange, setIsCustomRange] = useState(false);

  const getFontSize = (value) => {
    if (value > 1000000) return 12;
    if (value > 100000) return 14;
    return 16;
  };

  const handleSelection = async (item) => {
    setSelectedValue(item.value);
    const currentDate = formatDateYYYYMMDD(0);
    if (props.pieDataArray[0]?.page === "salesPercent") {
      if (item.day !== undefined) {
        setIsCustomRange(false);
        dispatch(loadTopRevenueServices(formatDateYYYYMMDD(item.day),formatDateYYYYMMDD(0)));
      } else if(item.day !== undefined || item.label === "This month") {
        setIsCustomRange(false);
        dispatch(loadTopRevenueServices(getFirstMonth, getLastMonth));
      }
      else{
        setIsCustomRange(true);
      }
    } 
    else if (props.pieDataArray[0]?.page === "salesProduct") {
      if (item.day !== undefined) {
        if (item.day === -29) {
          setIsCustomRange(false)
          dispatch(
            loadTopRevenueProducts(formatDateYYYYMMDD(item.day), currentDate)
          );
        } else {
          setIsCustomRange(false)
          dispatch(
            loadTopRevenueProducts(
              formatDateYYYYMMDD(item.day),
              formatDateYYYYMMDD(item.day)
            )
          );
        }
      } else if (item.day !== undefined || item.label === "This month") {
        setIsCustomRange(false)
        dispatch(loadTopRevenueProducts(getFirstMonth, getLastMonth));
      }
      else{
        const customDay1 = formatDateYYYYMMDD(0);
        const customDay2 = formatDateYYYYMMDD(0);
        setSelectedFromCustomDate(customDay1);
        setSelectedToCustomDate(customDay2);
        dispatch(loadTopRevenueProducts(customDay1, customDay2));
        setIsCustomRange(true)
      }
    } 
    else if (props.pieDataArray[0]?.page === "clientGender") {
      if (item.label !== "This month" && item.label !== "Custom range") {
        setIsCustomRange(false);
        dispatch(
          loadRevenueByGender(formatDateYYYYMMDD(item.day), currentDate)
        );
      } else if (item.label === "Custom range") {
        const customDay1 = formatDateToWeekDayDDMMMYYYY(0);
        const customDay2 = formatDateToWeekDayDDMMMYYYY(0);
        setSelectedFromCustomDate(customDay1);
        setSelectedToCustomDate(customDay2);
        dispatch(loadRevenueByGender(customDay1, customDay2));
        setIsCustomRange(true);
      } else {
        setIsCustomRange(false);
        dispatch(loadRevenueByGender(getFirstMonth, getLastMonth));
      }
    } 
    else if (props.pieDataArray[0]?.page === "clientCount") {
      if (item.label !== "This month" && item.label !== "Custom range") {
        setIsCustomRange(false);
        dispatch(
          loadRevenueCountByGender(formatDateYYYYMMDD(item.day), currentDate)
        );
      } else if (item.label === "Custom range") {
        const customDay1 = formatDateToWeekDayDDMMMYYYY(0);
        const customDay2 = formatDateToWeekDayDDMMMYYYY(0);
        setSelectedFromCustomDate(customDay1);
        setSelectedToCustomDate(customDay2);
        setIsCustomRange(true);
        dispatch(loadRevenueCountByGender(customDay1, customDay2));
      } else {
        setIsCustomRange(false);
        dispatch(loadRevenueCountByGender(getFirstMonth, getLastMonth));
      }
    } 
    else if (props.pieDataArray[0]?.page === "clientRedemption") {
      if (item.label !== "This month" && item.label !== "Custom range") {
        setIsCustomRange(false);
        dispatch(
          loadRevenueByPrepaid(formatDateYYYYMMDD(item.day), currentDate)
        );
      } else if (item.label === "Custom range") {
        const customDay1 = formatDateYYYYMMDD(0);
        const customDay2 = formatDateYYYYMMDD(0);
        setSelectedFromCustomDate(customDay1);
        setSelectedToCustomDate(customDay2);
        dispatch(loadRevenueByPrepaid(customDay1, customDay2));
        setIsCustomRange(true);
      } else {
        setIsCustomRange(false);
        dispatch(loadRevenueByPrepaid(getFirstMonth, getLastMonth));
      }
    }
  };

  const handleCustomDate = async (type, date, page) => {
    if (type === 1) {
      if (page === "clientGender") {
        setCustomFromClientGenderPassData(date);
        await dispatch(loadRevenueByGender(date, customToClientCountPassData));
      } else if (page === "clientCount") {
        setCustomFromClientCountPassData(date);
        await dispatch(
          loadRevenueCountByGender(date, customToClientGenderPassData)
        );
      } else if (page === "clientRedemption") {
        setCustomFromClientRedemptionPassData(date);
        await dispatch(
          loadRevenueByPrepaid(date, customToClientRedemptionPassData)
        );
      } else if(page === "salesPercent"){
        setCustomTopServicesFromPassData(date);
        await dispatch(loadTopRevenueServices(date,customTopServicesToPassData))
      } else if(page === "salesProduct"){
        setCustomTopProductsFromPassData(date);
        await dispatch(loadTopRevenueProducts(date,customTopProductsToPassData));
      }
      // setCustomFromPassData(date);
      // await dispatch(loadSalesDashboard(date, customToPassData));
    } else if (type === 2) {
      if (page === "clientGender") {
        setCustomToClientGenderPassData(date);
        await dispatch(
          loadRevenueCountByGender(customFromClientGenderPassData, date)
        );
      } else if (page === "clientCount") {
        setCustomToClientCountPassData(date);
        dispatch(loadRevenueByGender(customFromClientCountPassData, date));
      } else if (page === "clientRedemption") {
        setCustomToClientRedemptionPassData(date);
        await dispatch(
          loadRevenueByPrepaid(customFromClientRedemptionPassData, date)
        );
      } else if(page === "salesPercent"){
        setCustomTopServicesToPassData(date);
        await dispatch(loadTopRevenueServices(customTopServicesFromPassData,date));
      } else if(page === "salesProduct"){
        setCustomTopProductsToPassData(date);
        await dispatch(loadTopRevenueProducts(customTopProductsFromPassData,date));
      }
      // setCustomToPassData(date);
      // await dispatch(loadSalesDashboard(customFromPassData, date));
    } else return;
  };

  const tableData1 = props.tableData?.map((service) => [
    service.name,
    service.count,
    `₹${service?.revenue?.toLocaleString()}`,
    `${service?.percent?.toFixed(2)}%`,
  ]);

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
            iconColor="#6950F3"
            style={styles.dropdown}
            data={props.dateArray}
            selectedTextStyle={{ color: "#6950F3" }}
            placeholderStyle={{ color: "#6950F3" }}
            labelField="label"
            valueField="value"
            value={selectedValue}
            onChange={handleSelection}
            placeholder="Today"
          />
        ) : null}
      </View>
      <DateTimePickerModal
        onConfirm={(date) => {
          setFromDateVisibility(false);
          const formattedDate = date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          const formatted = formattedDate
          if (page === "clientGender") {
            setCustomFromGenderDateData(date);
            setCustomClientFromGenderSelected(formatted);
          } else if (page === "clientCount") {
            setCustomFromCountDateData(date);
            setCustomClientFromCountSelected(formatted);
          } else if (page === "clientRedemption") {
            setCustomFromRedemptionDateData(date);
            setCustomClientFromRedemption(formatted);
          } else if(page === "salesPercent"){
            setCustomTopServicesToDateData(date);
            setCustomTopServicesFromSelected(formatted)
          } else if(page === "salesProduct"){
            setCustomTopProductsToDateData(date);
            setCustomTopProductFromSelected(formatted)
          } else return;
          // setCustomFromDateData(date);
          // setSelectedFromCustomDate(formatted);
          handleCustomDate(
            1,
            formatDateYYYYMMDDD(date),
            props.pieDataArray[0]?.page
          );
        }}
        isVisible={fromDateVisibility}
        mode="date"
        date={
          props.pieDataArray[0]?.page === "clientGender"
            ? customFromGenderDateData
            : props.pieDataArray[0]?.page === "clientCount"
            ? customFromCountDateData
            : props.pieDataArray[0]?.page === "clientRedemption"
            ? customFromRedemptionDateData
            : props.pieDataArray[0]?.page === "salesPercent"
            ? customTopServicesFromDateData
            : props.pieDataArray[0]?.page === "salesProduct"
            ? customTopProductsFromDateData
            : new Date()
        }
        maximumDate={
          props.pieDataArray[0]?.page === "clientGender"
            ? customToGenderDateData
            : props.pieDataArray[0]?.page === "clientCount"
            ? customToCountDateData
            : props.pieDataArray[0]?.page === "clientRedemption"
            ? customToRedemptionDateData
            : props.pieDataArray[0]?.page === "salesPercent"
            ? customTopServicesToDateData
            : props.pieDataArray[0]?.page === "salesPercent"
            ? customTopProductsToDateData
            : new Date()
        }
        themeVariant="light"
        onCancel={() => setFromDateVisibility(false)}
      />
      <DateTimePickerModal
        onConfirm={(date) => {
          setToDateVisibility(false);
          const formattedDate = date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          const formatted = formattedDate
          if (page === "clientGender") {
            setCustomToGenderDateData(date);
            setCustomClientToGenderSelected(formatted);
          } else if (page === "clientCount") {
            setCustomToCountDateData(date);
            setCustomClientToCountSelected(formatted);
          } else if (page === "clientRedemption") {
            setCustomToRedemptionDateData(date);
            setCustomClientToRedemption(formatted);
          }  else if(page === "salesPercent"){
            setCustomTopServicesToDateData(date);
            setCustomTopServicesToSelected(formatted)
          } else if(page === "salesProduct"){
            setCustomTopProductsToDateData(date);
            setCustomTopProductToSelected(formatted)
          }else return;
          handleCustomDate(
            2,
            formatDateYYYYMMDDD(date),
            props.pieDataArray[0]?.page
          );
        }}
        // minimumDate={customFromDateData}
        isVisible={toDateVisibility}
        mode="date"
        date={
          props.pieDataArray[0]?.page === "clientGender"
            ? customToGenderDateData
            : props.pieDataArray[0]?.page === "clientCount"
            ? customToCountDateData
            : props.pieDataArray[0]?.page === "clientRedemption"
            ? customToRedemptionDateData
            : props.pieDataArray[0]?.page === "salesPercent"
            ? customTopServicesToDateData
            : props.pieDataArray[0]?.page === "salesProduct"
            ? customTopProductsToDateData
            : new Date()
        }
        // maximumDate={new Date()}
        themeVariant="light"
        onCancel={() => setToDateVisibility(false)}
      />
      <View style={isCustomRange && styles.customDateBox}>
        {isCustomRange ? (
          <View style={styles.customDateContainer}>
            <Pressable
              style={styles.datePressable}
              android_ripple={{ color: Colors.ripple }}
              onPress={() => setFromDateVisibility(true)}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: 12,
                  fontWeight: "500",
                  letterSpacing: 0.1,
                  lineHeight: 20,
                }}
              >
                {props.pieDataArray[0]?.page === "clientGender"
                  ? (
                      customClientFromGenderSelected || new Date()
                    )
                  : props.pieDataArray[0]?.page === "clientCount"
                  ? (customClientFromCountSelected || new Date())
                  : props.pieDataArray[0]?.page === "clientRedemption"
                  ? (customClientFromRedemption || new Date())
                  : props.pieDataArray[0]?.page === "salesPercent"
                  ? (customTopServicesFromSelected|| new Date())
                  : props.pieDataArray[0]?.page === "salesProduct"
                  ? (customTopProductFromSelected || new Date())
                  : ""}
              </Text>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={18}
                color={Colors.darkBlue}
              />
            </Pressable>
            <Text style={{ alignSelf: "center" }}> TO </Text>
            <Pressable
              style={styles.datePressable}
              android_ripple={{ color: Colors.ripple }}
              onPress={() => setToDateVisibility(true)}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: 12,
                  fontWeight: "500",
                  letterSpacing: 0.1,
                  lineHeight: 20,
                }}
              >
                {props.pieDataArray[0]?.page === "clientGender"
                  ? (customClientToGenderSelected || new Date())
                  : props.pieDataArray[0]?.page === "clientCount"
                  ? (customClientToCountSelected || new Date())
                  : props.pieDataArray[0]?.page === "clientRedemption"
                  ? (customClientToRedemption || new Date())
                  : props.pieDataArray[0]?.page === "salesPercent"
                  ? (customTopServicesToSelected || new Date())
                  : props.pieDataArray[0]?.page === "salesProduct"
                  ? (customTopProductToSelected || new Date())
                  : new Date().toDateString()}
              </Text>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={18}
                color={Colors.darkBlue}
              />
            </Pressable>
          </View>
        ) : null}
      </View>
      <Divider />
      {props?.labelArray?.[0] !== "" &&
      props?.pieDataArray[0]?.text !== "0%" &&
      props.pieDataArray.length !== 0 ? (
        <View style={styles.piechartContainer}>
          {props.totalCenterValue !== undefined ? (
            <PieChart
              data={
                props.pieDataArray !== undefined
                  ? props.pieDataArray
                  : [{ color: "#357AF6", text: "0%", value: 1 }]
              }
              donut
              strokeWidth={2}
              strokeColor="white"
              radius={150}
              isAnimated
              animationDuration={5000}
              centerLabelComponent={() =>
                props.totalCenterValue !== undefined ? (
                  <View style={styles.piechart}>
                    <Text>Total Value</Text>
                    <Text
                      style={[
                        styles.totalValue,
                        {
                          fontSize: getFontSize(
                            props.totalCenterValue.toFixed(2)
                          ),
                        },
                      ]}
                    >
                      ₹{props.totalCenterValue.toFixed(2)}
                    </Text>
                  </View>
                ) : null
              }
              innerRadius={55}
              showText
              textColor="white"
              textSize={14}
            />
          ) : (
            <PieChart
              data={
                props.pieDataArray.length === 0
                  ? [{ color: "#357AF6", text: "0%", value: 1 }]
                  : props.pieDataArray
              }
              radius={150}
              innerRadius={55}
              strokeWidth={2}
              strokeColor="white"
              showText
              textColor="white"
              textSize={14}
              isAnimated
              animationDuration={5000}
            />
            // null
          )}
          <View
            style={[
              styles.legendContainer,
              props.labelArray !== undefined && props.labelArray.length > 0
                ? { marginTop: 20 }
                : null,
            ]}
          >
            {props.labelArray !== undefined ? (
              props.labelArray.length > 0 ? (
                props.labelArray.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[
                        styles.colorBox,
                        { backgroundColor: props.pieDataArray[index].color },
                      ]}
                    />
                    <Text style={styles.legendText}>{item}</Text>
                  </View>
                ))
              ) : (
                <Text>No data Found!</Text>
              )
            ) : null}
          </View>
          {props.toggleDropdown ? (
            <TouchableOpacity
              onPress={() => {
                setDropdownVisible((prev) => !prev);
              }}
              style={styles.revenueHeader}
            >
              <Text style={{ color: Colors.highlight }}>
                {props.toggleTitle}
              </Text>
              <AntDesign
                name={dropdownVisible ? "up" : "down"}
                size={18}
                color="#6950F3"
              />
            </TouchableOpacity>
          ) : null}
          {dropdownVisible ? (
            <View style={styles.tableContainer}>
              <TableWrapper>
                <Table style={styles.tableHeaderContainer}>
                  <Row
                    data={["Top Services", "Count", "Value", "%"]}
                    style={styles.headerData}
                    textStyle={[TextTheme.titleSmall, { textAlign: "center" }]}
                    flexArr={[2, 1, 1, 1]}
                  />
                  <Rows
                    data={tableData1}
                    flexArr={[2, 1, 1, 1]}
                    textStyle={[TextTheme.bodySmall, { textAlign: "center" }]}
                    style={styles.rowData}
                  />
                </Table>
              </TableWrapper>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={{ paddingVertical: 20, alignSelf: "center" }}>
          <Text>No data found!</Text>
        </View>
      )}
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
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    columnGap: 10,
  },
  legendItem: {
    backgroundColor: "#F2F2F7",
    // borderWidth: 0.2,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderColor: Colors.grey250,
    // width: "45%",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
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
    fontSize: 12,
    fontWeight: "500",
  },
  dropdown: {
    width: "40%",
    color: Colors.highlight,
    paddingHorizontal: 10,
  },
  revenueHeader: {
    marginTop: 20,
    gap: 10,
    borderRadius: 99,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: Colors.grey250,
    flexDirection: "row",
  },
  tableContainer: {
    width: "100%",
    marginTop: 10,
    marginHorizontal: 10,
  },
  tableHeaderContainer: {
    width: "100%", // Make the table container take up full width
    // marginHorizontal:20,
    padding: 5,
  },
  headerData: {
    borderTopColor: Colors.grey250,
    borderBottomColor: Colors.grey250,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  rowData: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey250,
    overflow: "hidden",
  },
  customDateBox: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.grey250,
    backgroundColor: Colors.grey150,
    // width: "65%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  customDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  datePressable: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
});
