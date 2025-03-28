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
import NewBookingCard from "./NewBookingCard";
import {useDispatch, useSelector} from "react-redux";
import {addBooking, clearBookingData, modifyValue, updateBooking} from "../../store/newBookingSlice";
import NewBookingAddClientModal from "./NewBookingAddClientModal";
import SelectServiceModal from "./SelectServiceModal";
import BookingCard from "./BookingCard";
import TextTheme from "../../constants/TextTheme";
import calculatePriceForServiceAPI from "../../apis/appointmentsAPIs/calculatePriceForServiceAPI";
import createBookingAPI from "../../apis/appointmentsAPIs/createBookingAPI";
import ThreeDotActionIndicator from "../../ui/ThreeDotActionIndicator";
import Toast from "../../ui/Toast";
import clockDropdownData from "../../data/clockDropdownData";
import getAppointmentDetailsAPI from "../../apis/appointmentsAPIs/getAppointmentDetailsAPI";
import {
    clearCalculatedPrice,
    clearLocalCart,
    clearSalesNotes,
    modifyClientId,
    modifyClientMembershipId
} from "../../store/cartSlice";
import {clearClientInfo, loadAnalyticsClientDetailsFromDb, loadClientInfoFromDb} from "../../store/clientInfoSlice";
import ClientInfoModal from "../clientSegmentScreen/ClientInfoModal";
import MoreOptionDropDownModal from "../clientSegmentScreen/MoreOptionDropDownModal";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import clearCartAPI from "../../apis/checkoutAPIs/clearCartAPI";
import {modifyAppointmentSliceValue} from "../../store/appointmentsSlice";
import BottomActionCard from "../../ui/BottomActionCard";

