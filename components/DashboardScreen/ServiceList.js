import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextTheme from "../../constants/TextTheme";

const ServiceList = (props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 8,
      }}
    >
      <Text style={[TextTheme.bodyMedium]}>{props.title}</Text>
      <Text style={[TextTheme.titleSmall]}>
        {"₹ " + (props.value === undefined ? "0" : props.value)}
      </Text>
    </View>
  );
};

export default ServiceList;
