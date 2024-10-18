import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import ListIconData from "./ListIconData";
import { lifetimeData } from "../../data/DashboardSelection";
import { useDispatch, useSelector } from "react-redux";
import {
  loadClientStatistics,
  loadRevenueByGender,
} from "../../store/dashboardSlice";
import {
  formatDateYYYYMMDDD,
  getFirstDateOfCurrentMonthYYYYMMDD,
} from "../../util/Helpers";
import PieChartBox from "./PieChartBox";

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const clientStatistics = useSelector((state) => state.dashboardDetails.clientStatistics);
  const revenueGenderData = useSelector( state => state.dashboardDetails.revenueByGender);

  const convertRevenueData = revenueGenderData[0].chart_series.map((item,index)=>{
    return{
      value:item,
    }
  })
  console.log(convertRevenueData);
  
  const valueMap = {
    "Lifetime Unique Clients": clientStatistics[0].repeat_clients,
    "Lifetime Repeat Clients": clientStatistics[0].unique_clients,
    "Unique Clients Till Date": clientStatistics[0].unique_clients_till_date,
  };
  const monthStartDate = getFirstDateOfCurrentMonthYYYYMMDD();
  const currentDate = formatDateYYYYMMDDD();

  useEffect(() => {
    dispatch(loadClientStatistics());
    dispatch(loadRevenueByGender(monthStartDate, currentDate));
  }, []);
  return (
    <ScrollView style={{ backgroundColor: Colors.white }}>
      <View style={styles.lifetimeDataHeader}>
        <View>
          <Text style={TextTheme.bodyLarge}>Lifetime Client Statistics</Text>
          <View style={styles.listDataContainer}>
            {lifetimeData.map((item, index) => {
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
        </View>
        <PieChartBox title={"Revenue By Gender"} labelArray={revenueGenderData[0].label_list} />
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
  },
});
