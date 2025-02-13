import {FlatList, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import {Divider} from "react-native-paper";
import React, {useEffect, useRef, useState} from "react";
import Colors from "../../constants/Colors";
import CheckBox from "react-native-check-box";
import {useDispatch, useSelector} from "react-redux";
import ContentLoader from "../../ui/ContentLoader";
import addServicesForStaffAPI from "../../apis/staffManagementAPIs/addServicesForStaffAPI";
import Toast from "../../ui/Toast";

export default function AssignServicesModal(props) {

    const dispatch = useDispatch();

    const isFetching = useSelector(state => state.staff.isFetching);
    const allServices = useSelector(state => state.staff.allServices);



    const [services, setServices] = useState(allServices.services);


    const toastRef = useRef(null);

    // console.log(JSON.stringify(services, null, 2));
    useEffect(() => {
        setServices(allServices.services);
    }, [isFetching])

    // Toggle all services and sub-services
    const toggleAllServices = () => {
        const allChecked = services.every(service => service.activation_for_check);
        const updatedServices = services.map(service => ({
            ...service,
            activation_for_check: Number(!allChecked),
            sub_services: service.sub_services.map(sub => ({
                ...sub,
                staff_activation: Number(!allChecked),
            })),
        }));


        setServices(updatedServices);
    };

    // Toggle a main service and its sub-services
    const toggleMainService = (index) => {
        const updatedServices = services.map((service, idx) => {
            if (idx === index) {
                const newState = Number(!service.activation_for_check);
                return {
                    ...service,
                    activation_for_check: newState,
                    sub_services: service.sub_services.map(sub => ({
                        ...sub,
                        staff_activation: newState,
                    })),
                };
            }
            return service;
        });

        setServices(updatedServices);
    };

    // Toggle an individual sub-service
    const toggleSubService = (mainIndex, subIndex) => {
        const updatedServices = services.map((service, idx) => {
            if (idx === mainIndex) {
                const updatedSubServices = service.sub_services.map((sub, subIdx) => {
                    if (subIdx === subIndex) {
                        const newStaffActivation = sub.staff_activation === 0 ? 1 : 0;
                        return { ...sub, staff_activation: newStaffActivation };
                    }
                    return sub;
                });

                const allSubServicesActive = updatedSubServices.every(sub => sub.staff_activation === 1);
                return { ...service, sub_services: updatedSubServices, activation_for_check: allSubServicesActive };
            }
            return service;
        });


        setServices(updatedServices);
    };

    return <Modal
        visible={props.visible}
        animationType={"slide"}
    >
        <Toast ref={toastRef}/>
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleLarge, styles.titleText]}>{props.staffName}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={() => {
                    props.onClose();
                    // dispatch(updateAllServices({}));

                }}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        {
            isFetching ?
                <ContentLoader
                    row={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
                    size={[

                    ]}
                /> :
                <>
            <View style={styles.modalContent}>

                <View style={styles.definitionContainer}>
                    <Text style={[textTheme.titleMedium]}>Services</Text>
                    <Text style={[textTheme.bodyMedium]}>
                        Add the services this team member can offer.
                    </Text>
                </View>


                <View style={styles.container}>
                    {/* All Services Checkbox */}
                    <Divider />
                    <Pressable
                        style={[styles.checkboxContainer, {paddingVertical: 12}]}
                        onPress={toggleAllServices}
                    >
                        <CheckBox
                            isChecked={Array.isArray(services) ? Boolean(services.every(service => service.activation_for_check)) : false}
                            onClick={toggleAllServices}
                            checkBoxColor={Colors.highlight}
                            uncheckedCheckBoxColor={Colors.grey500}
                        />
                        <Text style={[textTheme.titleMedium]}>All Services</Text>
                    </Pressable>

                    {/* Render Services */}
                    <FlatList
                        data={services}
                        keyExtractor={(item, index) => `${item.main_service_name}-${index}`}
                        renderItem={({ item, index }) => (
                            <View style={styles.mainServices}>
                                {/* Main Service */}
                                <Divider />
                                <Pressable
                                    style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8}}
                                    onPress={() => toggleMainService(index)}
                                >
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            isChecked={item.activation_for_check}
                                            onClick={() => toggleMainService(index)}
                                            checkBoxColor={Colors.highlight}
                                            uncheckedCheckBoxColor={Colors.grey500}
                                        />
                                        <Text style={[textTheme.titleMedium]}>{item.main_service_name}</Text>
                                    </View>
                                    <View
                                        style={
                                            [styles.genderTextContainer,
                                                {borderColor:
                                                        item.main_service_gender === "Women" ? Colors.orange :
                                                            item.main_service_gender === "Men" ? Colors.highlight :
                                                                item.main_service_gender === "Kids" ? Colors.error :
                                                                    Colors.brown
                                                }
                                            ]}>
                                        <Text
                                            style={[textTheme.labelMedium, styles.genderText]}>{item.main_service_gender}</Text>
                                    </View>
                                </Pressable>
                                <Divider />

                                {/* Sub-services */}
                                {item.sub_services.map((sub, subIndex) => (
                                    <Pressable
                                        key={sub.sub_service_id}
                                        onPress={() => toggleSubService(index, subIndex)}
                                        style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8}}
                                    >
                                        <View key={sub.sub_service_id} style={styles.subCheckboxContainer}>
                                            <CheckBox
                                                isChecked={sub.staff_activation === 1}
                                                onClick={() => toggleSubService(index, subIndex)}
                                                checkBoxColor={Colors.highlight}
                                                uncheckedCheckBoxColor={Colors.grey500}
                                            />
                                            <Text style={[textTheme.bodyMedium]}>{sub.sub_service_name}</Text>
                                        </View>
                                        <Text style={[textTheme.bodyMedium]}>{"₹ " + sub.staff_price}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}

                    />

                </View>
                <PrimaryButton
                    label={"Save"}
                    onPress={async () => {
                        const filterChangedActivations = (oldData, newData) => {
                            const extractActivations = (data) => {
                                return data.flatMap(service =>
                                    service.sub_services.map(subService => ({
                                        id: parseInt(subService.staff_id) || -1,
                                        activation: subService.staff_activation === 1 ? 1 : 0,
                                        price: subService.staff_price,
                                        resource_category: parseInt(subService.staff_resource_category),
                                        service_time: subService.staff_service_time,
                                    }))
                                );
                            };

                            const oldActivations = extractActivations(oldData);
                            const newActivations = extractActivations(newData);

                            return newActivations.filter(newItem => {
                                const oldItem = oldActivations.find(old => old.id === newItem.id);
                                return oldItem && oldItem.activation !== newItem.activation;
                            });
                        };
                        const res = await addServicesForStaffAPI(props.id, filterChangedActivations(allServices.services, services));

                        if(res.data.status_code === 200) {

                            props.toastRef.current.show(res.data.message);
                            props.onClose();
                        }
                        else {
                            console.log("sdf")
                            toastRef.current.show(res.data.other_message);
                        }



                    }}

                />




            </View>

            </>

        }


    </Modal>
}

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
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
        justifyContent: "center",
        textAlign: "center",
    },
    container: {
        flex: 1,
    },
    mainServices: {
        // paddingLeft: 24
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        gap: 8
    },
    subCheckboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        gap: 8
    },
    genderTextContainer: {
        borderWidth: 1.3,
        borderRadius: 7,
        justifyContent: "center"
    },
    genderText: {
        paddingVertical: 4,
        paddingHorizontal: 8,

    },
    definitionContainer: {
        marginBottom: 8
    }
})