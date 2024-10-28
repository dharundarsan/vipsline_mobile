import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "../../constants/Colors";
import {
  listData,
  paymentData,
  pieChartColorCode,
  salesCardData,
  salesData,
} from "../../data/DashboardSelection";
import DashboardCard from "../../ui/DashboardCard";
import ListIconData from "./ListIconData";
import { Divider } from "react-native-paper";
import textTheme from "../../constants/TextTheme";
import ServiceList from "./ServiceList";
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
} from "react-native-gifted-charts";
import { useDispatch, useSelector } from "react-redux";
import {
  loadSalesDashboard,
  loadTopRevenueProducts,
  loadTopRevenueServices,
  updateLoadingState,
  updateDashBoardName
} from "../../store/dashboardSlice";
import {
  convertToTitleCase,
  formatDateDDMMYYYY,
  formatDateToWeekDayDDMMMYYYY,
  formatDateYYYYMMDD,
  formatDateYYYYMMDDD,
  getFirstAndLastDateOfCurrentMonthDDMMYYYY,
  getFirstDateOfCurrentMonth,
  getFirstDateOfCurrentMonthYYYYMMDD,
  getLastDateOfCurrentMonth,
  getLastDateOfCurrentMonthYYYYMMMDD,
} from "../../util/Helpers";
import PieChartBox from "./PieChartBox";
import { calculateTotalValue, processPieChartData } from "./PieData";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TextTheme from "../../constants/TextTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SalesDashboard = () => {
  const dispatch = useDispatch();

  const [selectedValue, setSelectedValue] = useState("today");
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

  // const date = formatDateDDMMYYYY();
  const getFormattedDate = () => formatDateYYYYMMDD(0);

  const getLast7thDayDate = () => formatDateYYYYMMDD(-7);
  const getLast30thDayDate = () => formatDateYYYYMMDD(-30);
  const lastMonthDate = getLastDateOfCurrentMonthYYYYMMMDD();
  const firstMonthDate = getFirstDateOfCurrentMonthYYYYMMDD();

  const { firstDateDDMMYYYY, lastDateDDMMYYYY } = getFirstAndLastDateOfCurrentMonthDDMMYYYY();

  // const isLoading = useSelector(state => state.dashboardDetails.isLoading);
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

  // const servicesChartData = topRevenueDetails[0].chart_series.map((value) => ({ value }));
  // const servicesTotalValue = servicesChartData.reduce((sum, item) => sum + item.value, 0);

  const servicesTotalValue = calculateTotalValue(
    topRevenueDetails[0].chart_series
  );
  // const productChartData = topProductDetails[0].chart_series.map((value) => ({ value }));
  // const productsTotalValue = productChartData.reduce((sum, item) => sum + item.value, 0);

  const productsTotalValue = calculateTotalValue(
    topProductDetails[0].chart_series
  );

  const data = billItemDetails[0].series.map((value) => ({ value })) || [];
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const percentageBillData = data.map((item, index) => {
    const percentage = totalValue
      ? ((item.value / totalValue) * 100).toFixed(1)
      : 0;
    return {
      value: item.value,
      text: percentage <= 2.0 ? "" : `${percentage}%`,
      color: pieChartColorCode[index]?.color || "#000", // Default color fallback
    };
  });

  // const percentageBillData1 = processPieChartData(billItemDetails[0].series);

  // const togglePieData = topRevenueDetails[0].services_list.map((item) => ({value: item.revenue,text: item.percent}));
  const togglePercentageData = processPieChartData(
    topRevenueDetails[0].services_list,
    "salesPercent"
  );
  // const togglePercentageData = togglePieData.map((item, index) => {
  //   // const percentage = ((item.value / totalValue) * 100).toFixed(1);
  //   // console.log(item.text);
  //   return {
  //     page:'salesPercent',
  //     value: item.value,
  //     text: item.text <= 3.0 ? "" : item.text.toFixed(1)+"%",
  //     color:pieChartColorCode[index].color
  //   };
  // });

  // const toggleProductPieData = topProductDetails[0].services_list.map((item) => ({value: item.revenue,text: item.percent}));
  // const toggleProductData = toggleProductPieData.map((item, index) => {
  //   // const percentage = ((item.value / totalValue) * 100).toFixed(1);
  //   // console.log(item.text);
  //   return {
  //     page:'salesProduct',
  //     value: item.value,
  //     text: item.text <= 3.0 ? "" : item.text.toFixed(1)+"%",
  //     color:pieChartColorCode[index].color
  //   };
  // });

  const toggleProductData = processPieChartData(
    topProductDetails[0].services_list,
    "salesProduct"
  );

  const valueMap = {
    "Total Appointments": listStoreData.totalAppointments,
    "Online Sales": listStoreData.onlineSales,
    "Cancelled bill count": listStoreData.cancelledBillCount,
    "Cancelled bill value": listStoreData.cancelledBillValue,
  };

  const { revenue, count, month } = revenueDetails[0];
  const maxRevenue = Math.max(...revenue);
  const maxCount = Math.max(...count);
  const normalizedCount = count.map((value) => (value / maxCount) * maxRevenue);

  const barData = month.flatMap((label, index) => {
    if (normalizedCount[index] === NaN) return;
    return [
      {
        value: revenue[index],
        label,
        frontColor: "#4A90E2",
        spacing: 2,
        labelWidth: 40,
        labelTextStyle: { color: "gray" },
      },
      {
        value: normalizedCount[index],
        frontColor: "#9B9BFF",
      },
    ];
  });

  const handleSelection = async (item) => {
    setSelectedValue(item.value);
    console.log("Selected range:", item);
    if (item.day1 === undefined) {
      setIsCustomRange(false);
      
      if (item.label !== "This month" && item.value !== "Custom range") {        
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
            formatDateYYYYMMDD(0)
          )
        );
      }
    } else if(item.label === "This month") {
      setIsCustomRange(false);
      setIsLoading(true);
      setDate(firstDateDDMMYYYY + " - " + lastDateDDMMYYYY);
      await dispatch(loadSalesDashboard(firstMonthDate, lastMonthDate));
    }
    else{
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
  };

  const handleCustomDate = async(type,date) => {
    if(type === 1){
      setCustomFromPassData(date);
      await dispatch(loadSalesDashboard(date, customToPassData));
    }
    else if(type === 2){
      setCustomToPassData(date);
      await dispatch(loadSalesDashboard(customFromPassData, date));
    }
    else return
  }

  useEffect(() => {
    dispatch(updateDashBoardName("Sales"))
    dispatch(loadSalesDashboard(formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)));
    dispatch(loadTopRevenueServices(firstMonthDate, lastMonthDate));
    dispatch(loadTopRevenueProducts(firstMonthDate, lastMonthDate));
  }, []);

  return (
    <ScrollView style={{ backgroundColor: Colors.white }}>
      <View style={styles.container}>
        <View style={isCustomRange ? styles.customRangeDateContainer : styles.dateContainer}>
          <Dropdown
            style={isCustomRange ? styles.customDropdown : styles.dropdown}
            data={dateData}
            labelField="label"
            valueField="value"
            value={selectedValue}
            onChange={handleSelection}
            placeholder="Today"
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
              handleCustomDate(1,formatDateYYYYMMDDD(date))
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
                handleCustomDate(2,formatDateYYYYMMDDD(date))
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
              />
            );
          })}
        </View>
        <View style={styles.listDataContainer}>
          {listData.map((item, index) => {
            const value = valueMap[item.title] || 0;
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

        <PieChartBox
          title={"Bill Items"}
          labelArray={billItemDetails[0].labels}
          pieDataArray={percentageBillData}
        />

        {/* Revenue Report Section with BarChart */}
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
              <BarChart
                data={barData}
                barWidth={10}
                spacing={50}
                yAxisTextNumberOfLines={100}
                yAxisLabelWidth={80}
                noOfSections={5}
                maxValue={Math.ceil(maxRevenue)}
                yAxisLabelTexts={(value) => Math.round(value).toString()}
                // maxValue={Math.ceil(maxRevenue / 100000) * 100000} // Rounds up to the nearest hundred thousand
                // yAxisLabelTexts={(value) => {
                //   // Format the value to round to nearest hundred thousand
                //   return `${(Math.round(value / 100000) * 100000).toLocaleString()}`;
                // }}
                xAxisLabelTextStyle={{ color: "gray", fontSize: 12 }}
              />
            }
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#4A90E2" }]}
                />
                <Text style={styles.legendText}>Bill count</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#9B9BFF" }]}
                />
                <Text style={styles.legendText}>Bill value</Text>
              </View>
            </View>
          </View>
        </View>
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
          showPie={togglePercentageData.length !== 0}
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
          showPie={toggleProductData.length !== 0}
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    overflow: "hidden",
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
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "45%",
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
