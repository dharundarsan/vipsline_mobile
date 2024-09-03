import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import Entypo from "@expo/vector-icons/Entypo";
import CustomTextInput from "../../ui/CustomTextInput";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import textTheme from "../../constants/TextTheme";
const MiniActionTextModal = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };
  return (
    <Modal transparent={true} visible={props.isVisible} animationType="fade">
      <TouchableOpacity
        // onPress={props.onCloseModal}
        activeOpacity={1}
        style={styles.modalOverlay}
      >
        <KeyboardAvoidingView
          behavior="position"
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalTitle}>
              <Text></Text>
              <Text style={[textTheme.titleLarge, styles.deleteClientText]}>
                {props.title}
              </Text>
              <Entypo
                name="cross"
                size={24}
                color="black"
                onPress={props.onCloseModal}
              />
            </View>
            <FlatList
              data={props.data}
              style={styles.flatList}
              renderItem={({ item }) => {
                console.log(item);
                return (
                  <View style={{ marginTop: 10 }}>
                    <Text style={TextTheme.bodyMedium}>{item.header}</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        item.typeToggle !== 0 && {
                          flexDirection: "row",
                          alignItems: "center",
                        },
                      ]}
                    >
                      {item.boxType === "multiLineBox" ? (
                        <View>
                          <CustomTextInput type={"multiLine"} />
                        </View>
                      ) : item.boxType === "textBox" ? (
                        <TextInput
                          style={styles.textInputBox}
                          onChangeText={(value) => {
                            props.setDiscountValue(value);
                          }}
                          keyboardType="number-pad"
                        />
                      ) : item.boxType === "priceBox" ? (
                        <View style={styles.priceBoxContainer}>
                          <FontAwesome
                            name="rupee"
                            size={20}
                            color="black"
                            style={styles.rupeeIcon}
                          />
                          <TextInput style={styles.priceTextInput} />
                        </View>
                      ) : null}
                      {item.typeToggle !== 0 ? (
                        <View style={styles.toggleBox}>
                          <TouchableOpacity
                            style={[
                              styles.optionButton,
                              selectedOption === "percentage" &&
                                styles.selectedOption,
                            ]}
                            onPress={() => handleOptionSelect("percentage")}
                          >
                            <FontAwesome6
                              name="percentage"
                              size={20}
                              color={
                                selectedOption === "percentage"
                                  ? "white"
                                  : "black"
                              }
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.optionButton,
                              selectedOption === "rupee" &&
                                styles.selectedOption,
                            ]}
                            onPress={() => handleOptionSelect("rupee")}
                          >
                            <FontAwesome
                              name="rupee"
                              size={20}
                              color={
                                selectedOption === "rupee" ? "white" : "black"
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              }}
            />
            <View style={styles.actionButton}>
              <TouchableOpacity onPress={() => {}} style={styles.closeAction}>
                <Text
                  style={[
                    { color: Colors.error, textAlign: "center" },
                    TextTheme.labelLarge,
                  ]}
                >
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.saveAction}>
                <Text
                  style={[
                    { color: Colors.white, textAlign: "center" },
                    TextTheme.labelLarge,
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    backgroundColor: Colors.ripple,
  },
  modalContent: {
    width: "100%",
    backgroundColor: Colors.white,
    // padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    elevation: 0.4,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatList: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: Colors.ripple,
  },
  inputContainer: {
    marginTop: 10,
  },
  textInputBox: {
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 3,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.ripple,
    marginRight: 10,
  },
  toggleBox: {
    flexDirection: "row",
    height: 40,
    borderWidth: 1,
    borderColor: Colors.ripple,
    justifyContent: "space-between",
    flex: 1,
  },
  optionButton: {
    padding: 5,
    flexGrow: 1,
    alignItems: "center",
    // padding: 10,
    // borderRadius: 5,
  },
  selectedOption: {
    flexGrow: 1,
    backgroundColor: Colors.highlight,
  },
  actionButton: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    margin: 20,
    // borderTopWidth: 0.6,
  },
  closeAction: {
    padding: 10,
    borderWidth: 1,
    flex: 3,
    borderColor: Colors.ripple,
    borderRadius: 6,
  },
  saveAction: {
    padding: 10,
    backgroundColor: Colors.green,
    flex: 7,
    borderRadius: 6,
  },
  priceBoxContainer: {
    width: "97%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.ripple,
    padding: 5,
    borderRadius: 5,
  },
  rupeeIcon: {
    fontWeight: 1,
    marginRight: 10,
    paddingHorizontal: 6,
    borderRightColor: Colors.ripple,
    borderRightWidth: 0.9,
  },
  priceTextInput: {
    flex: 1,
    paddingVertical: 0,
  },
});

export default MiniActionTextModal;
