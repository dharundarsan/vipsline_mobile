import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { formatDateDDMMYYYY, formatDateToWeekDayDDMMMYYYY, formatDateYYYYMMDD, formatDateYYYYMMDDD, getFirstAndLastDateOfCurrentMonthDDMMYYYY, getFirstDateOfCurrentMonthYYYYMMDD, getLastDateOfCurrentMonthYYYYMMMDD } from "../../util/Helpers";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  loadResourceIdByUserInfo,
  loadStaffDashboardReport,
  updateDashBoardName
} from "../../store/dashboardSlice";
import PieChartBox from "./PieChartBox";
import { pieChartColorCode, trophyIcon } from "../../data/DashboardSelection";
import TextTheme from "../../constants/TextTheme";
import { Image } from "react-native";
import { Divider } from "react-native-paper";
import { Row, Rows, Table, TableWrapper } from "react-native-table-component";
import { TouchableOpacity } from "react-native";
import StaffDetailsModel from "./StaffDetailsModel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ContentLoader from "react-native-easy-content-loader";
import { useFocusEffect } from "@react-navigation/native";
import { useLocationContext } from "../../context/LocationContext";

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const { getLocation } = useLocationContext();

  const todayDate = formatDateYYYYMMDD();
  const getLast7thDayDate = () => formatDateYYYYMMDD(-7);
  const getLast30thDayDate = () => formatDateYYYYMMDD(-30);
  const lastMonthDate = getLastDateOfCurrentMonthYYYYMMMDD();
  const firstMonthDate = getFirstDateOfCurrentMonthYYYYMMDD();

  const [selectedValue, setSelectedValue] = useState("today");

  const dateData = useSelector((state) => state.dashboardDetails.dateData);
  const username = useSelector((state) => state.loginUser.details);
  const pieData = useSelector((state) => state.dashboardDetails.staffPieChartData);
  const topPerformer = useSelector((state) => state.dashboardDetails.top_performer_report);
  const salesReport = useSelector((state) => state.dashboardDetails.staff_sales_report);

  const [isVisible, setIsVisible] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(formatDateDDMMYYYY().toString());
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [selectedFromCustomDate, setSelectedFromCustomDate] = useState("0");
  const [selectedToCustomDate, setSelectedToCustomDate] = useState("0");
  const [customFromDateData, setCustomFromDateData] = useState(new Date());
  const [customToDateData, setCustomToDateData] = useState(new Date());
  const [customFromPassData, setCustomFromPassData] = useState(formatDateYYYYMMDD(0));
  const [customToPassData, setCustomToPassData] = useState(formatDateYYYYMMDD(0));
  const [fromDateVisibility, setFromDateVisibility] = useState(false);
  const [toDateVisibility, setToDateVisibility] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isDateDataLoading, setIsDateDataLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    getLocation("Staff Dashboard");
  }, []))

  const servicesChartData = pieData.chart_series.map((value) => ({ value }));
  const servicesTotalValue = servicesChartData.reduce((sum, item) => sum + item.value, 0);

  const togglePieData = pieData.label_list.map((item, index) => {
    const percentage = (
      (pieData.chart_series[index] / servicesTotalValue) *
      100
    ).toFixed(1);
    return { value: item, text: percentage };
  });

  const togglePercentageData = togglePieData.map((item, index) => {
    // const percentage = ((item.value / totalValue) * 100).toFixed(1);
    const percentage = parseFloat(item.text) <= 3.0 ? "" : `${parseFloat(item.text)}%`;
    return {
      value: pieData.chart_series[index],
      text: percentage,
      color: pieChartColorCode[index].color,
      tooltipText:pieData.label_list[index]
    };
  });

  const handleSelection = async (item) => {
    setSelectedValue(item.value);
    setIsLoading(true);
    setIsDateDataLoading(true)
    if (item.day1 === undefined) {
      setIsCustomRange(false);
      // if (item.value === "This Month") {
      //   // Calculate current month range dynamically
      //   const { firstDateYYYYMMDD, lastDateYYYYMMDD } = getFirstAndLastDateOfCurrentMonthDDMMYYYY();
      //   setDate(`${firstDateDDMMYYYY} - ${lastDateDDMMYYYY}`);
      //   await dispatch(loadStaffDashboardReport(firstDateYYYYMMDD, lastDateYYYYMMDD));
      // } else {
      setDate(
        item.day !== -6 && item.day !== -29
          ? formatDateDDMMYYYY(item.day)
          : `${formatDateDDMMYYYY(item.day)} - ${formatDateDDMMYYYY(0)}`
      );
      await dispatch(loadStaffDashboardReport(formatDateYYYYMMDD(item.day), 
            item.day !== -6 && item.day !== -29
            ? formatDateYYYYMMDD(item.day)
            : formatDateYYYYMMDD(0)
    ));
    }
    else if (item.value === "Current month") {
      setIsCustomRange(false);
      setIsLoading(true);
      const { firstDateDDMMYYYY, lastDateDDMMYYYY } =
        getFirstAndLastDateOfCurrentMonthDDMMYYYY();
      setDate(firstDateDDMMYYYY + " - " + lastDateDDMMYYYY);
      await dispatch(loadStaffDashboardReport(firstMonthDate, lastMonthDate));
    }
    else {
      // Custom range selection
      setIsCustomRange(true);
      const customDay1 = formatDateToWeekDayDDMMMYYYY(item.day1);
      const customDay2 = formatDateToWeekDayDDMMMYYYY(item.day2);

      setSelectedFromCustomDate(customDay1);
      setSelectedToCustomDate(customDay2);
      await dispatch(loadStaffDashboardReport(formatDateYYYYMMDD(item.day2), formatDateYYYYMMDD(item.day1)));
    }
    setIsDateDataLoading(false);
    setIsLoading(false);
  };

  const handleCustomDate = async (type, date) => {
    if (type === 1) {
      setCustomFromPassData(date);
      await dispatch(loadStaffDashboardReport(date, customToPassData));
    }
    else if (type === 2) {
      setCustomToPassData(date);
      await dispatch(loadStaffDashboardReport(customFromPassData, date));
    }
    else return
  }

  const formatTableData = (data) => {
    return Object.values(data).map((service) => [
      service.name,
      service.customer_count,
      service.item_count,
      `₹${service.total_value.toLocaleString()}`,
    ]);
  };

  const tableData = formatTableData(salesReport);


  useEffect(() => {
    async function initialRender() {
      setIsPageLoading(true);
      await dispatch(updateDashBoardName("Staff"))
      await dispatch(loadResourceIdByUserInfo(username.username));
      await dispatch(loadStaffDashboardReport(formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)));
      setIsPageLoading(false)
    }
    initialRender()
  }, []);

  const renderRow = (rowData, rowIndex) => {
    return (
      <>
        <TouchableOpacity
          style={[styles.rowButton, { flexDirection: "row" }]} // Flexbox to align items in a row
          onPress={() => {
            setSelectedData(salesReport[rowIndex]);
            setIsVisible(true);
          }}
        >
          {rowData.map((cellData, cellIndex) => {
            return (
              <View key={cellIndex} style={{ flex: [2, 1, 1, 1][cellIndex] }}>
                <Text style={[TextTheme.bodySmall, { textAlign: "center" }]} ellipsizeMode="tail" numberOfLines={1}>
                  {cellData}
                </Text>
              </View>
            )
          })}
        </TouchableOpacity>
        {rowIndex + 1 !== tableData.length ? <Divider /> : null}
      </>
    )
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.white }}>
      {isVisible && <StaffDetailsModel isVisible={isVisible} closeModal={() => { setIsVisible(false) }} data={selectedData} />}
      {
        isPageLoading ?
          <View style={styles.container}>
            <View style={[{ flexDirection: "row", columnGap: 0, width: "50%", marginBottom: 10 }]}>
              <ContentLoader
                pRows={1}
                pHeight={[45]}
                pWidth={["100%"]}
                active
                title={false}

              />
              <ContentLoader
                pRows={1}
                pHeight={[45]}
                pWidth={["100%"]}
                active
                title={false}

              />
            </View>
            <View style={{ rowGap: 10 }}>
              <ContentLoader
                pRows={1}
                pHeight={[120]}
                pWidth={["100%"]}
                active
                title={false}
              />
              <ContentLoader
                pRows={1}
                pHeight={[120]}
                pWidth={["100%"]}
                active
                title={false}
              />
              <ContentLoader
                pRows={1}
                pHeight={[120]}
                pWidth={["100%"]}
                active
                title={false}
              />
            </View>
          </View>
          :
          <View style={styles.container}>
            <View style={isCustomRange ? styles.customRangeDateContainer : styles.dateContainer}>
              <Dropdown
                style={isCustomRange ? styles.customDropdown : styles.dropdown}
                data={dateData}
                labelField="label"
                valueField="value"
                value={selectedValue}
                onChange={handleSelection}
                // placeholder="Today"
                disable={isLoading}
              />
              <DateTimePickerModal
                onConfirm={(date) => {
                  setFromDateVisibility(false);
                  setCustomFromDateData(date)
                  const formatted = date.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  setSelectedFromCustomDate(formatted)
                  handleCustomDate(1, formatDateYYYYMMDDD(date))
                }}
                isVisible={fromDateVisibility}
                mode="date"
                date={customFromDateData}
                maximumDate={customToDateData}
                themeVariant="light"
                onCancel={() => setFromDateVisibility(false)}
              />
              <DateTimePickerModal
                onConfirm={(date) => {
                  setToDateVisibility(false);
                  setCustomToDateData(date)
                  const formatted = date.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  setSelectedToCustomDate(formatted)
                  handleCustomDate(2, formatDateYYYYMMDDD(date))
                }}
                minimumDate={customFromDateData}
                isVisible={toDateVisibility}
                mode="date"
                date={customToDateData}
                maximumDate={new Date()}
                themeVariant="light"
                onCancel={() => setToDateVisibility(false)}
              />
              <View style={isCustomRange ? styles.customDateBox : styles.dateBox}>
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
                        {selectedFromCustomDate}
                      </Text>
                      <MaterialCommunityIcons
                        name="calendar-month-outline"
                        size={18}
                        color={Colors.darkBlue}
                      />
                    </Pressable>
                    <Text style={{ alignSelf: 'center' }}> TO </Text>
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
                        {selectedToCustomDate}
                      </Text>
                      <MaterialCommunityIcons
                        name="calendar-month-outline"
                        size={18}
                        color={Colors.darkBlue}
                      />
                    </Pressable>
                  </View>
                ) : (
                  <Text style={styles.dateText}>{date}</Text>
                )}
              </View>
            </View>
            {
              isDateDataLoading ? 
              <View style={{ rowGap: 10 }}>
              <ContentLoader
                pRows={1}
                pHeight={[120]}
                pWidth={["100%"]}
                active
                title={false}
              />
              <ContentLoader
                pRows={1}
                pHeight={[120]}
                pWidth={["100%"]}
                active
                title={false}
              />
              <ContentLoader
                pRows={1}
                pHeight={[120]}
                pWidth={["100%"]}
                active
                title={false}
              />
            </View>
              :
              <>
              <PieChartBox
              title={"Staff Performance"}
              pieDataArray={togglePercentageData}
              totalCenterValue={servicesTotalValue}
              labelArray={pieData.label_list}
            // toggleDateDropdown
            />
            <View style={styles.performerContainer}>
              <View style={styles.headerContainer}>
                <Text style={TextTheme.titleMedium}>Top Performer</Text>
              </View>
              <Divider />
              <View style={{ alignItems: "center", paddingVertical: 10 }}>
                {topPerformer[0]?.name !== undefined && topPerformer[0].name !== "" > 0 ? (
                  topPerformer.map((item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          width: "50%",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingVertical: 10,
                        }}
                      >
                        <Image
                          source={trophyIcon[index].icon}
                          style={{ width: 40, height: 40 }}
                        />
                        <View style={{ width: '80%', alignItems: 'center'}}>
                          <View style={{ alignItems: 'center' }}>
                            <Text style={TextTheme.bodyMedium}>{item.name}</Text>
                            <Text style={TextTheme.bodyMedium}>
                              {"₹ " + pieData.chart_series[index]}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text style={{ justifyContent: "center", alignItems: "center" }}>
                    No data Found !
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.topList}>
              <View style={styles.headerPerformerContainer}>
                <Text style={[TextTheme.titleMedium, { textAlign: "center" }]}>
                  Staff Performance Summary
                </Text>
              </View>
              <Divider />
              <TableWrapper>
                <Table style={styles.tableHeaderContainer}>
                  <Row
                    data={["Staff Name", "Clients", "Item #", "Total"]}
                    style={styles.headerData}
                    textStyle={[TextTheme.titleSmall, { textAlign: "center" }]}
                    flexArr={[2, 1, 1, 1]}
                  />
                  {tableData.length > 0 ? tableData.map((rowData, index) => {
                    // console.log((rowData[0].value + rowData[1].value + index) === NaN ? index : rowData[0].value + rowData[1].value + index);
                    return (
                      <View key={rowData} style={styles.rowData}>
                        {renderRow(rowData, index)}
                      </View>
                    )
                  }) : <Text style={{ paddingVertical: 20, alignSelf: 'center' }}>No data found!</Text>}
                </Table>
              </TableWrapper>
            </View>
              </>
            }
            
          </View>
      }
    </ScrollView>
  );
};

