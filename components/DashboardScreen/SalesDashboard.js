import {FlatList,Image,ScrollView,StyleSheet,Text,View,} from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "../../constants/Colors";
import {listData,paymentData,pieChartColorCode,salesCardData,salesData,} from "../../data/DashboardSelection";
import DashboardCard from "../../ui/DashboardCard";
import ListIconData from "./ListIconData";
import { Divider } from "react-native-paper";
import textTheme from "../../constants/TextTheme";
import ServiceList from "./ServiceList";
import {BarChart,LineChart,PieChart,PopulationPyramid} from "react-native-gifted-charts";
import { useDispatch, useSelector } from "react-redux";
import { loadSalesDashboard, loadTopRevenueProducts, loadTopRevenueServices } from "../../store/dashboardSlice";
import { convertToTitleCase, formatDateYYYYMMDD, getFirstDateOfCurrentMonth, getFirstDateOfCurrentMonthYYYYMMDD, getLastDateOfCurrentMonth, getLastDateOfCurrentMonthYYYYMMMDD } from "../../util/Helpers";
import PieChartBox from "./PieChartBox";

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState("today");

  const date = formatDateYYYYMMDD();
  const getFormattedDate = () => formatDateYYYYMMDD(0);
  const getLast7thDayDate = () => formatDateYYYYMMDD(-7);
  const getLast30thDayDate = () => formatDateYYYYMMDD(-30);
  const lastMonthDate = getLastDateOfCurrentMonthYYYYMMMDD();
  const firstMonthDate = getFirstDateOfCurrentMonthYYYYMMDD();

  const dateData = useSelector(state => state.dashboardDetails.dateData);
  const expenseValues = useSelector(state => state.dashboardDetails.expenseValues);
  const listStoreData = useSelector(state => state.dashboardDetails.listData);
  const paymentStoreData = useSelector(state => state.dashboardDetails.paymentModeSummary);
  const totalSalesRevenue = useSelector(state => state.dashboardDetails.totalSalesRevenue);
  const billItemDetails = useSelector(state => state.dashboardDetails.billItemDetails);
  const revenueDetails = useSelector(state => state.dashboardDetails.revenueReport6months);
  const topRevenueDetails = useSelector( state => state.dashboardDetails.topRevenueServiceDetails);
  const topProductDetails = useSelector( state => state.dashboardDetails.topRevenueProductDetails)
  
  const data = billItemDetails[0].series.map((value) => ({ value }));
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const percentageData = data.map((item, index) => {
    const percentage = ((item.value / totalValue) * 100).toFixed(1);
    return {
      value: item.value,
      text: percentage <= 2.0 ? "" : `${percentage}%`,
      color: pieChartColorCode[index].color,
    };
  });
  // console.log(topRevenueDetails.services_list);
  
  const togglePieData = topRevenueDetails[0].services_list.map((item) => ({value: item.revenue,text: item.percent}));
  const togglePercentageData = togglePieData.map((item, index) => {
    // const percentage = ((item.value / totalValue) * 100).toFixed(1);
    // console.log(item.text);
    return {
      value: item.value,
      text: item.text <= 3.0 ? "" : item.text.toFixed(1)+"%",
      color:pieChartColorCode[index].color
    };
  });
  const toggleProductPieData = topProductDetails[0].services_list.map((item) => ({value: item.revenue,text: item.percent}));
  const toggleProductData = toggleProductPieData.map((item, index) => {
    // const percentage = ((item.value / totalValue) * 100).toFixed(1);
    // console.log(item.text);
    return {
      value: item.value,
      text: item.text <= 3.0 ? "" : item.text.toFixed(1)+"%",
      color:pieChartColorCode[index].color
    };
  });
  // console.log(togglePercentageData);

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

  const handleSelection = (item) => {
    setSelectedValue(item.value);
    console.log("Selected range:", item.label);
  };

  
  useEffect(() => {
    dispatch(loadSalesDashboard(formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)));
    dispatch(loadTopRevenueServices(firstMonthDate,lastMonthDate))
    dispatch(loadTopRevenueProducts(firstMonthDate,lastMonthDate))
  }, []);

  return (
    <ScrollView style={{ backgroundColor: Colors.white }}>
      <View style={styles.container}>
        <View style={styles.dateContainer}>
          <Dropdown
            style={styles.dropdown}
            data={dateData}
            labelField="label"
            valueField="value"
            value={selectedValue}
            onChange={handleSelection}
            placeholder="Today"
          />
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>

        {/* Reusable Statistic Cards */}
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

        {/* Payment Mode Section */}
        <View style={styles.commonContainer}>
          <Text
            style={[
              textTheme.titleMedium,
              { paddingLeft: 20, paddingBottom: 16, paddingTop: 8 },
            ]}
          >
            Payment Mode
          </Text>
          {paymentStoreData.length > 0 ? paymentStoreData.map((item, index) => {
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
          : <Text style={{textAlign:'center',marginBottom:20}}>No data found! </Text>
          }
        </View>

        {/* Total Sales Section */}
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

        <PieChartBox title={"Bill Items"} labelArray={billItemDetails[0].labels} pieDataArray={percentageData} totalCenterValue={totalValue}/>

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
          pieDataArray={togglePercentageData}
          totalCenterValue={totalValue}
          toggleDropdown
          toggleDateDropdown
          tableData={topRevenueDetails[0].services_list}
          toggleTitle={"Top 10 Revenue Services"}
          />
        <PieChartBox
          title={"Top Products"}
          pieDataArray={toggleProductData}
          totalCenterValue={totalValue}
          toggleDropdown
          toggleDateDropdown
          tableData={topProductDetails[0].services_list}
          toggleTitle={"Top 10 Revenue Products"}
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
  },
  dropdown: {
    width: "35%",
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
    width: "65%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
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
});
