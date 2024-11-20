import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import Colors from "../constants/Colors";
import { dashboardSelection } from "../data/DashboardSelection";
import { TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDataContext } from "../context/DataFlowContext";
import { useLocationContext } from "../context/LocationContext";

export default function DashboardScreen() {
  const navigate = useNavigation();
  const {setIsDashboardPage} = useDataContext();
  const {getLocation} = useLocationContext()
  useFocusEffect(useCallback(() => {
    getLocation("Dashboard");
  }, []))

  return (
    <View style={styles.container}>
      <View style={styles.cardcontainer}>
        {dashboardSelection.map((item, index) => {
          return (
            <TouchableOpacity key={index} style={styles.card} activeOpacity={0.4} onPress={() => {
              // setTimeout(() => {
                // setIsDashboardPage(false);
                // setTimeout(() => {
                  navigate.navigate(item.navigate);
                // }, 50);
              // }, 5); 
            }}>
              <View style={styles.headerContainer}>
                <Image
                  source={item.icon}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
                <Text style={styles.header}>{item.header}</Text>
              </View>
              <Text style={{ paddingTop: 10 }}>
                Dashboard of your business performance
              </Text>
            </TouchableOpacity>
          );
        })}
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