export default StaffDashboard;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: Colors.white,
  },
  dateContainer: {
    flexDirection: "row",
    columnGap: 5,
    marginBottom: 20,
  },
  dropdown: {
    width: "45%",
    backgroundColor: Colors.grey150,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.grey250,
    paddingHorizontal: 10,
  },
  dateBox: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.grey250,
    backgroundColor: Colors.grey150,
    width: "55%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  customRangeDateContainer: {
    // flexDirection: "row",
    // columnGap: 5,
    rowGap: 15,
  },
  customDropdown: {
    // width: "35%",
    backgroundColor: Colors.grey150,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.grey250,
    paddingHorizontal: 20,
    height: 45,
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
    marginBottom: 15
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
  dateText: {},
  performerContainer: {
    borderWidth: 1,
    borderColor: Colors.grey250,
    marginBottom: 20,
    borderRadius: 4,
  },
  headerContainer: {
    // backgroundColor:Colors.grey150,
    // justifyContent:'center',
    // alignItems:'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerPerformerContainer: {
    backgroundColor: Colors.grey150,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  topList: {
    borderWidth: 1,
    borderColor: Colors.grey250,
    marginBottom: 20,
    borderRadius: 4,
  },
  headerData: {
    borderBottomColor: Colors.grey250,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  tableHeaderContainer: {
    width: "100%", // Make the table container take up full width
    // marginHorizontal:20,
    padding: 5,
  },
  tableContainer: {
    paddingHorizontal: 20,
  },
  columnHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  rowButton: {
    paddingVertical: 20,
  },
});
