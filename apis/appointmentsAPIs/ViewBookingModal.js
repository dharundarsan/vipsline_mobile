import {FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {updateNavigationState} from "../../store/NavigationSlice";
import {AntDesign, Feather, Ionicons, MaterialIcons, Octicons} from "@expo/vector-icons";
import React, {useEffect, useRef, useState} from "react";
import {shadowStyling, showToast} from "../../util/Helpers";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomTextInput from "../../ui/CustomTextInput";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import {Divider} from "react-native-paper";
import TextTheme from "../../constants/TextTheme";
import calculatePriceForServiceAPI from "../../apis/appointmentsAPIs/calculatePriceForServiceAPI";
import createBookingAPI from "../../apis/appointmentsAPIs/createBookingAPI";
import ThreeDotActionIndicator from "../../ui/ThreeDotActionIndicator";
import Toast from "../../ui/Toast";
import clockDropdownData from "../../data/clockDropdownData";
import getAppointmentDetailsAPI from "../../apis/appointmentsAPIs/getAppointmentDetailsAPI";
import NewBookingAddClientModal from "../../components/appointments/NewBookingAddClientModal";
import SelectServiceModal from "../../components/appointments/SelectServiceModal";
import NewBookingCard from "../../components/appointments/NewBookingCard";
import getClientDetailsByIdAPI from "./getClientDetails";
import {shallowEqual, useSelector} from "react-redux";
import EditBookingCard from "../../components/appointments/editBookingCard";
import editAppointmentDetailsAPI from "./editAppointmentDetailsAPI";
import uuid from "react-native-uuid";

const ViewBookingModal = (props) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);
    const [isSelectServiceModalVisible, setIsSelectServiceModalVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState("date");
    const [finalData, setFinalData] = useState({amount: 0, duration: "0 h 0 mins"})
    const [isSaveAppointmentLoading, setIsSaveEditAppointmentLoading] = useState(false);
    const toastRef = useRef();
    const servicesData = useSelector(state => state.catalogue.services, shallowEqual);
    const staffs = useSelector((state) => state.staff.staffs);

    console.log(servicesData)

    const [currentAppointmentState, setCurrentAppointmentState] = useState(props?.data?.status);
    const [isEditingAllowed, setIsEditingAllowed] = useState(false);
    const [viewAppointmentDetails, setViewAppointmentDetails] = useState();

    const [currentServicesList, setCurrentServicesList] = useState([]);
    const [currentAppointmentStatus, setCurrentAppointmentStatus] = useState(props.data.status);
    const [currentSelectedClient, setCurrentSelectedClient] = useState()
    const [currentNotes, setCurrentNotes] = useState()
    const [currentAppointmentDate, setCurrentAppointmentDate] = useState()
    const [currentAppointmentStartTime, setCurrentAppointmentStartTime] = useState(moment(props.data.start_time, "HH:mm:ss").format("hh:mm A"))


    const getStatusColorAndText = (status) => {
        if (status === "COMPLETED") {
            return {color: "#D4D4D4", text: "Completed"}
        } else if (status === "BOOKED") {
            return {color: "#9DDDE0", text: "Booked"}
        } else if (status === "CONFIRMED") {
            return {color: "#D5C6F5", text: "Confirmed"}
        } else if (status === "NO_SHOW") {
            return {color: "#F67A6F", text: "No Show"}
        } else if (status === "IN_SERVICE") {
            return {color: "#FAC5DC", text: "In Service"}
        } else if (status === "CANCELLED") {
            return {color: "#D1373F", text: "Cancelled"}
        }
    }

    const appointmentStatuses = [
        {label: "Booked", value: "BOOKED"},
        {label: "Completed", value: "COMPLETED"},
        {label: "Confirmed", value: "CONFIRMED"},
        {label: "No Show", value: "NO_SHOW"},
        {label: "In Service", value: "IN_SERVICE"},
        {label: "Cancelled", value: "CANCELLED"},
    ]

    useEffect(() => {
        const apiCall = async () => {
            const response = await getAppointmentDetailsAPI({
                booking_id: props.data.booking_id
            })
            const data = response.data.data[0];
            console.log("data")
            console.log(data)

            setViewAppointmentDetails(data)
            setCurrentAppointmentDate(moment(data?.appointment_date, "YYYY-MM-DD"))
            setCurrentNotes(data?.apptList[0]?.notes)

            const allCategoryServices = [...servicesData.general, ...servicesData.men, ...servicesData.women, ...servicesData.kids]
                .flatMap(category => category.resource_categories);

            const mapped = data?.apptList.map(selService => {
                const found = allCategoryServices.find(all => all.id === selService.service_id)
                const parts = selService.duration.split(" ")
                let duration = selService.duration;

                if (parts.length > 2) {
                    if (parts[2].toString() === "0")
                        duration = parts[0].toString() + " " + "h";
                    else if (parts[0].toString() === "0")
                        duration = parts[2].toString() + " " + "mins";
                }

                return {
                    ...selService, ...found,
                    preferred_duration: duration,
                    currentDuration: duration,
                    currentSelectedStaff: staffs.find(staff => staff.id === selService.staff_id),
                    currentStartTime: selService.start_time,
                    currentAppointmentDate: moment(selService.date, "YYYY-MM-DD"),
                    temp_id: uuid.v4(),
                    type: null,
                }
            })

            setCurrentServicesList(mapped);

            console.log("mapped")
            console.log(mapped[0])

            const clientDetailResp = await getClientDetailsByIdAPI({
                "client_id": data?.apptList[0]?.client_id,
            })
            setCurrentSelectedClient(clientDetailResp.data.data[0]);
        }
        apiCall()
    }, []);

    console.log({"isEditingAllowed": isEditingAllowed})

    const modifyCurrentServiceData = (temp_id, field, value) => {
        if (field === "currentStartTime" && temp_id === currentServicesList[0].temp_id) {
            setCurrentAppointmentStartTime(value);
        }
        setCurrentServicesList(prev => {
            return prev.map(service => {
                if (service.temp_id === temp_id) {
                    return {
                        ...service,
                        [field]: value,
                        type: "edit",
                    }
                }
                return service
            })
        })
    }

    return <Modal style={{flex: 1}}
                  visible={props.isVisible}
                  animationType={"slide"}
                  presentationStyle={"pageSheet"}>
        {isDatePickerVisible && <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={pickerMode}
            maximumDate={props.maximumDate}
            minimumDate={props.minimumDate}
            date={moment(currentAppointmentDate).toDate()}
            onConfirm={(selectedDate) => {
                setIsDatePickerVisible(false)
                setCurrentAppointmentDate(moment(selectedDate))
            }}
            onCancel={() => {
                setIsDatePickerVisible(false)
            }}
            themeVariant="light"
            style={{}}
        />}

        {isAddClientModalVisible && <NewBookingAddClientModal
            onSelect={(staff) => {
                setCurrentSelectedClient(staff)
            }}
            closeModal={() => {
                setIsAddClientModalVisible(false);
            }}
        />}

        {isSelectServiceModalVisible && <SelectServiceModal
            isVisible={isSelectServiceModalVisible}
            onPress={(item) => {
                console.log(item)
                // setCurrentServicesList(prev => [...prev, {
                //     temp_id: uuid.v4(),
                //     service_name: item.name
                // }])
            }}
            onClose={() => {
                setIsSelectServiceModalVisible(false);
            }}
        />}

        <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
            <View style={{
                justifyContent: "space-between",
                flexDirection: "row",
                flex: 1,
                marginLeft: 20,
                alignItems: "center"
            }}>
                <View style={{flexDirection: "row", alignItems: "center", gap: 10,}}>
                    <View style={{
                        height: 20,
                        width: 20,
                        backgroundColor: getStatusColorAndText(currentAppointmentStatus).color,
                        borderRadius: 1000,
                    }}/>
                    <Text style={{
                        fontWeight: "700",
                        fontSize: 18
                    }}>{getStatusColorAndText(currentAppointmentStatus)?.text}</Text>
                </View>
                <View style={{flexDirection: "row"}}>
                    <CustomTextInput type="dropdown"
                                     container={{marginVertical: 10, marginBottom: 10, marginRight: 10}}
                                     dropdownButton={{width: 125, borderRadius: 1000, marginVertical: 0}}
                                     dropdownPressable={{paddingVertical: 5, paddingHorizontal: 15}}
                                     dropdownLabelTextStyle={{fontSize: 14}}
                                     value={{
                                         label: getStatusColorAndText(currentAppointmentState).text,
                                         value: currentAppointmentState
                                     }}
                                     overrideDisplayText={"Change"}
                                     onChangeValue={(status) => {
                                         console.log(status)
                                         editAppointmentDetailsAPI({
                                             "status": status.value,
                                             "booking_id": props.data.booking_id
                                         }).then(res => {
                                             console.log("res.data")
                                             console.log(res.data)
                                             if (res.data.status_code === 200) {
                                                 setCurrentAppointmentStatus(status.value)
                                                 toastRef.current.show("Status updated successfully")
                                             } else {
                                                 console.log(res.data.other_message)
                                                 toastRef.current.show(res.data.other_message, true)
                                             }
                                         })
                                     }}
                                     placeholder={"Change"}
                                     object={true}
                                     objectName="label"
                                     dropdownItems={appointmentStatuses}/>
                    <PrimaryButton
                        buttonStyle={{
                            backgroundColor: Colors.white,
                        }}
                        pressableStyle={styles.closeButtonPressable}
                        onPress={() => {
                            setIsEditingAllowed(prev => !prev);
                        }}
                    >
                        <Feather name="edit" size={24} color="black"/>
                    </PrimaryButton>
                </View>
            </View>

            <PrimaryButton
                buttonStyle={{
                    backgroundColor: Colors.white,
                }}
                pressableStyle={styles.closeButtonPressable}
                onPress={() => {
                    props.onClose()
                }}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>


        <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
                <View style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.grey300,
                    marginBottom: 10,
                }}>
                    <PrimaryButton
                        onPress={isEditingAllowed ? () => {
                            setPickerMode("date");
                            setIsDatePickerVisible(true)
                        } : null}
                        buttonStyle={{
                            flex: 1,
                            backgroundColor: Colors.transparent,
                            borderRadius: 0,
                        }}
                        disableRipple={!isEditingAllowed}
                        pressableStyle={{
                            flexDirection: "row",
                            paddingVertical: 15,
                            justifyContent: "space-evenly",
                        }}>
                        <Text style={{color: Colors.grey500, fontWeight: "700"}}>ON</Text>
                        <Text
                            style={{fontWeight: 500}}>
                            {currentAppointmentDate?.format("DD MMM YYYY")}
                        </Text>
                    </PrimaryButton>
                    <View style={{height: "100%", width: 1, backgroundColor: Colors.grey300}}/>
                    <CustomTextInput type="dropdown"
                                     showDropdownArrowIcon={isEditingAllowed}
                                     disableOnPress={!isEditingAllowed}
                                     container={{
                                         marginVertical: 10,
                                         marginBottom: 10,
                                         marginRight: 10,
                                         alignSelf: "flex-start",
                                         flex: 1,
                                         flexDirection: "row-reverse",
                                         alignItems: "center"
                                     }}
                                     dropdownButton={{
                                         borderRadius: 5,
                                         marginVertical: 0,
                                         borderWidth: 0,
                                         flexGrow: 0,
                                         flexShrink: 1,
                                     }}
                                     dropdownPressable={{
                                         paddingVertical: 5,
                                         paddingHorizontal: 0,
                                         justifyContent: "space-evenly"
                                     }}
                                     dropdownLabelTextStyle={{fontSize: 13, fontWeight: "bold"}}
                                     value={currentAppointmentStartTime}
                                     onChangeValue={(date) => {
                                         setCurrentAppointmentStartTime(date);
                                         modifyCurrentServiceData(currentServicesList[0].temp_id, "currentStartTime", date)
                                     }}
                                     dropdownItems={clockDropdownData}>
                        <Text style={{color: Colors.grey500, fontWeight: "700"}}>AT</Text>
                    </CustomTextInput>
                </View>
                {currentSelectedClient === null ? <PrimaryButton
                        disableRipple={!isEditingAllowed}
                        onPress={() => {
                            if (!isEditingAllowed) {
                                return
                            }
                            setIsAddClientModalVisible(true);
                        }}
                        height={80}
                        buttonStyle={{
                            backgroundColor: Colors.transparent,
                            borderWidth: 1,
                            borderColor: Colors.grey300,
                            marginHorizontal: 15,
                        }}
                        pressableStyle={{flexDirection: "row", gap: 8}}>

                        <FontAwesome name="plus-square-o" size={24} color={Colors.highlight}/>
                        <Text style={[textTheme.bodyLarge, {color: Colors.highlight}]}>Add Client</Text>

                    </PrimaryButton> :
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderColor: Colors.grey300,
                        borderWidth: 1,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 14,
                        marginHorizontal: 15,
                    }}>
                        <View style={{
                            height: 50,
                            width: 50,
                            backgroundColor: "#E2F4F6",
                            borderRadius: 1000,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Text style={{color: Colors.highlight, fontWeight: 600, fontSize: 16}}>K</Text>
                        </View>
                        <View>
                            <Text style={textTheme.titleSmall}>{currentSelectedClient?.name}</Text>
                            <Text>+91 {currentSelectedClient?.mobile_1}</Text>
                        </View>
                        <View style={{borderRadius: 1000, overflow: "hidden"}}>
                            <Pressable
                                android_ripple={{
                                    color: 'rgba(0, 0, 0, 0.1)',
                                    borderless: false
                                }}
                                style={({pressed}) => [
                                    {
                                        backgroundColor: Colors.transparent,
                                        borderColor: Colors.highlight,
                                        borderWidth: 1,
                                        borderRadius: 1000,
                                        paddingVertical: 5,
                                        paddingHorizontal: 10,
                                    },
                                    Platform.OS === "ios" && {opacity: pressed ? 0.3 : 1},
                                ]}
                            >
                                <Text style={{color: Colors.highlight, fontWeight: "500"}}>Cust.info</Text>
                            </Pressable>
                        </View>
                        <PrimaryButton
                            buttonStyle={{backgroundColor: Colors.transparent}}
                            pressableStyle={{
                                paddingVertical: 5,
                                paddingHorizontal: 5
                            }}
                            onPress={() => {
                                if (!isEditingAllowed) {
                                    return
                                }
                                setCurrentSelectedClient(null);
                            }}
                        >

                            {isEditingAllowed && <Ionicons name="close" size={25} color="black"/>}
                        </PrimaryButton>
                    </View>}
                <Text style={[textTheme.titleMedium, {marginTop: 20, marginHorizontal: 15,}]}>Services</Text>
                {currentServicesList.length === 0 ? <View style={{
                        alignItems: "center",
                        gap: 15,
                        borderWidth: 1,
                        borderColor: Colors.grey300,
                        borderRadius: 8,
                        height: 150,
                        marginTop: 5,
                        justifyContent: "center",
                        marginHorizontal: 15,
                    }}>
                        <Text>Add a service to save the appointment</Text>
                        <PrimaryButton
                            disableRipple={!isEditingAllowed}
                            onPress={() => {
                                if (!isEditingAllowed) {
                                    return;
                                }
                                setIsSelectServiceModalVisible(true);
                            }}
                            buttonStyle={{
                                backgroundColor: Colors.transparent,
                                alignSelf: "center",
                                borderWidth: 1,
                                borderColor: Colors.highlight,
                                borderRadius: 1000
                            }}
                            pressableStyle={{
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                gap: 8,
                                paddingHorizontal: 13,
                                paddingVertical: 8
                            }}>
                            <Octicons name="plus" size={15} color="black"/>
                            <Text>Add Service</Text>
                        </PrimaryButton>
                    </View> :
                    <View style={{flex: 1, marginHorizontal: 15,}}>
                        <FlatList style={{flex: 1}} scrollEnabled={false}
                                  keyExtractor={(item) => item.temp_id}
                                  data={currentServicesList}
                                  renderItem={({item}) => <EditBookingCard
                                      modifyValue={modifyCurrentServiceData}
                                      isEditingAllowed={isEditingAllowed}
                                      data={item}/>}
                        />
                        {isEditingAllowed && <PrimaryButton
                            buttonStyle={{
                                marginBottom: 5,
                                alignSelf: "flex-start",
                                backgroundColor: Colors.transparent,
                                borderWidth: 1,
                                borderColor: Colors.highlight,
                                borderRadius: 1000,
                                marginTop: 10,
                            }}
                            pressableStyle={{
                                paddingVertical: 8,
                                paddingHorizontal: 10,
                            }}
                            onPress={() => {
                                setIsSelectServiceModalVisible(true);
                            }}>
                            <View style={{
                                flexDirection: "row",
                                gap: 5,
                                alignItems: "center",
                            }}>
                                <MaterialIcons name="add" size={20} color={Colors.black}/>
                                <Text style={[TextTheme.bodyMedium, {color: Colors.black}]}>Add
                                    Service</Text>
                            </View>
                        </PrimaryButton>}
                    </View>}


                <Text style={[textTheme.titleMedium, {marginTop: 20, marginHorizontal: 15,}]}>Notes</Text>
                <CustomTextInput type={"multiLine"}
                                 readOnly={!isEditingAllowed}
                                 textInputStyle={{fontSize: 14, marginHorizontal: 15,}}
                                 placeholder={"Add an appointment note"}
                                 value={currentNotes}
                                 onChangeText={(text) => {
                                     if (isEditingAllowed) {
                                         setCurrentNotes(text)
                                     }
                                     return;
                                 }}/>
            </ScrollView>
        </View>
        <View style={[shadowStyling, {alignItems: "center", padding: 15}]}>
            <Text
                style={[textTheme.titleMedium, {marginBottom: 10}]}>{`Total Amount       ₹${finalData.amount}    (${finalData.duration})`}</Text>
            <PrimaryButton
                onPress={isSaveAppointmentLoading ? null : async () => {
                    console.log({
                        appointment_date: currentAppointmentDate.format("YYYY-MM-DD"),
                        booking_id: props.data.booking_id,
                        client_id: currentSelectedClient.id,
                        notes: currentNotes,
                        services_list: [],
                        type: "reschedule"
                    })

                    if (isEditingAllowed) {
                        setIsSaveEditAppointmentLoading(true)
                        const editedServices = currentServicesList.filter(service => service.type === "edit")
                        const addedServices = currentServicesList.filter(service => service.type === "add")

                        editAppointmentDetailsAPI({
                            appointment_date: currentAppointmentDate.format("YYYY-MM-DD"),
                            booking_id: props.data.booking_id,
                            client_id: currentSelectedClient.id,
                            notes: currentNotes,
                            services_list: editedServices.map(editedService => {
                                const parts = editedService.currentDuration.split(" ");
                                let totalMinutes = 0;
                                if (parts.length > 2) {
                                    totalMinutes += parseInt(parts[0]) * 60; // Add hours as minutes
                                    totalMinutes += parseInt(parts[2]); // Add minutes
                                } else {
                                    totalMinutes += parseInt(parts[0]); // Add minutes only
                                }

                                return {
                                    appointment_id: editedService.appt_id,
                                    resource_id: editedService.currentSelectedStaff.id,
                                    duration: editedService.currentDuration,
                                    start_time: editedService.currentStartTime,
                                    end_time: moment(editedService.currentStartTime, "hh:mm A").add(totalMinutes, "minute").format("hh:mm A"),
                                    mode:"edit"
                                }
                            }),
                            type: "reschedule"
                        }).then((res) => {
                            console.log("HHHHHH")
                            setIsSaveEditAppointmentLoading(false)
                        }).finally(() => {
                            console.log("AAAAAA")
                            setIsSaveEditAppointmentLoading(false)
                        })
                    } else {
                    }
                    props.onClose();
                }}
                buttonStyle={{alignSelf: "stretch"}}>
                {isSaveAppointmentLoading ? <View style={{
                        height: 20,
                    }}><ThreeDotActionIndicator/>
                    </View> :
                    <Text
                        style={[textTheme.titleSmall, {color: Colors.onButton}]}>{isEditingAllowed ? "Save Changes" : "Checkout"}</Text>}
            </PrimaryButton>
        </View>
        <Toast ref={toastRef}/>
    </Modal>
}

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        // marginTop: Platform.OS === "ios" ? 50 : 0,
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
})

export default ViewBookingModal;