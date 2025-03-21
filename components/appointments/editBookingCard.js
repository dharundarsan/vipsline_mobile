import Colors from "../../constants/Colors";
import {Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Divider} from "react-native-paper";
import React, {useEffect, useState} from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import CustomTextInput from "../../ui/CustomTextInput";
import {useDispatch, useSelector} from "react-redux";
import {Dropdown} from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import {modifyValue, removeBooking, updateBooking} from "../../store/newBookingSlice";
import checkStaffAvailabilityAPI from "../../apis/appointmentsAPIs/checkStaffAvailabilityAPI";
import durationDropdownData from "../../data/durationDropdownData";
import clockDropdownData from "../../data/clockDropdownData";

const EditBookingCard = (props) => {
    const dispatch = useDispatch();
    const staffs = useSelector((state) => state.staff.staffs);
    const handleUpdate = (field, value) => {
        dispatch(updateBooking({temp_id: props.data.temp_id, field, value}));
    };
    const date = useSelector(state => state.newBooking.date)
    const [staffAvailable, setStaffAvailable] = useState(true);


    return (
        <View style={{borderWidth: 1, borderColor: Colors.grey300, borderRadius: 8, marginTop: 10, overflow: "hidden"}}>
            <View style={{flexDirection: "row", justifyContent: "space-between", margin: 15, alignItems: "center"}}>
                <Text>{props.data.service_name}</Text>
                <View style={{flexDirection: "row", alignItems: "center", gap: 30}}>
                    <Text style={{fontWeight: 500}}>₹ {props.data.price}</Text>
                    <PrimaryButton
                        buttonStyle={{backgroundColor: Colors.transparent, height: 40, width: 40}}
                        pressableStyle={{
                            paddingVertical: 5,
                            paddingHorizontal: 5,
                        }}
                        disableRipple={!props.isEditingAllowed}
                        onPress={() => {
                            if (props.isEditingAllowed) {
                                props.modifyValue(props.data.temp_id, "type", "remove")
                            }
                            return;
                        }}
                    >
                        {props.isEditingAllowed && <Ionicons name="close" size={25} color="black"/>}
                    </PrimaryButton>
                </View>
            </View>

            <View
                style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginBottom: 20}}>
                <View style={{flexDirection: "row", gap: 10, alignItems: "center", flex: 1}}>
                    <Text style={{color: Colors.grey500, fontWeight: "700", fontSize: 12}}>START TIME</Text>
                    <CustomTextInput type="dropdown"
                                     container={{
                                         marginVertical: 10,
                                         marginBottom: 10,
                                         marginRight: 10,
                                         alignSelf: "flex-start",
                                         flex: 1,
                                     }}
                                     showDropdownArrowIcon={false}
                                     dropdownButton={{borderRadius: 5, marginVertical: 0}}
                                     dropdownPressable={{
                                         paddingVertical: 5,
                                         paddingHorizontal: 0,
                                         justifyContent: "center"
                                     }}
                                     dropdownLabelTextStyle={{fontSize: 13}}
                                     value={props.data.currentStartTime}
                                     disableOnPress={!props.isEditingAllowed}
                                     onChangeValue={(date) => {
                                         if (props.isEditingAllowed) {
                                             props.modifyValue(props.data.temp_id, "currentStartTime", date)
                                             props.modifyValue(props.data.temp_id, "type", "edit")
                                         }
                                         return;
                                     }}
                                     dropdownItems={clockDropdownData}/>
                </View>
                <View style={{
                    flexDirection: "row",
                    flex: 1,
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}>
                    <Text style={{color: Colors.grey500, fontWeight: "700", fontSize: 12}}>DURATION</Text>
                    <CustomTextInput type="dropdown"
                                     container={{
                                         marginVertical: 10,
                                         marginBottom: 10,
                                         marginRight: 10,
                                         alignSelf: "flex-start",
                                         flex: 1,
                                     }}
                                     showDropdownArrowIcon={false}
                                     dropdownButton={{borderRadius: 5, marginVertical: 0}}
                                     dropdownPressable={{
                                         paddingVertical: 5,
                                         paddingHorizontal: 0,
                                         justifyContent: "center"
                                     }}
                                     dropdownLabelTextStyle={{fontSize: 13}}
                                     value={{label: props.data.currentDuration}}
                                     onChangeValue={(duration) => {
                                         if (props.isEditingAllowed) {
                                             props.modifyValue(props.data.temp_id, "currentDuration", duration.label)
                                             props.modifyValue(props.data.temp_id, "type", "edit")
                                         }
                                         return;
                                     }}
                                     object={true}
                                     disableOnPress={!props.isEditingAllowed}
                                     objectName="label"
                                     dropdownItems={durationDropdownData}/>
                </View>
            </View>

            <Divider/>

            <View style={{alignSelf: "flex-end"}}>
                <CustomTextInput type="dropdown"
                                 container={{marginVertical: 10, marginBottom: 10, marginRight: 10}}
                                 dropdownButton={{width: 200, borderRadius: 1000, marginVertical: 0}}
                                 dropdownPressable={{paddingVertical: 5, paddingHorizontal: 20}}
                                 dropdownLabelTextStyle={{fontSize: 14}}
                                 value={props.data.currentSelectedStaff}
                                 showDropdownArrowIcon={props.isEditingAllowed}
                                 onChangeValue={(staff) => {
                                     if (props.isEditingAllowed) {
                                         checkStaffAvailabilityAPI({
                                             resource_id: staff.id,
                                             start_time: props.data.currentStartTime,
                                             appointment_date: moment(props.data.currentAppointmentDate).format("YYYY-MM-DD")
                                         }).then((response => {
                                             setStaffAvailable(response.data.status_code < 399);
                                             props.modifyValue(props.data.temp_id, "currentSelectedStaff", staff)
                                             props.modifyValue(props.data.temp_id, "type", "edit")

                                         }))
                                     }
                                     return;
                                 }}
                                 disableOnPress={!props.isEditingAllowed}
                                 placeholder={"Select Staff"}
                                 object={true}
                                 objectName="name"
                                 dropdownItems={staffs}/>
            </View>
            {!staffAvailable ? <View style={{
                backgroundColor: "#fef3cc",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                height: 30
            }}>
                <Text style={{color: "rgb(247, 148, 29)", fontWeight: 500}}>Staff is not available during
                    this
                    time</Text>
                <Ionicons name="warning-outline" size={22} color="rgb(247, 148, 29)"/>
            </View> : null}
        </View>
    );
};


export default EditBookingCard