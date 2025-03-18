import Colors from "../../constants/Colors";
import {Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Divider} from "react-native-paper";
import React, {useState} from "react";
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

const NewBookingCard = (props) => {
    const dispatch = useDispatch();
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const staffs = useSelector((state) => state.staff.staffs);
    const handleUpdate = (field, value) => {
        dispatch(updateBooking({temp_id: props.data.temp_id, field, value}));
    };
    const date = useSelector(state => state.newBooking.date)

    console.log(props.data.preferred_duration)

    return (
        <View style={{borderWidth: 1, borderColor: Colors.grey300, borderRadius: 8, marginTop: 10, overflow: "hidden"}}>
            {isDatePickerVisible && (
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="time"
                    date={moment(props.data.preferred_date).toDate()}
                    onConfirm={(selectedDate) => {
                        handleUpdate("preferred_date", moment(selectedDate).toISOString());
                        if (props.data.preferred_staff !== "") {
                            checkStaffAvailabilityAPI({
                                resource_id: props.data.preferred_staff.id,
                                start_time: props.data.preferred_date,
                                appointment_date: moment(date).format("YYYY-MM-DD")
                            }).then((response => {
                                console.log(response.data)
                                handleUpdate("staff_available", response.data.status_code <= 399)
                            }))
                        }
                        setIsDatePickerVisible(false);
                    }}
                    onCancel={() => setIsDatePickerVisible(false)}
                />
            )}

            <View style={{flexDirection: "row", justifyContent: "space-between", margin: 15, alignItems: "center"}}>
                <Text>{props.data.name}</Text>
                <Text style={{fontWeight: 500}}>₹ {props.data.discounted_price}</Text>
                <PrimaryButton
                    buttonStyle={{backgroundColor: Colors.transparent}}
                    pressableStyle={{
                        paddingVertical: 5,
                        paddingHorizontal: 5,
                    }}
                    onPress={() => {
                        dispatch(removeBooking(props.data.temp_id))
                    }}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
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
                                     value={props.data.preferred_date}
                                     onChangeValue={(date) => {
                                         handleUpdate("preferred_date", date)
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
                                     value={props.data.preferred_duration}
                                     onChangeValue={(duration) => {
                                         handleUpdate("preferred_duration", duration)
                                     }}
                                     object={true}
                                     objectName="label"
                                     dropdownItems={durationDropdownData}/>
                    {/*<Dropdown*/}
                    {/*    placeholder="Select"*/}
                    {/*    data={hourDropdownData}*/}
                    {/*    labelField="label"*/}
                    {/*    valueField="label"*/}
                    {/*    autoScroll={false}*/}
                    {/*    value={props.data.preferred_duration}*/}
                    {/*    onChange={(duration) => {*/}
                    {/*        handleUpdate("preferred_duration", duration)*/}
                    {/*    }}*/}
                    {/*    style={{*/}
                    {/*        borderColor: Colors.grey300,*/}
                    {/*        borderWidth: 1,*/}
                    {/*        width: 100,*/}
                    {/*        borderRadius: 5,*/}
                    {/*        paddingVertical: 5,*/}
                    {/*        paddingHorizontal: 5*/}
                    {/*    }}*/}
                    {/*/>*/}
                </View>
            </View>

            <Divider/>

            <View style={{alignSelf: "flex-end"}}>
                <CustomTextInput type="dropdown"
                                 container={{marginVertical: 10, marginBottom: 10, marginRight: 10}}
                                 dropdownButton={{width: 200, borderRadius: 1000, marginVertical: 0}}
                                 dropdownPressable={{paddingVertical: 5, paddingHorizontal: 20}}
                                 dropdownLabelTextStyle={{fontSize: 14}}
                                 value={props.data.preferred_staff}
                                 onChangeValue={(staff) => {
                                     checkStaffAvailabilityAPI({
                                         resource_id: props.data.preferred_staff.id,
                                         start_time: props.data.preferred_date,
                                         appointment_date: moment(date).format("YYYY-MM-DD")
                                     }).then((response => {
                                         handleUpdate("staff_available", response.data.status_code <= 399)
                                     }))
                                     handleUpdate("preferred_staff", staff)
                                 }}
                                 placeholder={"Select Staff"}
                                 object={true}
                                 objectName="name"
                                 dropdownItems={staffs}/>
            </View>
            {props.data.staff_available === false ? <View style={{
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


export default NewBookingCard