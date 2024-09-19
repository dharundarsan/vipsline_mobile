import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import Entypo from "@expo/vector-icons/Entypo";
import CustomTextInput from "../../ui/CustomTextInput";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { shadowStyling } from "../../util/Helpers";
const MiniActionTextModal = React.memo((props) => {
  const dispatch = useDispatch();
  const [selectedDiscountMode, setSelectedDiscountMode] = useState("PERCENTAGE")
  const [errorHandler, setErrorHandler] = useState({
    discount: false,
    charges: [],
    salesNote: false
  })
  const addMoreInputs = () => {
    props.setChargesInputData((prev) => {
      const lastId = prev.length > 1 ? prev[prev.length - 1].index : 0;
      return [
        ...prev,
        { index: lastId + 1, name: "", amount: "" } // Increment the last ID
      ];
    });
  };
  const removeInput = (idToRemove) => {
    props.setChargesInputData((prev) => {
      if (idToRemove === 0) return prev; // Prevent removing the first item if needed
      const updatedInputs = prev.filter((item) => item.index !== idToRemove);

      return updatedInputs.map((item, index) => ({
        ...item,
        index: index, // Reassign sequential IDs
      }));
    });
  };
  const getChargeData = useSelector(state => state.cart.chargesData);
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent={true} visible={props.isVisible} animationType="fade">
      <TouchableOpacity
        // onPress={props.onCloseModal}
        activeOpacity={1}
        style={styles.modalOverlay}
      >
        <KeyboardAvoidingView
          behavior="position"
          style={{
            maxHeight: "80%", backgroundColor: Colors.white,
            paddingBottom: insets.bottom
          }}
        >
          <SafeAreaView style={{ maxHeight: "85%" }}>
            <View style={styles.modalContent}>
              <View style={[styles.modalTitle,shadowStyling]}>
                <Text></Text>
                <Text style={[textTheme.titleLarge, styles.deleteClientText]}>
                  {props.title}
                </Text>
                <TouchableOpacity style={({ pressed }) => [
                  { opacity: pressed ? 1 : 1 }
                ]}
                  onPress={() => {
                    if (props.clickedValue === "Add Charges") {
                      // Access Redux state and update chargesInputData
                      let updatedChargeData = getChargeData.map(item => ({
                        ...item,
                        amount: Number(item.amount) // Convert amount to a number
                      }));
                      if (updatedChargeData.index === undefined) {
                        updatedChargeData = [{ index: 0 }];
                      }
                      props.setChargesInputData(updatedChargeData);
                    }
                    // Close the modal regardless of clickedValue
                    props.onCloseModal();

                  }}
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
                    <View style={{ marginTop: 0 }}>
                      {item.header ?
                        <Text style={[TextTheme.bodyMedium, errorHandler.discount || errorHandler.salesNote ?
                          { color: Colors.error } : null]}>{item.header}</Text>
                        : null
                      }
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
                            <CustomTextInput type={"multiLine"} onChangeText={props.onChangeValue} value={props.salesNote} textInputStyle={errorHandler.salesNote ?
                              { borderColor: Colors.error } : null} />
                          </View>
                        ) : item.boxType === "textBox" ? (
                          <TextInput
                            style={[styles.textInputBox, errorHandler.discount ? { borderColor: Colors.error } : null]}
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
                                props.setSelectedDiscountMode("PERCENTAGE");
                                setSelectedDiscountMode("PERCENTAGE");
                              }}
                              buttonStyle={[
                                styles.percentAndAmountButton,
                                // props.selectedDiscountMode === "PERCENTAGE"
                                props.selectedDiscountMode === "PERCENTAGE"
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
                                  props.selectedDiscountMode === "PERCENTAGE"
                                    ? Colors.white
                                    : Colors.black
                                }
                              />
                            </PrimaryButton>
                            <PrimaryButton
                              onPress={() => {
                                props.setSelectedDiscountMode("AMOUNT");
                                setSelectedDiscountMode("AMOUNT");
                              }}
                              buttonStyle={[
                                styles.percentAndAmountButton,
                                // props.selectedDiscountMode === "AMOUNT"
                                props.selectedDiscountMode === "AMOUNT"
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
                                  props.selectedDiscountMode === "AMOUNT"
                                    ? Colors.white
                                    : Colors.black
                                }
                              />
                            </PrimaryButton>
                          </View>
                        ) : null}
                        {
                          item.boxType === "Charges" ? (
                            <ScrollView>
                              {props.chargesInputData.map((item, index) => {
                                const chargeError = errorHandler.charges[index]; // Access the error for the current index
                                return (
                                  <View key={index}>
                                    <View style={styles.itemContainer}>
                                      <Text
                                        style={[
                                          TextTheme.bodyMedium,
                                          styles.chargeHeader,
                                          chargeError?.nameError ? { color: Colors.error } : null // Apply error color if nameError is true
                                        ]}
                                      // onPress={() => removeInput(index)}
                                      >
                                        Item name
                                      </Text>
                                      {
                                        index !== 0 ?
                                      <TouchableOpacity
                                        onPress={() => removeInput(index)}>
                                        <Entypo
                                          name="cross"
                                          size={24}
                                          color="black"
                                        />
                                      </TouchableOpacity>
                                      : <View></View>
                                      }
                                    </View>
                                    <TextInput
                                      style={[
                                        styles.textInputBox,
                                        chargeError?.nameError ? { borderColor: Colors.error } : null // Apply error border color if nameError is true
                                      ]}
                                      value={item.name} // Track the value from the state
                                      onChangeText={(value) => {
                                        // Update the specific item in the state
                                        props.setChargesInputData((prev) =>
                                          prev.map((inputItem, idx) =>
                                            idx === index ? { ...inputItem, name: value } : inputItem
                                          )
                                        );
                                      }}
                                    />
                                    <Text
                                      style={[
                                        TextTheme.bodyMedium,
                                        styles.chargeHeader,
                                        chargeError?.amountError ? { color: Colors.error } : null
                                      ]}
                                    >
                                      Price
                                    </Text>
                                    <View style={[styles.chargePriceBoxContainer, chargeError?.amountError ? { borderColor: Colors.error } : null]}>
                                      <FontAwesome
                                        name="rupee"
                                        size={20}
                                        color="black"
                                        style={styles.rupeeIcon}
                                      />
                                      <TextInput
                                        style={styles.priceTextInput}
                                        keyboardType="number-pad"
                                        value={item.amount} // Track the value from the state
                                        onChangeText={(value) => {
                                          props.setChargesInputData((prev) =>
                                            prev.map((inputItem, idx) =>
                                              idx === index ? { ...inputItem, amount: value } : inputItem
                                            )
                                          );
                                        }}
                                      />
                                    </View>
                                  </View>
                                );
                              })}


                              <PrimaryButton
                                buttonStyle={styles.addItemsWithLogoButton}
                                onPress={addMoreInputs}
                              >
                                <View style={styles.addItemsWithLogoContainer}>
                                  <Text
                                    style={[TextTheme.titleMedium, styles.addItemWithLogo_text]}
                                  >
                                    Add Extra Charges
                                  </Text>
                                  <MaterialIcons
                                    name="add-circle-outline"
                                    size={24}
                                    color={Colors.highlight}
                                  />
                                </View>
                              </PrimaryButton>
                            </ScrollView>
                          ) : null
                        }
                      </View>
                    </View>
                  );
                }}
              />
              <View style={styles.actionButton}>
                <TouchableOpacity
                  onPress={() => {
                    if (props.clickedValue === "Apply Discount") {
                      props.addDiscount(selectedDiscountMode, "clear");
                    }
                    else if (props.clickedValue === "Add Sales Notes") {
                      props.clearSalesNotes();
                    }
                    else if (props.clickedValue === "Add Charges") {
                      props.clearCharges()

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
                <TouchableOpacity
                  onPress={async () => {
                    if (props.clickedValue === "Apply Discount") {
                      if (props.discountValue.trim().length === 0) {
                        setErrorHandler((prev) => ({
                          ...prev,
                          discount: true
                        }));
                        return;
                      }
                      props.addDiscount(selectedDiscountMode);
                    }
                    else if (props.clickedValue === "Add Charges") {

                      const updatedChargesErrors = props.chargesInputData.map((item) => {
                        return {
                          index: item.index,
                          nameError: !item.name?.trim(), // true if name is empty or missing
                          amountError: !item.amount?.trim(), // true if amount is empty or missing
                        };
                      });

                      setErrorHandler((prev) => ({
                        ...prev,
                        charges: updatedChargesErrors,
                      }));


                      const hasAmountError = errorHandler.charges.every(element =>
                        element.amountError !== undefined && element.amountError === false
                      );

                      const hasNameError = errorHandler.charges.every(element =>
                        element.nameError !== undefined && element.nameError === false
                      );
                      const hasContents = props.chargesInputData.every(element =>
                        element.amount !== undefined && element.name !== undefined
                      )



                      if (hasAmountError && hasNameError && hasContents) {
                        await props.addCharges();
                        await props.updateCharges();
                      }
                    }
                    else if (props.clickedValue === "Add Sales Notes") {
                      if (props.salesNote.trim().length === 0) {
                        setErrorHandler(prev => ({
                          ...prev,
                          salesNote: true
                        }));
                        return;
                      }
                      await props.UpdateSalesNotes();
                    }
                  }}
                  style={styles.saveAction}
                >
                  <Text style={[{ color: Colors.white, textAlign: "center" }, TextTheme.labelLarge]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    // flex: 1,
    height: "100%",
    // maxHeight:"10%",
    justifyContent: "flex-end",
    backgroundColor: Colors.ripple,
  },
  modalContent: {
    width: "100%",
    // flex:1,
    // maxHeight:"700%",
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
    paddingBottom: 10,
    paddingHorizontal: 20,
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
  chargePriceBoxContainer: {
    width: "97%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.ripple,
    padding: 5,
    borderRadius: 5,
  },
  priceBoxContainer: {
    width: "97%",
    // height: 40,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.ripple,
    padding: 5,
    borderRadius: 5,
  },
  chargeHeader: {
    marginVertical: 10
  },
  addItemsWithLogoButton: {
    marginTop: 5,
    marginBottom: 5,
    alignSelf: "flex-start",
    backgroundColor: Colors.transparent,
  },
  addItemsWithLogoContainer: {
    flexDirection: "row",
    gap: 10,
  },
  addItemWithLogo_text: {
    color: Colors.highlight
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
  itemContainer: {
    justifyContent:"space-between",
    flexDirection: "row",
    alignItems: "center"
  }
});

export default MiniActionTextModal;
