import {Modal, View, StyleSheet, Text, ScrollView, FlatList, ActivityIndicator} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {AntDesign, Ionicons, MaterialIcons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useRef, useState} from "react";
import Colors from "../../constants/Colors";
import CustomTextInput from "../../ui/CustomTextInput";
import {useSelector} from "react-redux";
import Toast from "../../ui/Toast";
import {capitalizeFirstLetters} from "../../util/Helpers";
import moment from "moment";
import updateShiftForTheDayAPI from "../../apis/staffManagementAPIs/updateShiftForTheDayAPI";

export default function AddAndUpdateShift(props) {

    const shiftTimings = useSelector(state => state.staff.shiftTiming);

    const [shiftTimingList, setShiftTimingList] = useState(props.currentDayWorkingData.shiftsWorkingList);
    const [loading, setLoading] = useState();

    // console.log(shiftTimingList);




    const addShift = () => {
        const existingNames = shiftTimingList.map(shift => shift.name);

        // Empty name is not allowed
        if (existingNames.includes("")) {
            alert("Please select a shift name before adding a new one.");
            return;
        }

        setShiftTimingList(prevList => [
            ...prevList,
            {
                id: Date.now(), // Unique ID
                name: "", // New shift starts as empty
                start_time: "",
                end_time: ""
            }
        ]);
    };


    const deleteShift = (id) => {
        setShiftTimingList(prevList => prevList.filter(shift => shift.id !== id));
    };

    const dropdownRef = useRef(null);
    const toastRef = useRef(null);


    return <Modal
        style={[styles.modal, props.style]}
        visible={props.visible}
        animationType={"slide"}
        presentationStyle={"formSheet"}
        onRequestClose={props.onClose}
    >
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleLarge, styles.titleText]}>{capitalizeFirstLetters(props.currentDayWorkingData.name) + " - " + moment(props.currentDayWorkingData.date).toDate().toLocaleDateString('en-GB', {
                weekday: 'short',
                day: '2-digit',
                month: 'short'
            })}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onClose}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <>
            <View style={styles.modalContent}>
                <Toast ref={toastRef}/>
            <ScrollView>
                {
                    shiftTimingList.map((item, index) => {
                        return (<View style={styles.shiftContainer} key={item.key}>
                            <CustomTextInput

                                type={"dropdown"}
                                dropdownItems={shiftTimings.map((item, index) => item.name)}
                                label={"Shift Name"}
                                onChangeValue={(value) => {
                                    // const selectedShift = shiftTimings.find(shift => shift.name === value);
                                    //
                                    // if (selectedShift) {
                                    //     setShiftTimingList(prevList =>
                                    //         prevList.map(shift =>
                                    //             shift.id === item.id ? selectedShift : shift
                                    //         )
                                    //     );
                                    // }

                                    const existingNames = shiftTimingList.map(shift => shift.name);

                                    if (existingNames.includes(value)) {
                                        toastRef.current.show("Shift Name already exists...")
                                        return;
                                    }

                                    const selectedShift = shiftTimings.find(shift => shift.name === value);

                                    if (selectedShift) {
                                        setShiftTimingList(prevList =>
                                            prevList.map(shift =>
                                                shift.id === item.id ? selectedShift : shift
                                            )
                                        );
                                    }


                                }}
                                // value={
                                flex
                                dropdownLabelTextStyle={{fontSize: 12,}}
                                dropdownPressable={{paddingHorizontal: 8}}
                                defaultValue={item.name}
                                value={item.name}
                                onSave={(callback) => {
                                    dropdownRef.current = callback;
                                }}
                                validator={(item) => {
                                    if(item === undefined || item === null || item === "") {
                                        return "Shift Name is required";
                                    }
                                    else {
                                        return true;
                                    }
                                }}
                            />
                            <CustomTextInput
                                label={"Shift Time"}
                                type={"text"}
                                value={item.start_time + " - " + item.end_time}
                                // readOnly
                                container={{}}
                                flex
                                textInputStyle={{fontSize: 12, textAlign: "center"}}
                                scrollEnabled={true}
                                editable={false}
                                // selectTextOnFocus={false}
                            />
                            <PrimaryButton
                                onPress={() => deleteShift(item.id)}
                                buttonStyle={{
                                    backgroundColor: "white",
                                    alignSelf: "center",

                                }}
                                pressableStyle={{paddingHorizontal: 8, paddingVertical: 8, alignSelf: "center",}}>
                                <AntDesign name="delete" size={24} color="black" />
                            </PrimaryButton>
                        </View>)
                    })
                }
                {
                    shiftTimingList.length === 0 ?
                    <Text style={[textTheme.bodyLarge, {textAlign: "center", paddingVertical: 32}]}>
                        No Shift Data
                    </Text> : <></>
                }

                <PrimaryButton
                    buttonStyle={[styles.addShiftButton, {alignSelf: shiftTimingList.length === 0 ? "center" : undefined}]}
                    pressableStyle={styles.addShiftButtonPressable}
                    onPress={addShift}
                >
                    <AntDesign name="pluscircleo" size={24} color={Colors.highlight} />
                    <Text style={[textTheme.bodyLarge, {color: Colors.highlight}]}>
                        Add a shift
                    </Text>
                </PrimaryButton>
                <Text style={[textTheme.bodyLarge, {textAlign: "center", marginTop: 16}]}>
                    You are editing this day's shifts only. To set regular shifts, go to
                    <Text
                        style={{color: Colors.highlight}}
                        onPress={props.onClose}
                    >
                        {" " + "working hours"}
                    </Text>
                </Text>
            </ScrollView>
                <PrimaryButton
                    onPress={async () => {
                        if(props.regularShifts === undefined) {
                            const valid = dropdownRef.current();

                            if (!valid) {
                                return;
                            }

                            const response = await updateShiftForTheDayAPI(
                                props.currentDayWorkingData.resource_id,
                                props.currentDayWorkingData.date,
                                shiftTimingList.map((item, index) => item.id)
                            );

                            if (response.data.other_message === "") {
                                props.toastRef.current.show(response.data.message)
                                props.setOnUpdate(prev => !prev);
                            } else {
                                toastRef.current.show(response.data.other_message)
                            }


                            props.onClose()
                        }
                        else {
                            props.onSave(shiftTimingList, props.currentDayWorkingData.week, props.currentDayWorkingData.day);
                            props.onClose();
                        }
                    }}
                >
                    {loading ?
                        <ActivityIndicator size="large" color={Colors.highlight}/> :
                        <Text style={[textTheme.bodyLarge, {color: Colors.white}]}>Save</Text>
                    }
                </PrimaryButton>
            </View>
        </>
    </Modal>
}

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        // marginTop: Platform.OS === "ios" ? 40 : 0,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    titleText: {
        fontWeight: "500",
        flex: 1,
        paddingLeft: 8
    },
    modal: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 12,
        marginVertical: 16
    },
    addShiftButton: {
        backgroundColor: Colors.white,
        borderRadius: 6,
        alignItems: "flex-start",
    },
    addShiftButtonPressable: {
        flexDirection: 'row',
        gap: 8,
        width: undefined,
        borderRadius: 6

    },
    shiftContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8
    }
})