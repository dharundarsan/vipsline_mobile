import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import PopoverIconText from "../../ui/PopoverIconText";

const ListIconData = (props) => {
  return (
    <View style={styles.listData}>
      <View style={styles.headerContainer}>
        <Image
          source={props.icon}
          style={styles.icon}
        />
        {
          props.titlePopoverEnabled ?
            <PopoverIconText title={props.title} popoverText={props.titlePopoverText} containerStyle={[{ alignSelf: 'center' },props.popoverContainerStyle]} popoverArrowShift={0.24}/>
            : <Text style={{ alignSelf: 'center' }}>{props.title}</Text>
        }
      </View>
      <Text style={TextTheme.titleSmall}>{props.value}</Text>
    </View>
  );
};

export default ListIconData;

const styles = StyleSheet.create({
  listData: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    // Adding shadow
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow color
    shadowOffset: { width: 0, height: 2 }, // Slight shadow offset
    shadowOpacity: 0.1, // Mild shadow
    shadowRadius: 4, // Soft shadow spread
  },
  icon: {
    width: 24,
    height: 24,
  },
  headerContainer: {
    flexDirection: "row",
    gap: 10,
    width: '80%'
  },
});