const AddBookingsModal = (props) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);
    const [isSelectServiceModalVisible, setIsSelectServiceModalVisible] = useState(false);
    const date = useSelector(state => state.newBooking.date)
    const notes = useSelector(state => state.newBooking.note)
    const selectedClient = useSelector(state => state.newBooking.selectedClient)
    const appointmentStartTime = useSelector(state => state.newBooking.appointmentStartTime)
    const servicesList = useSelector(state => state.newBooking.servicesList)
    const [pickerMode, setPickerMode] = useState("date");
    const dispatch = useDispatch();
    const [finalData, setFinalData] = useState({amount: 0, duration: "0 h 0 mins"})
    const [isCreateBookingLoading, setIsCreateBookingLoading] = useState(false);
    const toastRef = useRef();
    const [isClientInfoModalVisible, setIsClientInfoModalVisible] = useState(false)

    const [modalVisibility, setModalVisibility] = useState(false)
    //Client
    const [clientSelectedOption, setClientSelectedOption] = useState()
    const [clientFilterPressed, setClientFilterPressed] = useState()
    const [clientSearchClientQuery, setClientSearchClientQuery] = useState()
    const [isEditClientModalVisible, setIsEditClientModalVisible] = useState(false)
    const [isCancelAppointmentModalVisible, setIsCancelAppointmentModalVisible] = useState(false)

    const getFirstBookingStartDate = (servicesList) => {
        let min = Infinity;
        let minIndex = 0
        servicesList.forEach((item, index) => {
            const itemTime = moment(item.preferred_date, "hh:mm A").valueOf();
            if (itemTime < min) {
                min = itemTime;
                minIndex = index;
            }
        });

        return servicesList[minIndex];
    }

    useEffect(() => {
        dispatch(modifyValue({
            field: "appointmentStartTime",
            value: moment().minutes(Math.round(moment().minutes() / 5) * 5).seconds(0).format("hh:mm A")
        }));
    }, []);

    useEffect(() => {
        const firstBooking = getFirstBookingStartDate(servicesList);
        if (firstBooking)
            dispatch(updateBooking({
                temp_id: firstBooking.temp_id,
                field: "preferred_date",
                value: appointmentStartTime
            }));
    }, [appointmentStartTime]);


    useEffect(() => {
        const firstBooking = getFirstBookingStartDate(servicesList);
        if (firstBooking)
            dispatch(modifyValue({field: "appointmentStartTime", value: firstBooking.preferred_date}))

        if (servicesList.length === 0) {
            setFinalData({amount: 0, duration: "0 h 0 mins"})
            return;
        }

        const data = servicesList.map(service => {
            return {
                "duration": service.preferred_duration.label,
                "end_time": service.end_time,
                "res_cat_id": service.id,
                "resource_id": service.preferred_staff.id,
                "start_time": service.preferred_date
            }
        })

        calculatePriceForServiceAPI({"services_list": data}).then(response => {
            setFinalData(response.data.data[0]);
        })

    }, [servicesList]);

    return <Modal style={{flex: 1}}
                  visible={props.isVisible}
                  animationType={"slide"}
                  presentationStyle={"pageSheet"}>
        {isDatePickerVisible && <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={pickerMode}
            maximumDate={props.maximumDate}
            minimumDate={props.minimumDate}
            date={moment(date).toDate()} // Initial date
            onConfirm={(selectedDate) => {
                dispatch(modifyValue({field: "date", value: moment(selectedDate).toISOString()}))
                setIsDatePickerVisible(false)
            }}
            onCancel={() => {
                setIsDatePickerVisible(false)
            }}
            themeVariant="light"
            style={{}}
        />}
        <BottomActionCard isVisible={isCancelAppointmentModalVisible}
                          headerTextStyle={{fontSize: 17}}
                          header={"Appointment has unsaved changes !"}
                          content={"Your changes will not be saved if you exit. Are you sure you want to exit this appointment?."}
                          onClose={() => {
                              setIsCancelAppointmentModalVisible(false)
                          }}
                          onConfirm={async () => {
                              await clearCartAPI();
                              dispatch(modifyClientMembershipId({type: "clear"}))
                              dispatch(clearSalesNotes());
                              dispatch(clearLocalCart());
                              dispatch(clearClientInfo());
                              dispatch(clearCalculatedPrice())
                              dispatch(modifyAppointmentSliceValue({field: "isBookingCheckout", value: false}))
                              dispatch(modifyAppointmentSliceValue({field: "cartBookingId", value: ""}))
                              dispatch(modifyAppointmentSliceValue({field: "cartGroupingId", value: ""}))
                              setIsCancelAppointmentModalVisible(false)
                              dispatch(clearBookingData());
                              props.onClose()
                          }}
                          onCancel={() => setIsCancelAppointmentModalVisible(false)}
                          confirmLabel={"Yes, Exit"}
                          cancelLabel={"Go back"}/>
        {isClientInfoModalVisible && <ClientInfoModal
            selectedOption={clientSelectedOption} //c
            setSelectedOption={setClientSelectedOption} //c
            setFilterPressed={setClientFilterPressed} //c 
            searchClientQuery={clientSearchClientQuery}//c
            setSearchQuery={setClientSearchClientQuery}//c
            isAppointment={true}
            modalVisibility={modalVisibility}
            setModalVisibility={setModalVisibility}
            setEditClientModalVisibility={setIsEditClientModalVisible}
            editClientOption={() => {
            }}
            visible={isClientInfoModalVisible}
            setVisible={setIsClientInfoModalVisible}
            closeModal={() => {
                setIsClientInfoModalVisible(false);
            }}
            onClose={() => {
                setIsClientInfoModalVisible(false);
            }}
            phone={selectedClient.mobile_1}
            name={selectedClient.firstName}
            id={selectedClient.id}
            deleteClientToast={() => {

            }}
        />}

        {isAddClientModalVisible && <NewBookingAddClientModal
            onSelect={(staff) => {
                dispatch(modifyValue({
                    field: "selectedClient",
                    value: staff
                }))
            }}
            onAddClient={async (phoneNo) => {
                console.log(process.env.EXPO_PUBLIC_API_URI)
                const response = await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URI}/business/searchCustomersOfBusiness?pageSize=50&pageNo=0`,
                    {
                        business_id: await SecureStore.getItemAsync('businessId'),
                        query: phoneNo
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${await SecureStore.getItemAsync('authKey')}`
                        }
                    }
                );
                dispatch(modifyValue({
                    field: "selectedClient",
                    value: response.data.data[0]
                }))

            }}
            closeModal={() => {
                setIsAddClientModalVisible(false);
            }}
        />}

        {isSelectServiceModalVisible && <SelectServiceModal
            onPress={(item) => {
                dispatch(addBooking({
                    ...item,
                    preferred_duration: {label: item.duration}
                }));
            }}
            isVisible={isSelectServiceModalVisible}
            onClose={() => {
                setIsSelectServiceModalVisible(false);
            }}
        />}


        <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
            <Text style={[textTheme.titleLarge, styles.selectClientText]}>New Appointment</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={() => {
                    if (servicesList.length !== 0 || selectedClient !== null) {
                        setIsCancelAppointmentModalVisible(true);
                        return
                    }
                    dispatch(clearBookingData());
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
                        onPress={() => {
                            setPickerMode("date");
                            setIsDatePickerVisible(true)
                        }}
                        buttonStyle={{
                            flex: 1,
                            backgroundColor: Colors.transparent,
                            borderRadius: 0,
                        }}
                        pressableStyle={{
                            flexDirection: "row",
                            paddingVertical: 15,
                            justifyContent: "space-evenly",
                        }}>
                        <Text style={{color: Colors.grey500, fontWeight: "700"}}>ON</Text>
                        <Text
                            style={{fontWeight: 500}}>
                            {moment(date).format("DD MMM YYYY")}
                        </Text>
                    </PrimaryButton>
                    <View style={{height: "100%", width: 1, backgroundColor: Colors.grey300}}/>
                    <CustomTextInput type="dropdown"
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
                                     value={appointmentStartTime}
                                     onChangeValue={(date) => {
                                         dispatch(modifyValue({field: "appointmentStartTime", value: date}))
                                     }}
                                     dropdownItems={clockDropdownData}>
                        <Text style={{color: Colors.grey500, fontWeight: "700"}}>AT</Text>
                    </CustomTextInput>
                </View>
                {selectedClient === null ? <PrimaryButton
                        onPress={() => {
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
                            <Text style={textTheme.titleSmall}>{selectedClient.name}</Text>
                            <Text>+91 {selectedClient.mobile_1}</Text>
                        </View>
                        <View style={{borderRadius: 1000, overflow: "hidden"}}>
                            <Pressable
                                onPress={() => {
                                    dispatch(loadClientInfoFromDb(selectedClient.id));
                                    dispatch(loadAnalyticsClientDetailsFromDb(selectedClient.id));
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
                                dispatch(modifyValue({field: "selectedClient", value: null}))
                            }}
                        >
                            <Ionicons name="close" size={25} color="black"/>
                        </PrimaryButton>
                    </View>}
                <Text style={[textTheme.titleMedium, {marginTop: 20, marginHorizontal: 15,}]}>Services</Text>
                {servicesList.length === 0 ? <View style={{
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
                            onPress={() => {
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
                                  data={servicesList}
                                  renderItem={({item}) => <NewBookingCard data={item}/>}/>
                        <PrimaryButton
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
                        </PrimaryButton>
                    </View>}


                <Text style={[textTheme.titleMedium, {marginTop: 20, marginHorizontal: 15,}]}>Notes</Text>
                <CustomTextInput type={"multiLine"}
                                 textInputStyle={{fontSize: 14, marginHorizontal: 15,}}
                                 placeholder={"Add an appointment note"}
                                 onChangeText={(text) => {
                                     dispatch(modifyValue({field: "note", value: text}))
                                 }}/>
            </ScrollView>
        </View>
        <View style={[shadowStyling, {alignItems: "center", padding: 15}]}>
            <Text
                style={[textTheme.titleMedium, {marginBottom: 10}]}>{`Total Amount       ₹${finalData.amount}    (${finalData.duration})`}</Text>
            <PrimaryButton
                onPress={isCreateBookingLoading ? null : async () => {
                    if (servicesList.length === 0) {
                        toastRef.current.show("Please select some service", true);
                        return;
                    }

                    if (selectedClient === null) {
                        toastRef.current.show("Please select client", true);
                        return;
                    }

                    if (servicesList.some(service => service.preferred_staff === "")) {
                        toastRef.current.show("Please select staff", true);
                        return;
                    }


                    // Map servicesList to the required format
                    const data = servicesList.map(service => {
                        return {
                            duration: service.preferred_duration.label,
                            end_time: service.end_time,
                            res_cat_id: service.id,
                            resource_id: service.preferred_staff.id,
                            start_time: service.preferred_date, // Format start_time
                        };
                    });

                    // Find the earliest start time
                    let earliestStartTime = null;
                    servicesList.forEach(service => {
                        const startTime = moment(service.preferred_date, "hh:mm A");
                        if (!earliestStartTime || startTime.isBefore(earliestStartTime)) {
                            earliestStartTime = startTime;
                        }
                    });

                    // Format the earliest start time as "hh:mm A"
                    const formattedStartTime = earliestStartTime ? earliestStartTime.format("hh:mm A") : "";

                    // Call the API with the earliest start time
                    setIsCreateBookingLoading(true)
                    const response = await createBookingAPI({
                        appt_date: moment(date).format("YYYY-MM-DD"), // Fix format to "YYYY-MM-DD"
                        client_id: selectedClient.id,
                        notes: notes,
                        services_list: data,
                        start_time: formattedStartTime, // Set the earliest start time
                    })
                    setIsCreateBookingLoading(false)
                    props.showToast("Appointment created successfully", false)
                    dispatch(clearBookingData());
                    props.onClose();
                }}
                buttonStyle={{alignSelf: "stretch"}}>
                {isCreateBookingLoading ? <View style={{
                        height: 20,
                    }}><ThreeDotActionIndicator/>
                    </View> :
                    <Text
                        style={[textTheme.titleSmall, {color: Colors.onButton}]}>{"Book Appointment"}</Text>}
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

export default AddBookingsModal;