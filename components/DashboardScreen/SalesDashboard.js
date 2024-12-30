import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "../../constants/Colors";
import { listData, pieChartColorCode, salesCardData, salesData } from "../../data/DashboardSelection";
import DashboardCard from "../../ui/DashboardCard";
import ListIconData from "./ListIconData";
import { Divider } from "react-native-paper";
import textTheme from "../../constants/TextTheme";
import ServiceList from "./ServiceList";
import { useDispatch, useSelector } from "react-redux";
import { loadSalesDashboard, loadTopRevenueProducts, loadTopRevenueServices, updateDashBoardName, loadDailyAppointmentAnalyticsForBusiness } from "../../store/dashboardSlice";
import { convertToTitleCase, formatDateDDMMYYYY, formatDateToWeekDayDDMMMYYYY, formatDateYYYYMMDD, formatDateYYYYMMDDD, getFirstAndLastDateOfCurrentMonthDDMMYYYY, getFirstDateOfCurrentMonthYYYYMMDD, getLastDateOfCurrentMonthYYYYMMMDD } from "../../util/Helpers";
import PieChartBox from "./PieChartBox";
import { calculateTotalValue, processPieChartData } from "./PieData";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LineChartBox from "./LineChartBox";
import GroupedBarChart from "./GroupedBarChart";
import { useFocusEffect } from "@react-navigation/native";
import { useLocationContext } from "../../context/LocationContext";
import SalesDashboardScreenLoader from "./SalesDashboardScreenLoader";
import SalesDashboardDateLoader from "./SalesDashboardDateLoader";

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const { getLocation } = useLocationContext()
  useFocusEffect(useCallback(() => {
    getLocation("Sales Dashboard");
  }, []))
  const [selectedValue, setSelectedValue] = useState("today");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(formatDateDDMMYYYY().toString());
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [fromDateVisibility, setFromDateVisibility] = useState(false);
  const [toDateVisibility, setToDateVisibility] = useState(false);
  const [selectedFromCustomDate, setSelectedFromCustomDate] = useState("0");
  const [selectedToCustomDate, setSelectedToCustomDate] = useState("0");
  const [customFromDateData, setCustomFromDateData] = useState(new Date());
  const [customToDateData, setCustomToDateData] = useState(new Date());
  const [customFromPassData, setCustomFromPassData] = useState(formatDateYYYYMMDD(0));
  const [customToPassData, setCustomToPassData] = useState(formatDateYYYYMMDD(0));
  const [isDateDataLoading, setIsDateDataLoading] = useState(false);

  const lastMonthDate = getLastDateOfCurrentMonthYYYYMMMDD();
  const firstMonthDate = getFirstDateOfCurrentMonthYYYYMMDD();

  const { firstDateDDMMYYYY, lastDateDDMMYYYY } = getFirstAndLastDateOfCurrentMonthDDMMYYYY();

  const dateData = useSelector((state) => state.dashboardDetails.dateData);
  const expenseValues = useSelector((state) => state.dashboardDetails.expenseValues);
  const listStoreData = useSelector((state) => state.dashboardDetails.listData);
  const paymentStoreData = useSelector((state) => state.dashboardDetails.paymentModeSummary);
  const totalSalesRevenue = useSelector((state) => state.dashboardDetails.totalSalesRevenue);
  const billItemDetails = useSelector((state) => state.dashboardDetails.billItemDetails);
  const revenueDetails = useSelector((state) => state.dashboardDetails.revenueReport6months);
  const topRevenueDetails = useSelector((state) => state.dashboardDetails.topRevenueServiceDetails);
  const topProductDetails = useSelector((state) => state.dashboardDetails.topRevenueProductDetails);
  const labelArray = useSelector((state) => state.dashboardDetails.toggleDateData);
  const totalSalesOverTime = useSelector((state) => state.dashboardDetails.totalSalesOverTime);
  const totalSalesOverTimeDropdown = useSelector((state) => state.dashboardDetails.lineChartData);
  const totalAppointmentOverTime = useSelector((state) => state.dashboardDetails.totalAppointmentOverTime);

  const billItemTotalValue = calculateTotalValue(billItemDetails[0].series);

  const servicesTotalValue = calculateTotalValue(topRevenueDetails[0].chart_series);
  const productsTotalValue = calculateTotalValue(topProductDetails[0].chart_series);

  const data = billItemDetails[0].series.map((value) => ({ value })) || [];
  const totalSalesOverTimeData = totalSalesOverTime.count.map((value) => ({ value: value, dataPointText: value.toString() }))
  const totalAppointmentsOverTimeData = totalAppointmentOverTime.count.map((value) => ({ value: value, dataPointText: value.toString() }))

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const percentageBillData = data.map((item, index) => {
    const percentage = totalValue
      ? ((item.value / totalValue) * 100).toFixed(1)
      : 0;
    return {
      value: item.value,
      text: percentage <= 2.0 ? "" : `${percentage}%`,
      color: pieChartColorCode[index]?.color || "#000",
      tooltipText:billItemDetails[0].labels[index]
    };
  });

  const togglePercentageData = processPieChartData(
    topRevenueDetails[0].services_list,
    "salesPercent",
    topRevenueDetails[0].label_list,
  );

  const toggleProductData = processPieChartData(
    topProductDetails[0].services_list,
    "salesProduct",
    topProductDetails[0].label_list,
  );
  
  const valueMap = {
    "Total Appointments": listStoreData.totalAppointments,
    "Online Sales": listStoreData.onlineSales,
    "Cancelled bill count": listStoreData.cancelledBillCount,
    "Cancelled bill value": listStoreData.cancelledBillValue,
  };

  const { revenue, count, month } = revenueDetails[0];

  const handleSelection = async (item) => {
    setIsDateDataLoading(true)
    setSelectedValue(item.value);
    if (item.day1 === undefined) {
      setIsCustomRange(false);

      if (item.value !== "Current month" && item.value !== "Custom range") {
        // dispatch(updateLoadingState(true));
        setDate(
          item.day !== -6 && item.day !== -29
            ? formatDateDDMMYYYY(item.day)
            : formatDateDDMMYYYY(item.day) + " - " + formatDateDDMMYYYY(0)
        );
        setIsLoading(true);
        await dispatch(
          loadSalesDashboard(
            formatDateYYYYMMDD(item.day),
            item.day !== -6 && item.day !== -29
              ? formatDateYYYYMMDD(item.day)
              : formatDateYYYYMMDD(0)
          )
        );
      }
    } else if (item.value === "Current month") {
      setIsCustomRange(false);
      setIsLoading(true);
      setDate(firstDateDDMMYYYY + " - " + lastDateDDMMYYYY);
      await dispatch(loadSalesDashboard(firstMonthDate, lastMonthDate));
    }
    else {
      setIsLoading(true);
      setIsCustomRange(true);
      const customDay1 = formatDateToWeekDayDDMMMYYYY(item.day1);
      const customDay2 = formatDateToWeekDayDDMMMYYYY(item.day2);
      setSelectedFromCustomDate(customDay1);
      setSelectedToCustomDate(customDay2);
      await dispatch(loadSalesDashboard(formatDateYYYYMMDD(item.day2), formatDateYYYYMMDD(item.day1)));
    }
    // dispatch(updateLoadingState(false));
    setIsLoading(false);
    setIsDateDataLoading(false);
  };

  const handleCustomDate = async (type, date) => {
    if (type === 1) {
      setCustomFromPassData(date);
      await dispatch(loadSalesDashboard(date, customToPassData));
    }
    else if (type === 2) {
      setCustomToPassData(date);
      await dispatch(loadSalesDashboard(customFromPassData, date));
    }
    else return
  }

  useEffect(() => {
    let firstMonth = firstMonthDate;
    let lastMonth = lastMonthDate;

    async function initialCall() {
      await dispatch(updateDashBoardName("Sales"))
      await dispatch(loadSalesDashboard(formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)));
      await dispatch(loadTopRevenueServices(firstMonthDate, lastMonthDate));
      await dispatch(loadDailyAppointmentAnalyticsForBusiness(true, "currentmonth"))
      await dispatch(loadTopRevenueProducts(firstMonth, lastMonth));
      await dispatch(loadDailyAppointmentAnalyticsForBusiness(false, "currentmonth"))
      setIsPageLoading(false);
    }
    initialCall();
  }, []);
  const totalSalesOverTimeArr = [...totalSalesOverTime.count];
  const maxTotalSalesValue = totalSalesOverTimeArr.sort((a, b) => b - a)[0];
  const appointmentsOverTimeArr = [...totalAppointmentOverTime.count];
  const maxAppointmentsOverTime = appointmentsOverTimeArr.sort((a, b) => b - a)[0];

  function roundUpToNearestPowerOfTen(value) {
    const power = Math.pow(10, Math.floor(Math.log10(value)));
    return Math.ceil(value / power) * power;
  }

  function roundUp(value) {
    return value <= 10 ? value : roundUpToNearestPowerOfTen(value);
  }

  function removeZero(roundedValue) {
    const valueStr = roundedValue.toString();
    if (valueStr.includes('e')) {
      return valueStr.split('e')[0];
    }
    return roundedValue.toString().replace(/0+$/, '');
  }

  const removeZeroLineSalesOverTime = removeZero(roundUp(maxTotalSalesValue)) || 10;
  const roundLineSalesOverTime = roundUp(maxTotalSalesValue)

  return (
    <ScrollView style={{ backgroundColor: Colors.white }}>
      <View style={styles.container}>
        {
          isPageLoading ? <SalesDashboardScreenLoader /> :
            <>
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
                      <Text> TO </Text>
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
                  <SalesDashboardDateLoader /> :
                  <>
                    <View style={styles.statisticContainer}>
                      {salesCardData.map((item, index) => {
                        const expenseKeys = Object.keys(expenseValues);
                        const expenseValue = expenseValues[expenseKeys[index]];
                        return (
                          <DashboardCard
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            color={item.color}
                            value={expenseValue}
                            popoverText={item.popoverText}
                          />
                        );
                      })}
                    </View>
                    <View style={styles.listDataContainer}>
                      {listData.map((item, index) => {
                        const value = (item.title === "Online Sales" || item.title === "Cancelled bill value")
                          ? "₹ " + valueMap[item.title] : valueMap[item.title] || 0;
                        return (
                          <ListIconData
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            value={value}
                          />
                        );
                      })}
                    </View>

                    <View style={styles.commonContainer}>
                      <Text
                        style={[
                          textTheme.titleMedium,
                          { paddingLeft: 20, paddingBottom: 16, paddingTop: 8 },
                        ]}
                      >
                        Payment Mode
                      </Text>
                      {paymentStoreData.length > 0 ? (
                        paymentStoreData.map((item, index) => {
                          const title = convertToTitleCase(item.mode_of_payment);
                          return (
                            title !== "Nil" && (
                              <View key={index}>
                                <ServiceList title={title} value={item.net_sales} />
                                {index !== paymentStoreData.length - 1 && <Divider />}
                              </View>
                            )
                          );
                        })
                      ) : (
                        <Text style={{ textAlign: "center", marginBottom: 20 }}>
                          No data found!{" "}
                        </Text>
                      )}
                    </View>

                    <View style={styles.commonContainer}>
                      <Text
                        style={[
                          textTheme.titleMedium,
                          { paddingLeft: 20, paddingBottom: 16, paddingTop: 8 },
                        ]}
                      >
                        Total Sales
                      </Text>
                      {salesData.map((item, index) => {
                        const revenueKeys = Object.keys(totalSalesRevenue);
                        const revenueValue = totalSalesRevenue[revenueKeys[index]];
                        return (
                          <View key={index}>
                            <ServiceList title={item.title} value={revenueValue} />
                            {index !== salesData.length - 1 && <Divider />}
                          </View>
                        );
                      })}
                    </View>
                  </>
              }
            </>
        }


        <PieChartBox
          totalCenterValue={billItemTotalValue}
          title={"Bill Items"}
          labelArray={billItemDetails[0].labels}
          pieDataArray={percentageBillData}
          dropdownKey={"vipslinebillitem_1"}
        />
        <View style={styles.commonContainer}>
          <Text
            style={[
              textTheme.titleMedium,
              { paddingLeft: 20, paddingBottom: 16, paddingTop: 16 },
            ]}
          >
            Revenue Report
          </Text>
          <Divider />
          <View style={styles.barchartContainer}>
            {
              <GroupedBarChart month={month} count={count} revenue={revenue} />
            }
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#9B9BFF" }]}
                />
                <Text style={styles.legendText}>Bill value</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#4A90E2" }]}
                />
                <Text style={styles.legendText}>Bill count</Text>
              </View>
            </View>
          </View>
        </View>
        <LineChartBox
          title={"Total sales over time"}
          toggleDateDropdown
          dateArray={totalSalesOverTimeDropdown}
          xLabelArrayData={totalSalesOverTime.date}
          lineChartData={totalSalesOverTimeData}
          max={roundLineSalesOverTime}
          sections={removeZeroLineSalesOverTime === "1" ? 10 : removeZeroLineSalesOverTime}
          page="SalesOverTime"
        // key1={"SalesOverTime"}
        />
        <LineChartBox
          title={"Appointments over time"}
          toggleDateDropdown
          dateArray={totalSalesOverTimeDropdown}
          xLabelArrayData={totalAppointmentOverTime.date}
          lineChartData={totalAppointmentsOverTimeData}
          page="AppointmentOverTime"
          // key1={"SalesOverTime"}
          max={roundUp(maxAppointmentsOverTime)}
          sections={removeZero(roundUp(maxAppointmentsOverTime)) || 10}
        />
        <PieChartBox
          title={"Top Services"}
          pieDataArray={
            togglePercentageData.length > 0 ? togglePercentageData : undefined
          }
          totalCenterValue={servicesTotalValue}
          toggleDropdown={togglePercentageData[0].text !== "0%"}
          toggleDateDropdown
          tableData={topRevenueDetails[0].services_list}
          toggleTitle={"Top 10 Revenue Services"}
          dateArray={labelArray}
          tableHeader={["Top Services", "Count", "Value", "%"]}
          showPie={togglePercentageData.length !== 0}
          dropdownKey={"vipslinetopservices_1"}
        />
        <PieChartBox
          title={"Top Products"}
          pieDataArray={
            toggleProductData.length > 0 ? toggleProductData : undefined
          }
          totalCenterValue={productsTotalValue}
          toggleDropdown={toggleProductData[0].text !== "0%"}
          toggleDateDropdown
          tableData={topProductDetails[0].services_list}
          toggleTitle={"Top 10 Revenue Products"}
          dateArray={labelArray}
          tableHeader={["Top Products", "Count", "Value", "%"]}
          showPie={toggleProductData.length !== 0}
          dropdownKey={"vipslinetopproducts_1"}
        />
      </View>
    </ScrollView>
  );
};

export default SalesDashboard;

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
    // rowGap: 5,
  },
  dropdown: {
    width: "45%",
    backgroundColor: Colors.grey150,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.grey250,
    paddingHorizontal: 20,
    height: 45,
  },
  dateBox: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.grey250,
    backgroundColor: Colors.grey150,
    width: "55%",
    // height: 45,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
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
  },
  dateText: {},
  statisticContainer: {
    marginVertical: "7%",
    flexWrap: "wrap",
    flexDirection: "row",
    rowGap: 25,
    columnGap: 25,
    justifyContent: "center",
  },
  listDataContainer: {
    marginBottom: 10,
  },
  commonContainer: {
    borderWidth: 1,
    borderColor: Colors.grey250,
    marginBottom: 20,
    borderRadius: 4,
  },
  piechartContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  barchartContainer: {
    // justifyContent: "center",
    // alignItems: "center",
    paddingVertical: 30,
    // paddingLeft:10,
    // overflow: "scroll",
  },
  piechart: {
    justifyContent: "center",
    alignItems: "center",
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: 'center'
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    // width: "45%",
    marginHorizontal: 10,
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
  legendColor: {
    width: 15,
    height: 15,
    marginRight: 5,
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
