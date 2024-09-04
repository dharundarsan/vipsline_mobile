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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import { Feather, MaterialIcons } from "@expo/vector-icons";
const MiniActionTextModal = (props) => {
  const [selectedDiscountMode, setSelectedDiscountMode] = useState("PERCENTAGE")
  // const handleOptionSelect = (option) => {
  //   setSelectedOption(option);
  // };
  console.log(props.clickedValue);
  
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
              <TouchableOpacity style={({ pressed }) => [
                  { opacity: pressed ? 1 : 1 }
                ]}
                onPress={props.onCloseModal}
                >
              <Entypo
                name="cross"
                size={24}
                color="black"
              />
              </TouchableOpacity>
            </View>
            <FlatList
              data={props.data}
              style={styles.flatList}
              renderItem={({ item }) => {
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
                          <CustomTextInput type={"multiLine"} onChangeText={props.onChangeValue} />
                        </View>
                      ) : item.boxType === "textBox" ? (
                        <TextInput
                          style={styles.textInputBox}
                          onChangeText={(value) => {
                            props.setDiscountValue(value);
                          }}
                          value={props.discountValue.toString()}
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
                          <PrimaryButton
                            onPress={() => {
                              // props.setSelectedDiscountMode("PERCENTAGE");
                              setSelectedDiscountMode("PERCENTAGE");
                            }}
                            buttonStyle={[
                              styles.percentAndAmountButton,
                              // props.selectedDiscountMode === "PERCENTAGE"
                              selectedDiscountMode === "PERCENTAGE"
                                ? { backgroundColor: Colors.highlight }
                                : {},
                              {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                marginLeft: 10,
                              },
                            ]}
                            pressableStyle={styles.percentAndAmountPressable}
                          >
                            <Feather
                              name="percent"
                              size={20}
                              color={
                                // props.selectedDiscountMode === "PERCENTAGE"
                                selectedDiscountMode === "PERCENTAGE"
                                  ? Colors.white
                                  : Colors.black
                              }
                            />
                          </PrimaryButton>
                          <PrimaryButton
                            onPress={() => {
                              // props.setSelectedDiscountMode("AMOUNT");
                              setSelectedDiscountMode("AMOUNT");
                            }}
                            buttonStyle={[
                              styles.percentAndAmountButton,
                              // props.selectedDiscountMode === "AMOUNT"
                              selectedDiscountMode === "AMOUNT"
                                ? { backgroundColor: Colors.highlight }
                                : {},
                              {
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                              },
                            ]}
                            pressableStyle={styles.percentAndAmountPressable}
                          >
                            <MaterialIcons
                              name="currency-rupee"
                              size={20}
                              color={
                                // props.selectedDiscountMode === "AMOUNT"
                                selectedDiscountMode === "AMOUNT"
                                  ? Colors.white
                                  : Colors.black
                              }
                            />
                          </PrimaryButton>
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              }}
            />
            <View style={styles.actionButton}>
              <TouchableOpacity
                onPress={() => {
                  if (props.clickedValue === "Apply Discount") {
                    console.log(selectedDiscountMode);
                    props.addDiscount(selectedDiscountMode,"clear");
                  }
                  else if(props.clickedValue === "Add Sales Notes"){
                    console.log(props.onChangeValue);
                  }
                }}
                style={styles.closeAction}>
                <Text
                  style={[
                    { color: Colors.error, textAlign: "center" },
                    TextTheme.labelLarge,
                  ]}
                >
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                if(props.clickedValue === "Apply Discount"){
                  console.log(selectedDiscountMode);
                  if(props.discountValue.trim().length === 0) return
                  props.addDiscount(selectedDiscountMode);
                }
              }} style={styles.saveAction}>
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
  toggleBox: {
    flexDirection: "row",
    // width: "100%",  // Ensure the toggleBox takes the full width of the parent container
  },
  percentAndAmountButton: {
    // flex: 1, 
    width: 50,
    borderColor: Colors.grey400,
    borderWidth: 1,
    backgroundColor: Colors.background,
  },
  percentAndAmountPressable: {
    paddingVertical: 10,  // Adjust padding if necessary
    paddingHorizontal: 0,
    alignItems: "center",  // Center the content within the button
    justifyContent: "center",
    width: "100%",  // Ensure the pressable area covers the full button width
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
    height: 50,
    borderWidth: 1,
    borderColor: Colors.ripple,
    marginRight: 10,
  },
  optionButton: {
    padding: 5,
    flexGrow: 1,
    alignItems: "center",
    // padding: 10,
    // borderRadius: 5,
  },
  // selectedOption: {
  //     flexGrow: 1,
  //     backgroundColor: Colors.highlight,
  // },
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
    backgroundColor: Colors.green,
    padding: 10,
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
