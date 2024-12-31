import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import ListIconData from "./ListIconData";
import {
  clientPieColorCode,
  lifetimeData,
  prepaidNonPrepaidColorCode,
} from "../../data/DashboardSelection";
import { useDispatch, useSelector } from "react-redux";
import {
  loadClientStatistics,
  loadRevenueByGender,
  loadRevenueByPrepaid,
  loadRevenueCountByGender,
  updateDashBoardName
} from "../../store/dashboardSlice";
import {
  formatDateYYYYMMDDD,
  getFirstDateOfCurrentMonthYYYYMMDD,
} from "../../util/Helpers";
import PieChartBox from "./PieChartBox";
import ContentLoader from "react-native-easy-content-loader";
import { useFocusEffect } from "@react-navigation/native";
import { useLocationContext } from "../../context/LocationContext";
import { calculateTotalValue } from "./PieData";

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const { getLocation } = useLocationContext();

  const [isPageLoading, setIsPageLoading] = useState(false);

  const clientStatistics = useSelector((state) => state.dashboardDetails.clientStatistics);
  const revenueGenderData = useSelector((state) => state.dashboardDetails.revenueByGender);
  const revenueCountGenderData = useSelector((state) => state.dashboardDetails.revenueCountByGender);
  const revenuePrepaidData = useSelector((state) => state.dashboardDetails.revenueCountByPrepaid);

  const totalValue = revenueGenderData[0]?.chart_series.reduce((acc, val) => acc + val, 0) || 0;
  const totalCountValue = revenueCountGenderData[0]?.chart_series.reduce((acc, val) => acc + val, 0) || 0;
  const totalPrepaidValue = revenuePrepaidData[0]?.chart_series.reduce((acc, val) => acc + val, 0) || 0;
  const revenueGenderDataLabelList = revenueGenderData[0]?.label_list ?? [];
  const convertRevenueData = revenueGenderData[0]?.chart_series.map(
    (item, index) => {
      const percentage = ((item / totalValue) * 100).toFixed(1);
      return {
        page: "clientGender",
        value: item,
        color: clientPieColorCode[index]?.color || "#999999",
        text: percentage <= 3 ? "" : percentage + "%",
        tooltipText: revenueGenderDataLabelList[index]
      };
    }
  ) || [
      {
        page: "clientGender",
        value: 1,
        color: clientPieColorCode[0]?.color || "#999999",
        text: "error",
        tooltipText: "1"
      },
    ];
  const revenueCountGenderDataLabelList = revenueCountGenderData[0]?.label_list;
  const convertRevenueCountData =
    revenueCountGenderData[0]?.chart_series.map((item, index) => {
      const percentage = ((item / totalCountValue) * 100).toFixed(1);
      return {
        page: "clientCount",
        value: item,
        color: clientPieColorCode[index]?.color || "#999999",
        text: percentage <= 3 ? "" : percentage + "%",
        tooltipText: revenueCountGenderDataLabelList[index],
        // textSize:32
      };
    }) || [
      {
        page: "clientCount",
        value: 1,
        color: clientPieColorCode[0]?.color || "#E9ECF1",
        text: "error",
        tooltipText: "1"
      }
    ];
  const revenuePrepaidDataLabelList = revenuePrepaidData[0].label_list ?? [];
  const convertRevenuePrepaidData =
    revenuePrepaidData[0]?.chart_series.map((item, index) => {
      const percentage = ((item / totalPrepaidValue) * 100).toFixed(1);
      return {
        page: "clientRedemption",
        value: item,
        color: prepaidNonPrepaidColorCode[index]?.color || "#999999",
        text: percentage <= 3 ? "" : percentage + "%",
        tooltipText: revenuePrepaidDataLabelList[index]
      };
    }) || [{
      page: "clientRedemption",
      value: 1,
      color: prepaidNonPrepaidColorCode[0]?.color || "#999999",
      text: "error",
      tooltipText: "1"
    }];

  const valueMap = {
    "Lifetime Unique Clients": clientStatistics[0]?.unique_clients || 0,
    "Lifetime Repeat Clients": clientStatistics[0]?.repeat_clients || 0,
    "Unique Clients Till Date":
      clientStatistics[0]?.unique_clients_till_date || 0,
  };

  const monthStartDate = getFirstDateOfCurrentMonthYYYYMMDD();
  const currentDate = formatDateYYYYMMDDD();

  useEffect(() => {
    async function initialRender() {
      setIsPageLoading(true)
      await dispatch(updateDashBoardName("Client"))
      await dispatch(loadClientStatistics());
      await dispatch(loadRevenueByGender(monthStartDate, currentDate));
      await dispatch(loadRevenueCountByGender(monthStartDate, currentDate));
      await dispatch(loadRevenueByPrepaid(monthStartDate, currentDate));
      setIsPageLoading(false)
    }
    initialRender();
  }, []);

  useFocusEffect(useCallback(() => {
    getLocation("Client Dashboard");
  }, []))
  const prepaidVsRedemptionTotalValue = calculateTotalValue(revenuePrepaidData[0].chart_series);
  
  const labelArray = useSelector((state) => state.dashboardDetails.toggleDateData);

  return (
    <ScrollView style={{ backgroundColor: Colors.white }}>

      <View style={styles.lifetimeDataHeader}>
        <View style={{ width: "100%" }}>
          <Text style={[TextTheme.bodyLarge, { textAlign: "center" }]}>
            Lifetime Client Statistics
          </Text>
          {isPageLoading ?
            <View style={{ marginVertical: "5%", rowGap: 20, width: '100%' }}>
              <ContentLoader
                pRows={1}
                pHeight={[40]}
                pWidth={["100%"]}
                active
                title={false}
              />
              <ContentLoader
                pRows={1}
                pHeight={[40]}
                pWidth={["100%"]}
                active
                title={false}

              />
              <ContentLoader
                pRows={1}
                pHeight={[40]}
                pWidth={["100%"]}
                active
                title={false}
              />
            </View>
            :
            <View style={styles.listDataContainer}>
              {lifetimeData.map((item, index) => {
                const value = valueMap[item.title] || 0;
                return (
                  <ListIconData
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    value={value}
                    titlePopoverEnabled
                    titlePopoverText={item.titlePopoverText}
                    popoverContainerStyle={{width:"100%"}}
                  />
                );
              })}
            </View>
          }
        </View>
        <PieChartBox
          title={"Revenue By Gender"}
          labelArray={revenueGenderData[0]?.label_list || []}
          pieDataArray={convertRevenueData}
          dateArray={labelArray}
          toggleDateDropdown
        />
        <PieChartBox
          title={"Walk-In by Gender"}
          labelArray={revenueCountGenderData[0]?.label_list || []}
          pieDataArray={convertRevenueCountData}
          dateArray={labelArray}
          toggleDateDropdown
        />
        <PieChartBox
          dateArray={labelArray}
          title={"Prepaid vs Non-Prepaid Redemption"}
          labelArray={revenuePrepaidData[0]?.label_list || []}
          pieDataArray={convertRevenuePrepaidData}
          toggleDateDropdown
          totalCenterValue={prepaidVsRedemptionTotalValue}
        />
      </View>
    </ScrollView>
  );
};

export default ClientDashboard;

const styles = StyleSheet.create({
  lifetimeDataHeader: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  listDataContainer: {
    width: "100%",
    marginBottom:'3%'
  },
});
