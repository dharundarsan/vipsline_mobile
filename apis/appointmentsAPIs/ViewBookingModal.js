import {FlatList, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {updateNavigationState} from "../../store/NavigationSlice";
import {AntDesign, Feather, Ionicons, MaterialIcons, Octicons} from "@expo/vector-icons";
import React, {useEffect, useRef, useState} from "react";
import {checkAPIError, shadowStyling, showToast} from "../../util/Helpers";
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
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import EditBookingCard from "../../components/appointments/editBookingCard";
import editAppointmentDetailsAPI from "./editAppointmentDetailsAPI";
import uuid from "react-native-uuid";
import servicesList from "../../components/checkoutScreen/ServicesList";
import {loadFutureBookingsFromDB, modifyAppointmentSliceValue} from "../../store/appointmentsSlice";
import BottomActionCard from "../../ui/BottomActionCard";
import cancelAppointmentsAPI from "./cancelAppointmentsAPI";
import {durationToMinutes, formatDuration, getAppointmentWithOldestStartTime} from "../../util/appointmentsHelper";
import {addItemToCart, clearLocalCart, modifyClientMembershipId} from "../../store/cartSlice";
import {
    clearClientInfo,
    getRewardPointBalance,
    loadAnalyticsClientDetailsFromDb,
    loadClientInfoFromDb,
    updateClientId
} from "../../store/clientInfoSlice";
import {useNavigation} from "@react-navigation/native";
import clearCartAPI from "../checkoutAPIs/clearCartAPI";
import ClientInfoModal from "../../components/clientSegmentScreen/ClientInfoModal";
import MoreOptionDropDownModal from "../../components/clientSegmentScreen/MoreOptionDropDownModal";
import {modifyValue} from "../../store/newBookingSlice";

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
    const [isCancelReasonModalVisible, setIsCancelReasonModalVisible] = useState(false)
    const [isClientInfoModalVisible, setIsClientInfoModalVisible] = useState(false)
    //Client
    const [modalVisibility, setModalVisibility] = useState(false)
    const [clientSelectedOption, setClientSelectedOption] = useState()
    const [clientFilterPressed, setClientFilterPressed] = useState()
    const [clientSearchClientQuery, setClientSearchClientQuery] = useState()
    const [isEditClientModalVisible, setIsEditClientModalVisible] = useState(false)

    const [currentAppointmentState, setCurrentAppointmentState] = useState(props?.data?.status);
    const [isEditingAllowed, setIsEditingAllowed] = useState(false);
    const [viewAppointmentDetails, setViewAppointmentDetails] = useState();

    const [currentServicesList, setCurrentServicesList] = useState([]);
    const [currentAppointmentStatus, setCurrentAppointmentStatus] = useState(props.data.status);
    const [currentSelectedClient, setCurrentSelectedClient] = useState()
    const [currentNotes, setCurrentNotes] = useState()
    const [currentAppointmentDate, setCurrentAppointmentDate] = useState()
    const [currentAppointmentStartTime, setCurrentAppointmentStartTime] = useState(moment(props.data.start_time, "HH:mm:ss").format("hh:mm A"))
    const [cancelReason, setCancelReason] = useState();
    const dispatch = useDispatch();

    const getStatusColorAndText = (status) => {
        if (status === "COMPLETED") {
            return {color: "#8bd0fe", text: "Completed"}
        } else if (status === "BOOKED") {
            return {color: "#9DDDE0", text: "Booked"}
        } else if (status === "CONFIRMED") {
            return {color: "#fce171", text: "Confirmed"}
        } else if (status === "ARRIVED") {
            return {color: "#e4a4fe", text: "Arrived"}
        } else if (status === "NO_SHOW") {
            return {color: "#e7766d", text: "No Show"}
        } else if (status === "IN_SERVICE") {
            return {color: "#88f1a7", text: "In Service"}
        } else if (status === "CANCELLED") {
            return {color: "#d0403c", text: "Cancelled"}
        }
    }

    const appointmentStatuses = [
        {label: "Booked", value: "BOOKED"},
        {label: "Confirmed", value: "CONFIRMED"},
        {label: "No Show", value: "NO_SHOW"},
        {label: "Arrived", value: "ARRIVED"},
        {label: "In Service", value: "IN_SERVICE"},
        {label: "Cancelled", value: "CANCELLED"},
    ]

    useEffect(() => {
        const apiCall = async () => {
            const response = await getAppointmentDetailsAPI({
                booking_id: props.data.booking_id
            })
            const data = response.data.data[0];

            setViewAppointmentDetails(data)
            setCurrentAppointmentDate(moment(data?.appointment_date, "YYYY-MM-DD"))
            setCurrentNotes(data?.apptList[0]?.notes)

            const allCategoryServices = [...servicesData.general, ...servicesData.men, ...servicesData.women, ...servicesData.kids]
                .flatMap(category => category.resource_categories);

            const mapped = data?.apptList.map(selService => {
                const found = allCategoryServices.find(all => all.id === selService.service_id)
                let duration = formatDuration(selService.duration);

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

            const clientDetailResp = await getClientDetailsByIdAPI({
                "client_id": data?.apptList[0]?.client_id,
            })
            console.log(clientDetailResp.data.data[0])
            setCurrentSelectedClient(clientDetailResp.data.data[0]);
        }
        apiCall()
    }, []);

    useEffect(() => {
        calculatePriceForServiceAPI({
            "services_list": currentServicesList.filter(service => service.type !== "remove").map(service => {
                return {
                    duration: service.currentDuration,
                    end_time: service.end_time,
                    res_cat_id: service.id,
                    resource_id: service.currentSelectedStaff?.id,
                    start_time: service.currentStartTime,
                }
            })
        }).then(response => {
            setFinalData(response.data.data[0]);
        })
    }, [currentServicesList]);

    useEffect(() => {
        console.log(currentAppointmentStatus)
    }, [currentAppointmentStatus]);


    const modifyCurrentServiceData = (temp_id, field, value) => {
        let newList = [];
        setCurrentServicesList(prev => {
            newList = prev.map(service => {
                if (field === "type" && service.type === "add" && value !== "remove") {
                    return service;
                }
                if (service.temp_id === temp_id) {
                    return {
                        ...service,
                        [field]: value,
                    }
                }
                return service
            })

            return newList;
        })

        if (field === "currentStartTime" && getAppointmentWithOldestStartTime(newList.filter(n => n.type !== "remove")).temp_id === temp_id) {
            setCurrentAppointmentStartTime(value);
        }
    }

    const navigation = useNavigation()

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

        {isClientInfoModalVisible && <ClientInfoModal
            selectedOption={clientSelectedOption} //c
            setSelectedOption={setClientSelectedOption} //c
            setFilterPressed={setClientFilterPressed} //c
            searchClientQuery={clientSearchClientQuery}//c
            setSearchQuery={setClientSearchClientQuery}//c
            modalVisibility={modalVisibility}
            setModalVisibility={setModalVisibility}
            setEditClientModalVisibility={setIsEditClientModalVisible}
            editClientOption={() => {
            }}
            visible={isClientInfoModalVisible}
            setVisible={setIsClientInfoModalVisible}
            closeModal={() => {
                setIsClientInfoModalVisible(false);
                // dispatch(modifyClientMembershipId({type: "clear"}));
                // dispatch(clearClientInfo())
            }}
            onClose={() => {
                setIsClientInfoModalVisible(false);
                // dispatch(modifyClientMembershipId({type: "clear"}));
                // dispatch(clearClientInfo())
            }}
            phone={currentSelectedClient.mobile_1}
            name={currentSelectedClient.firstName}
            id={currentSelectedClient.id}
            deleteClientToast={() => {

            }}
        />}
        {
            modalVisibility &&
            <MoreOptionDropDownModal
                selectedOption={clientSelectedOption}
                setSelectedOption={setClientSelectedOption}
                isVisible={modalVisibility}
                onCloseModal={() => setModalVisibility(false)}
                dropdownItems={[
                    "Edit client",
                    "Delete client",
                ]}
                setOption={setClientSelectedOption}
                setModalVisibility={setModalVisibility}
            />
        }

        {isAddClientModalVisible && <NewBookingAddClientModal
            onSelect={(staff) => {
                dispatch(modifyValue({
                    field: "selectedClient",
                    value: staff
                }))
            }}
            closeModal={() => {
                setIsAddClientModalVisible(false);
            }}
        />}

        {isCancelReasonModalVisible && <BottomActionCard isVisible={isCancelReasonModalVisible}
                                                         onClose={() => setIsCancelReasonModalVisible(false)}
                                                         header={"Cancellation Reason"}
        >
            <View style={{marginHorizontal: 15, marginBottom: 20, marginTop: 10}}>
                <Text style={{fontSize: 14, fontWeight: "600"}}>Enter the reason to cancel</Text>
                <CustomTextInput type={"multiLine"}
                                 placeholder="Cancellation Reason"
                                 value={cancelReason}
                                 onChangeText={setCancelReason}
                />
                <View style={{
                    flexDirection: "row",
                    gap: 15
                }}>
                    <PrimaryButton
                        label={"Dismiss"}
                        buttonStyle={{
                            backgroundColor: Colors.white,
                            borderColor: Colors.grey250,
                            borderWidth: 1,
                            flex: 1,
                        }}
                        textStyle={[textTheme.titleSmall, {
                            color: Colors.black,
                        }]}
                        onPress={() => {
                            setIsCancelReasonModalVisible(false)
                        }}
                    />
                    <PrimaryButton
                        label={"Cancel Appointment"}
                        buttonStyle={{
                            backgroundColor: Colors.error,
                            flex: 1,
                        }}
                        textStyle={[textTheme.titleSmall]}
                        onPress={() => {
                            if (!cancelReason) {
                                toastRef.current.show("Please enter cancel reason")
                                return;
                            }

                            // editAppointmentDetailsAPI({
                            //     "booking_id": props.data.booking_id,
                            //     "status": "CANCELLED"
                            // }).then(res => {
                            //     if (res.data.status_code === 200) {
                            //         setCurrentAppointmentStatus("CANCELLED")
                            //         toastRef.current.show("Appointment Cancelled Successfully")
                            //         dispatch(loadFutureBookingsFromDB())
                            //     } else {
                            //         console.log(res.data.other_message)
                            //         toastRef.current.show(res.data.other_message, true)
                            //     }
                            // })

                            cancelAppointmentsAPI({
                                "booking_id": props.data.booking_id,
                                reason: cancelReason,
                            }).then(res => {
                                if (res.data.status_code === 200) {
                                    setCurrentAppointmentStatus("CANCELLED")
                                    toastRef.current.show("Appointment Cancelled Successfully")
                                    props.onClose()
                                } else {
                                    console.log(res.data.other_message)
                                    toastRef.current.show(res.data.other_message, true)
                                }
                            })
                        }}
                    />
                </View>
            </View>
        </BottomActionCard>}

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
                console.log("filter")
                console.log(currentServicesList.filter(c => c.type !== "remove").at(-1).currentDuration)
                console.log(item.duration)

                let totalMinutes = durationToMinutes(currentServicesList.filter(c => c.type !== "remove").at(-1).currentDuration)
                let currentTotalMinutes = durationToMinutes(item.duration)

                setCurrentServicesList(prev => [...prev, {
                    ...item,
                    temp_id: uuid.v4(),
                    service_name: item.name,
                    appointment_date: currentAppointmentDate.format("YYYY-MM-DD"),
                    currentAppointmentDate: currentAppointmentDate.format("YYYY-MM-DD"),
                    currentDuration: item.duration,
                    start_time: moment(currentServicesList.filter(c => c.type !== "remove").at(-1).currentStartTime, "hh:mm A").add(totalMinutes, "minute").format("hh:mm A"),
                    currentStartTime: moment(currentServicesList.filter(c => c.type !== "remove").at(-1).currentStartTime, "hh:mm A").add(totalMinutes, "minute").format("hh:mm A"),
                    currentSelectedStaff: null,
                    end_time: moment(currentServicesList.filter(c => c.type !== "remove").at(-1).currentStartTime, "hh:mm A").add(totalMinutes, "minute").add(currentTotalMinutes, "minute").format("hh:mm A"),
                    type: "add"
                }])
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
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    {(props.data.status !== "CANCELLED" && props.data.status !== "COMPLETED") &&
                        <CustomTextInput type="dropdown"
                                         container={{
                                             marginRight: 10,
                                             marginBottom: 0,
                                             marginVertical: 0,
                                             paddingVertical: 0,
                                         }}
                                         labelEnabled={false}
                                         dropdownButton={{
                                             width: 125,
                                             borderRadius: 1000,
                                             marginVertical: 0,
                                             paddingVertical: 0
                                         }}
                                         dropdownPressable={{paddingVertical: 5, paddingHorizontal: 15}}
                                         dropdownLabelTextStyle={{fontSize: 14}}
                                         value={{
                                             label: getStatusColorAndText(currentAppointmentStatus).text,
                                             value: currentAppointmentStatus
                                         }}
                                         overrideDisplayText={"Change"}
                                         onChangeValue={(status) => {
                                             if (status.value === "CANCELLED") {
                                                 setIsCancelReasonModalVisible(true);
                                                 return;
                                             }

                                             editAppointmentDetailsAPI({
                                                 "status": status.value,
                                                 "booking_id": props.data.booking_id
                                             }).then(res => {
                                                 if (res.data.status_code === 200) {
                                                     setCurrentAppointmentStatus(status.value)
                                                     toastRef.current.show("Status updated successfully")
                                                     dispatch(loadFutureBookingsFromDB())
                                                 } else {
                                                     console.log(res.data.other_message)
                                                     toastRef.current.show(res.data.other_message, true)
                                                 }
                                             })
                                         }}
                                         placeholder={"Change"}
                                         object={true}
                                         objectName="label"
                                         dropdownItems={appointmentStatuses}/>}
                    {(props.data.status !== "CANCELLED" && props.data.status !== "COMPLETED") && <PrimaryButton
                        buttonStyle={{
                            marginVertical: 0,
                            paddingVertical: 0,
                            backgroundColor: Colors.white,
                        }}
                        pressableStyle={styles.closeButtonPressable}
                        onPress={() => {
                            setIsEditingAllowed(prev => !prev);
                        }}
                    >
                        <Feather name="edit" size={24} color="black"/>
                    </PrimaryButton>}
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
                        // showDropdownArrowIcon={isEditingAllowed}
                        // disableOnPress={!isEditingAllowed}
                                     showDropdownArrowIcon={false}
                                     disableOnPress={true}
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
                                         modifyCurrentServiceData(currentServicesList[0].temp_id, "type", "edit")
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
                                onPress={() => {
                                    dispatch(loadClientInfoFromDb(currentSelectedClient.id));
                                    dispatch(loadAnalyticsClientDetailsFromDb(currentSelectedClient.id));
                                    setIsClientInfoModalVisible(true)
                                }}
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
                                  data={currentServicesList.filter(service => service.type !== "remove")}
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
            {(props.data.status !== "CANCELLED" && props.data.status !== "COMPLETED") && < PrimaryButton
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
                        const editedServices = currentServicesList.filter(service => service.type === "edit")
                        const addedServices = currentServicesList.filter(service => service.type === "add")
                        const deletedServices = currentServicesList.filter(service => service.type === "remove")

                        if (editedServices.some(e => e.currentSelectedStaff === null) || addedServices.some(a => a.currentSelectedStaff === null)) {
                            toastRef.current.show("Please assign staff", true);
                            return;
                        }

                        setIsSaveEditAppointmentLoading(true)
                        editAppointmentDetailsAPI({
                            appointment_date: currentAppointmentDate.format("YYYY-MM-DD"),
                            booking_id: props.data.booking_id,
                            client_id: currentSelectedClient.id,
                            notes: currentNotes,
                            services_list: [...addedServices.map(addedService => {
                                return {
                                    appointment_id: viewAppointmentDetails.apptList[0].appt_id,
                                    res_cat_id: addedService.id,
                                    resource_id: addedService.currentSelectedStaff.id,
                                    date: addedService.currentAppointmentDate,
                                    duration: addedService.currentDuration,
                                    start_time: addedService.currentStartTime,
                                    end_time: addedService.end_time,
                                    mode: "add"
                                }
                            }), ...editedServices.map(editedService => {
                                let totalMinutes = durationToMinutes(editedService.currentDuration)

                                return {
                                    appointment_id: viewAppointmentDetails.apptList[0].appt_id,
                                    resource_id: editedService.currentSelectedStaff.id,
                                    duration: editedService.currentDuration,
                                    start_time: editedService.currentStartTime,
                                    end_time: moment(editedService.currentStartTime, "hh:mm A").add(totalMinutes, "minute").format("hh:mm A"),
                                    mode: "edit"
                                }
                            }), ...deletedServices.map(deletedService => {
                                return {
                                    appointment_id: deletedService.appt_id,
                                    mode: "remove"
                                }
                            })],
                            type: "reschedule"
                        }).then((res) => {
                            console.log("HHHHHH")
                            console.log("resres")
                            console.log(res.data)
                            checkAPIError(res)
                            setIsSaveEditAppointmentLoading(false)
                            props.onClose();
                        }).catch((err) => {
                            setIsSaveEditAppointmentLoading(false)
                            console.log(err.data.other_message)
                            toastRef.current.show(err.data.other_message, true);
                            return;
                        })
                    } else {
                        setIsSaveEditAppointmentLoading(true);

                        await clearCartAPI();
                        await dispatch(clearLocalCart());
                        await dispatch(loadClientInfoFromDb(currentSelectedClient.id));
                        await dispatch(loadAnalyticsClientDetailsFromDb(currentSelectedClient.id));
                        await dispatch(updateClientId(currentSelectedClient.id));
                        await dispatch(getRewardPointBalance(currentSelectedClient.id));

                        await Promise.all(currentServicesList.map(async (service) => {
                            await dispatch(addItemToCart({
                                resource_category: service.id,
                                resource_id: service.currentSelectedStaff.id,
                                service_time: durationToMinutes(service.currentDuration),
                                start_time: service.currentStartTime,
                            }));
                        }));

                        dispatch(modifyAppointmentSliceValue({field: "isBookingCheckout", value: true}))
                        dispatch(modifyAppointmentSliceValue({
                            field: "cartGroupingId",
                            value: viewAppointmentDetails.apptList[0].grouping_id
                        }))
                        dispatch(modifyAppointmentSliceValue({field: "cartBookingId", value: props.data.booking_id}))

                        setIsSaveEditAppointmentLoading(false);
                        props.onClose();
                        navigation.navigate("Checkout");
                    }
                }}
                buttonStyle={{alignSelf: "stretch"}}>
                {isSaveAppointmentLoading ? <View style={{
                        height: 20,
                    }}><ThreeDotActionIndicator/>
                    </View> :
                    <Text
                        style={[textTheme.titleSmall, {color: Colors.onButton}]}>{isEditingAllowed ? "Save Changes" : "Checkout"}</Text>}
            </PrimaryButton>
            }
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