import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import PoppoverIconText from "./PopoverIconText";
const DashboardCard = (props) => {
  const getFontSize = (value) => {
    if (value > 1000000) {
      return 12;
    } else if (value > 100000) {
      return 14;
    } else {
      return 16;
    }
  };
  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.leftBar, { backgroundColor: props.color }]}></View>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Image source={props.icon} style={styles.icon} />
          {props.popoverText !== undefined ?
            <PoppoverIconText popoverText={props.popoverText} title={props.title} popoverOffset={Platform.OS === "ios" ? 0 : -32} />
            :
            <Text style={[styles.title]}>{props.title}</Text>
          }
        </View>
        <Text style={[styles.count, { fontSize: getFontSize(props.value) }]}>
          {props.title !== "Total Bill Count"
            ? "₹ " + props.value
            : props.value}
        </Text>
      </View>
    </View>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  cardWrapper: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "white",
    overflow: "hidden",
    width: "45%",
    borderWidth: 1,
    borderColor: Colors.grey250,
    // Adding shadow
    // elevation: 3,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  popoverStyle: {
    padding: 12
  },
  leftBar: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: 17,
    // backgroundColor:"grey",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 5,
  },
  checkoutDetailInnerContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    color: "#101928",
    opacity: 0.6,
    fontSize: 13,
    textAlign: "center"
  },
  count: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#101928",
  },
//   calculatepriceRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 5,
//     paddingHorizontal: 5,
// },
});
