import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import { shadowStyling } from "../../util/Helpers";
import TextTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { staffDetails } from "../../data/DashboardSelection";
import { Divider } from "react-native-paper";
import * as Haptics from "expo-haptics";

const StaffDetailsModel = (props) => {
  
  const mappedStaffDetails = staffDetails.map((detail) => {
    return {
      name: detail.name,
      value: props.data[detail.key],
    };
  });

  return (
    <Modal
      visible={props.isVisible}
      animationType={"slide"}
      presentationStyle="pageSheet"
      onRequestClose={props.closeModal}
    >
      <View>
        <View style={[styles.headingAndCloseContainer, shadowStyling]}>
          <Text style={[TextTheme.titleMedium, { alignSelf: "center" }]}>
            {props.data.name || "Staff"}
          </Text>
          <PrimaryButton
            buttonStyle={styles.closeButton}
            onPress={() => {
              Haptics.selectionAsync();
              // setIsModalVisible(false);
              props.closeModal();
            }}
          >
            <Ionicons name="close" size={25} color="black" />
          </PrimaryButton>
        </View>
        <View>
          {mappedStaffDetails.map((item, index) => {
            return (
              <>
                <View key={index} style={styles.container}>
                  <Text>{item.name}</Text>
                  <Text>₹ {item.value || 0}</Text>
                </View>
                <Divider />
              </>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

export default StaffDetailsModel;

const styles = StyleSheet.create({
  headingAndCloseContainer: {
    // marginTop: Platform.OS === "ios" ? 50 : 0,
    paddingHorizontal: 20,
    flexDirection: "row",
    paddingVertical: 15,
    justifyContent: "space-between",
  },
  closeButton: {
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    // alignItems:'center'
  },
});
