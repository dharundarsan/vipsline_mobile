import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import TextTheme from "../constants/TextTheme";
import PopoverIconText from "./PopoverIconText";
import PropTypes from 'prop-types';
const ListIconData = (props) => {
  return (
    <View style={styles.listData}>
      <View style={[styles.headerContainer,props.headerContainerStyle]}>
        <Image
          source={props.icon}
          style={styles.icon}
        />
        {
          props.titlePopoverEnabled ?
            <PopoverIconText title={props.title} popoverText={props.titlePopoverText} containerStyle={[{ alignSelf: 'center' }, props.popoverContainerStyle]} popoverArrowShift={0.24} />
            : <Text style={{ alignSelf: 'center' }}>{props.title}</Text>
        }
      </View>
      <Text style={TextTheme.titleSmall}>{props.value}</Text>
    </View>
  );
};


ListIconData.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  value: PropTypes.any,
  titlePopoverEnabled: PropTypes.bool,
  titlePopoverText: PropTypes.string,
  popoverContainerStyle: PropTypes.object,
  headerContainerStyle: PropTypes.object
}

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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
