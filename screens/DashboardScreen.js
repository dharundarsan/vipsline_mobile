import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import Colors from "../constants/Colors";
import { dashboardSelection } from "../data/DashboardSelection";
import { TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDataContext } from "../context/DataFlowContext";
import { useLocationContext } from "../context/LocationContext";
import { useDispatch, useSelector } from "react-redux";
import { formatDateYYYYMMDD, getFirstDateOfCurrentMonthYYYYMMDD, getLastDateOfCurrentMonthYYYYMMMDD } from "../util/Helpers";
import { updateDate, updateLabelDate } from "../store/dashboardSlice";

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const {setIsDashboardPage} = useDataContext();
  const {getLocation} = useLocationContext()

  useFocusEffect(useCallback(() => {
    getLocation("Dashboard");
  }, []))

  const date = useSelector(state => state.dashboardDetails.dateData);
  const labelData = useSelector(state => state.dashboardDetails.toggleDateData);

  useEffect(()=>{
    date.map((item,index)=>{
      if(item.day !== undefined){
        const datedata = formatDateYYYYMMDD(item.day);
        // console.log(index,datedata);
        dispatch(updateDate({type:index,data:datedata}))
      }
      else if(item.value === "This month"){
        console.log(123);
        dispatch(updateDate({type:index,day1:getFirstDateOfCurrentMonthYYYYMMDD(),day2:getLastDateOfCurrentMonthYYYYMMMDD()}))
      }
      else{
        dispatch(updateDate({type:index,day1:item.day1,day2:item.day2}))
      }
    })
    labelData.map((item,index)=>{
      if(item.day !== undefined){
        const datedata = formatDateYYYYMMDD(item.day);
        // console.log(index,datedata);
        dispatch(updateLabelDate({type:index,data:datedata}))
      } 
    })
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.cardcontainer}>
        <FlatList
        data={dashboardSelection}
        keyExtractor={(item)=>item.header.toString()}
        renderItem={(item)=>{
          return(
          <TouchableOpacity style={styles.card} activeOpacity={0.4} onPress={() => {
            setTimeout(() => {
              setIsDashboardPage(false);
              setTimeout(() => {
                navigate.navigate(item.item.navigate);
              }, 50);
            }, 5); 
          }}>
            <View style={styles.headerContainer}>
              <Image
                source={item.item.icon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <Text style={styles.header}>{item.item.header}</Text>
            </View>
            <Text style={{ paddingTop: 10 }}>
              {item.item.desc}
            </Text>
          </TouchableOpacity>
          )
        }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  cardcontainer: {
    padding: 30,
    flex:1
  },
  card: {
    borderColor: Colors.grey250,
    borderRadius: 6,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginVertical:10
  },
  headerContainer:{
    flexDirection:'row',
    alignItems:"center",
    columnGap:8
  },
  header: {
    fontFamily: "Inter-Bold",
    fontSize: 15,
  },
});
