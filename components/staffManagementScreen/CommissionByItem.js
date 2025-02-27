import {Dimensions, FlatList, ScrollView, StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import {Checkbox, RadioButton} from "react-native-paper";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import Popover from "react-native-popover-view";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import CustomTextInput from "../../ui/CustomTextInput";
import {Row, Table} from "react-native-table-component";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, {useEffect, useRef, useState} from "react";
import calculateCommissionValueByIdAPI from "../../apis/staffManagementAPIs/calculateCommissionValueByIdAPI";
import BottomActionCard from "../../ui/BottomActionCard";
import deleteStaffCommissionAPI from "../../apis/staffManagementAPIs/deleteStaffCommissionAPI";
import {getListOfCommissionProfile} from "../../store/staffSlice";
import getListOfDataToDisplayForStaffCommissionProfile
    from "../../apis/staffManagementAPIs/getDataToDisplayForStaffCommissionProfile";

import updateCommissionProfileAPI from "../../apis/staffManagementAPIs/updateCommissionProfileAPI";
import {useDispatch} from "react-redux";

const screenWidth = Dimensions.get("screen").width;

export default function CommissionByItem(props) {

    const dispatch = useDispatch();

    const [profileName, setProfileName] = useState(props.edit ? props.data.profile_name : "");

    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);
    const [membership, setMembership] = useState([]);
    const [packages, setPackages] = useState([]);
    const [prepaid, setPrepaid] = useState([]);
    const [custom_services, setCustom_services] = useState([]);

    const [includeTax, setIncludeTax] = useState(props.edit ?  props.data.include_tax : false);

    const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState();




    const [itemType, setItemType] = useState("Services")
    const [value, setValue] = useState(0);
    const [priceToggle, setPriceToggle] = useState("PERCENTAGE");


    const widthArr = (screenWidth > 500 ? [screenWidth*0.4, screenWidth*0.2, screenWidth*0.3, screenWidth*0.1] : [200, 120 ,200, 80]);

    const profileNameRef = useRef(null);

    const [isValueChanged, setIsValueChanged] = useState({
        Services: false,
        Products: false,
        Prepaid: false,
        "Custom services": false,
        Membership: false,
        Packages: false,
    })



    useEffect(() => {

        async function f1() {
            const key = itemType === "Custom services" ? "Custom_services" : itemType;
            if ((itemType === "Services" ?
                    services :
                    itemType === "Products" ?
                        products :
                        itemType === "Membership" ?
                            membership :
                            itemType === "Prepaid" ?
                                prepaid :
                                itemType === "Packages" ?
                                    packages : custom_services
            )?.length === 0) {
                getListOfDataToDisplayForStaffCommissionProfile(itemType === "Custom services" ? "Custom_services" : itemType, props.edit ? props.data.id : undefined).then((response) => {
                    if(itemType === "Services") {
                        setServices(response);
                    }
                    if (itemType === "Products") {
                        setProducts(response);
                    }
                    if (itemType === "Membership") {
                        setMembership(response);
                    }
                    if (itemType === "Packages") {
                        setPackages(response);
                    }
                    if (itemType === "Prepaid") {
                        setPrepaid(response[0].resource_categories);
                    }
                    if(itemType === "Custom services") {
                        // console.log(response)
                        setCustom_services(response[0].resource_categories);
                    }


                    if(response.length > 0 && Object.keys(response[0]).length > 0) {
                        setPriceToggle(response[0].commission_type)
                    }
                })
            }

        }

        f1().then(() => {
            console.log("then ----------------------------------")
        })
    }, [itemType])



    async function onSave() {
        const profileNameValid = profileNameRef.current();

        if(!profileNameValid) {
            return
        }

        if((Object.values(isValueChanged)).every((value) => value === false)) {
            props.toastRef.current.show("Please enter a commission value");
            return;
        }

        try {
            const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/addCommissionProfile", {
                    profile_name: profileName,
                    tax_enabled: includeTax,
                    profile_type: "commission by item",
                    business_id: await SecureStore.getItemAsync('businessId'),
                    qualifying_items: [] ,
                    target_tier: "",
                    target_mapping:  [],
                    Services: isValueChanged[itemType] ? services.map(({ data_id, commission_type, commission_value, type_id }) => ({
                        data_id: String(data_id),
                        commission_type: priceToggle,
                        commission_value,
                        type_id
                    })) : [],
                    Products: isValueChanged[itemType] ? (products).map(({ data_id, commission_type, commission_value, type_id }) => ({
                        data_id: String(data_id),
                        commission_type: priceToggle,
                        commission_value,
                        type_id
                    })) : [] ,
                    Membership: isValueChanged[itemType] ? (membership).map(({ data_id, commission_type, commission_value, type_id }) => ({
                        data_id: String(data_id),
                        commission_type: priceToggle,
                        commission_value,
                        type_id
                    })) : [],
                    Packages: isValueChanged[itemType] ? (packages).map(({ data_id, commission_type, commission_value, type_id }) => ({
                        data_id: String(data_id),
                        commission_type: priceToggle,
                        commission_value,
                        type_id
                    })) : [],
                    Prepaid: isValueChanged[itemType] ? (prepaid).map(({ data_id, commission_type, commission_value, type_id }) => ({
                        data_id: String(data_id),
                        commission_type: priceToggle,
                        commission_value,
                        type_id
                    })) : [],
                    Custom_services: isValueChanged[itemType] ? (custom_services).map(({ data_id, commission_type, commission_value, type_id }) => ({
                        data_id: String(data_id),
                        commission_type: priceToggle,
                        commission_value,
                        type_id
                    })) : [],
                    computation_interval: null

                },
                {
                    headers: {
                        'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
                    }
                });

            if(response.data.other_message === "" || response.data.other_message === null ) {
                props.toastRef.current.show(response.data.message)
                props.onClose();
                dispatch(getListOfCommissionProfile());
            }
            else {
                props.toastRef.current.show(response.data.other_message);
            }
        }
        catch (e) {
            props.toastRef.current.show(e.response.data.other_message, true);

        }
    }



    async function onEdit() {

        const profileNameValid = profileNameRef.current();

        if(!profileNameValid) {
            return
        }

        if((Object.values(isValueChanged)).every((value) => value === false)) {
            props.toastRef.current.show("Please enter a commission value");
            return;
        }


        const response = await updateCommissionProfileAPI(
            {
                id: props.data.id,
                profile_name: profileName,
                tax_enabled: includeTax,
                profile_type: "commission by item",
                business_id: await SecureStore.getItemAsync('businessId'),
                Services: isValueChanged[itemType] ? services.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type: priceToggle,
                    commission_value,
                    type_id
                })) : [],
                Products: isValueChanged[itemType] ? products.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type: priceToggle,
                    commission_value,
                    type_id
                })) : [],
                Membership: isValueChanged[itemType] ? membership.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type: priceToggle,
                    commission_value,
                    type_id
                })) : [],
                Packages: isValueChanged[itemType] ? packages.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type: priceToggle,
                    commission_value,
                    type_id
                })) : [],
                Prepaid: isValueChanged[itemType] ? prepaid.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type: priceToggle,
                    commission_value,
                    type_id
                })) : [],
                Custom_services: isValueChanged[itemType] ? custom_services.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type: priceToggle,
                    commission_value,
                    type_id
                })) : [],
                qualifying_items: [],
                target_tier: "",
                target_mapping:  [],
                computation_interval: null
            }
        );

        if(response.data.other_message === "" || response.data.other_message === null) {
            props.toastRef.current.show(response.data.message)
            props.onClose();
            dispatch(getListOfCommissionProfile());
        }
        else {
            props.toastRef.current.show(response.data.other_message);
        }
    }

    function renderItem({item}) {
        return <Row
            data={[
                <View>
                    {itemType === "Services" && item.gender !== "" ?
                        <View
                            style={
                                [styles.genderTextContainer,
                                    {
                                        borderColor:
                                            item.gender === "Women" ? Colors.orange :
                                                item.gender === "Men" ? Colors.highlight :
                                                    item.gender === "Kids" ? Colors.error :
                                                        Colors.brown
                                    }
                                ]}>
                            <Text
                                style={[textTheme.labelMedium, styles.genderText]}>{item.gender}</Text>
                        </View> : <></>}
                    <Text style={[textTheme.bodyMedium]}>
                        {item.name}
                    </Text>
                </View>
                ,
                <Text style={[textTheme.bodyMedium]}>
                    ₹ {item.price}
                </Text>,
                <View style={[
                    styles.percentOrValueForItemContainer,
                    {
                        flexDirection: priceToggle === "PERCENTAGE" ?
                            "row": "row-reverse"
                    }]}>
                    <CustomTextInput
                        type={"number"}
                        labelEnabled={false}
                        container={{marginBottom: 0, width: "70%"}}
                        textInputStyle={{marginVertical: 0, borderRadius: 0, borderWidth: 0}}
                        defaultValue={item.commission_value}
                        onChangeText={(text) => {
                            setIsValueChanged(prevState => ({...prevState, [itemType]: true, })
                            )}}
                        onEndEditing={async (value) => {


                            const item_type = itemType === "Custom services" ? "Custom_services" : itemType;

                            const serviceIndex = (itemType === "Services" ?
                                    services :
                                    itemType === "Products" ?
                                        products :
                                        itemType === "Membership" ?
                                            membership :
                                            itemType === "Prepaid" ?
                                                prepaid :
                                                itemType === "Packages" ?
                                                    packages : custom_services
                            ).findIndex(s => s.data_id === item.data_id);

                            if (serviceIndex !== -1) {
                                // Create a shallow copy of the existing array
                                const updatedServices = [...(itemType === "Services" ?
                                        services :
                                        itemType === "Products" ?
                                            products :
                                            itemType === "Membership" ?
                                                membership :
                                                itemType === "Prepaid" ?
                                                    prepaid :
                                                    itemType === "Packages" ?
                                                        packages : custom_services
                                )];

                                // Update only the required item
                                updatedServices[serviceIndex] = {
                                    ...updatedServices[serviceIndex],
                                    commission_value: value.toString(),
                                };

                                try {
                                    const { data } = await calculateCommissionValueByIdAPI(
                                        item_type,
                                        updatedServices[serviceIndex].commission_type,
                                        updatedServices[serviceIndex].commission_value,
                                        updatedServices[serviceIndex].data_id
                                    );

                                    updatedServices[serviceIndex].total_commission = data?.data?.[0]?.total_commission || 0;
                                } catch (error) {
                                    console.error("Error calculating commission:", error);
                                }
                                // Dispatch only the updated section to Redux
                                // dispatch(updateListOfDataForStaffCommission1({
                                //     ...staffCommissionItems,
                                //     [item_type]: updatedServices
                                // }));

                                // setStaffCommissionItems(({
                                //     ...staffCommissionItems,
                                //     [item_type]: updatedServices
                                // }));

                                if(itemType === "Services") {
                                    setServices(updatedServices);
                                }
                                else if (itemType === "Products") {
                                    setProducts(updatedServices);
                                }
                                else if (itemType === "Membership") {
                                    setMembership(updatedServices);
                                }
                                else if (itemType === "Packages") {
                                    setPackages(updatedServices);
                                }
                                else if (itemType === "Prepaid") {
                                    setPrepaid(updatedServices);
                                }
                                else if(itemType === "Custom services") {
                                    setCustom_services(updatedServices);
                                }
                            }
                        }}
                    />
                    <View style={[
                        styles.percentOrValueForItemAmountType, priceToggle === "PERCENTAGE" ? borderLeftWidthColor : borderRightWidthColor
                    ]}>
                        <Text style={[textTheme.bodyMedium]}>
                            {
                                priceToggle === "PERCENTAGE" ?
                                    "%": "₹"
                            }

                        </Text>
                    </View>
                </View>,
                <Text style={[textTheme.titleSmall]}>
                    ₹ {item.total_commission}
                </Text>

            ]}
            widthArr={widthArr}
            style={{borderBottomWidth: 0.8, paddingVertical: 24, borderBottomColor: Colors.grey400, width: '100%'}}

        />
    }







    return <>
        {
            isConfirmStaffDeleteModalVisible &&
            <BottomActionCard isVisible={isConfirmStaffDeleteModalVisible}
                              header={"Delete Commission Profile"}
                              content={"Are you sure? This action cannot be undone."}
                              onClose={() => setIsConfirmStaffDeleteModalVisible(false)}
                              onConfirm={async () => {
                                  const response = await deleteStaffCommissionAPI(props.data.id);
                                  if(response.data.other_message === "") {
                                      props.toastRef.current.show(response.data.message)
                                      props.onClose();
                                      dispatch(getListOfCommissionProfile());
                                  }
                                  else {
                                      toastRef.current.show(response.data.other_message);
                                  }
                                  setIsConfirmStaffDeleteModalVisible(false);

                              }}
                              onCancel={() => {
                                  setIsConfirmStaffDeleteModalVisible(false);
                              }}
                              headerTextStyle={{fontSize: 20, fontWeight: "600"}}

            />
        }
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{}}
            nestedScrollEnabled

        >
            <CustomTextInput
                type={"text"}
                label={"Profile name"}
                value={profileName}
                onChangeText={(text) => {
                    setProfileName(text);
                }}
                placeholder={"Profile name"}
                validator={(text) => {
                    if(text === undefined || text === "" || text.length === 0) return "Profile name is required";
                    else return true
                }}
                onSave={(callback) => profileNameRef.current = callback}
            />
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Checkbox
                    status={includeTax ? "checked" : "unchecked"}
                    onPress={() => {setIncludeTax(prev => !prev)}}
                    uncheckedColor={Colors.highlight}
                    color={Colors.highlight}

                />
                <Text
                    style={[textTheme.bodyMedium]}
                    onPress={() => {setIncludeTax(prev => !prev)}}>
                    Calculate by item sale price including tax
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                removeClippedSubviews
                nestedScrollEnabled
            >

                <Table

                    style={[styles.table]}>

                    <Row
                        data={[
                            <View >
                                <CustomTextInput
                                    textInputStyle={{marginVertical:0}}

                                    type={"dropdown"}
                                    dropdownItems={["Services", "Products", "Prepaid", "Packages", "Membership", "Custom services"]}
                                    value={itemType}
                                    onChangeValue={(item) => {
                                        const resetFunctions = {
                                            Services: setServices,
                                            Products: setProducts,
                                            Membership: setMembership,
                                            Packages: setPackages,
                                            Prepaid: setPrepaid,
                                            "Custom services": setCustom_services,
                                        };

                                        if (item !== itemType && resetFunctions[itemType] && !isValueChanged[itemType]) {
                                            resetFunctions[itemType]([]);
                                        }

                                        setItemType(item)
                                    }}
                                    labelEnabled={false}
                                    container={{marginBottom: 0, width: "70%"}}
                                />
                            </View>,
                            <View style={{flexDirection: "row", alignItems: 'center', gap: 8, borderWidth: 0}}>
                                <Text style={[textTheme.bodyMedium]}>Price</Text>
                                <CustomTextInput
                                    textInputStyle={{marginVertical:0}}
                                    type={"number"}
                                    labelEnabled={false}
                                    value={value}
                                    onChangeText={(value) => {
                                        setValue(value)
                                    }}
                                    container={{marginBottom: 0, width: "50%"}}
                                    cursorColor={Colors.black}
                                />
                            </View>,
                            <View style={{flexDirection: "row", gap: 6}}>
                                <View style={{flexDirection: "row", borderWidth: 1, borderColor: Colors.grey400, borderRadius: 8, overflow: "hidden"}}>
                                    <PrimaryButton
                                        label={" ₹ "}
                                        buttonStyle={[styles.toggleButton, {backgroundColor: priceToggle === "AMOUNT" ? Colors.highlight80 : Colors.white}]}
                                        pressableStyle={styles.toggleButtonPressable}
                                        textStyle={{color: Colors.black}}
                                        onPress={() => {
                                            setPriceToggle("AMOUNT")
                                            setIsValueChanged(prevState => ({
                                                ...prevState,
                                                [itemType]: true,
                                            }))
                                        }}
                                    />
                                    <PrimaryButton
                                        label={"%"}
                                        buttonStyle={[styles.toggleButton, {backgroundColor: priceToggle === "PERCENTAGE" ? Colors.highlight80 : Colors.white}]}
                                        pressableStyle={styles.toggleButtonPressable}
                                        textStyle={{color: Colors.black}}
                                        onPress={() => {
                                            setPriceToggle("PERCENTAGE")
                                            setIsValueChanged(prevState => ({
                                                ...prevState,
                                                [itemType]: true,
                                            }))
                                        }}
                                    />
                                </View>
                                <PrimaryButton
                                    label={"Apply all"}
                                    onPress={async () => {

                                            const key = itemType === "Custom services" ? "Custom_services" : itemType;

                                            const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/getListOfDatasToDisplayForMobileApp", {
                                                business_id: await SecureStore.getItemAsync('businessId'),
                                                commission_id: props.data.id,
                                                commission_value: value.toString(),
                                                commission_type:  priceToggle,
                                                type: key,
                                            }, {
                                                headers: {
                                                    'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
                                                }
                                            });

                                            if (!response.data.data) {
                                                return console.error("API response does not contain expected data");
                                            }

                                            const formattedData = response.data.data;



                                            // setStaffCommissionItems(prev => {
                                            //     const key = itemType === "Custom services" ? "Custom_services" : itemType;
                                            //
                                            //     return {
                                            //         ...prev,
                                            //         [key]: formattedData[key] || [],
                                            //     };
                                            // });

                                            if(itemType === "Services") {
                                                setServices(formattedData);
                                            }
                                            if (itemType === "Products") {
                                                setProducts(formattedData);
                                            }
                                            if (itemType === "Membership") {
                                                setMembership(formattedData);
                                            }
                                            if (itemType === "Packages") {
                                                setPackages(formattedData);
                                            }
                                            if (itemType === "Prepaid") {
                                                setPrepaid(formattedData);
                                            }
                                            if(itemType === "Custom services") {
                                                setCustom_services(formattedData);
                                            }

                                        setIsValueChanged(prevState => ({
                                            ...prevState,
                                            [itemType]: true,
                                        }))
                                    }}
                                />
                            </View>,
                            <View>
                                <Text>Commission</Text>
                            </View>

                        ]}
                        widthArr={widthArr}
                        style={styles.header}

                        // flexArr={flexArr}

                    />
                    <View horizontal style={{ }}>

                        <FlatList data={(itemType === "Services" ?
                                services :
                                itemType === "Products" ?
                                    products :
                                    itemType === "Membership" ?
                                        membership :
                                        itemType === "Prepaid" ?
                                            prepaid :
                                            itemType === "Packages" ?
                                                packages : custom_services
                        )}
                                  renderItem={renderItem}
                                  scrollEnabled={false}
                                  ListEmptyComponent={() => <View style={{alignItems: "center", marginTop: 15}}>
                                      <Text style={[textTheme.titleSmall]}>No data</Text>
                                  </View>
                                  }


                        />
                    </View>



                </Table>
            </ScrollView>



        </ScrollView>
        <View style={styles.bottomContainer}>
            {
                props.edit ?
                    <PrimaryButton
                        onPress={async () => {
                            setIsConfirmStaffDeleteModalVisible(true);
                        }}
                        buttonStyle={{
                            backgroundColor: "white",
                            borderWidth: 1,
                            borderColor: Colors.grey400
                        }}
                        pressableStyle={{paddingHorizontal: 8, paddingVertical: 8}}>
                        <MaterialIcons name="delete-outline" size={28} color={Colors.error}/>
                    </PrimaryButton>  : <></>
            }

            <PrimaryButton
                label={props.edit ? "Update" : "Create"}
                buttonStyle={styles.saveButton}
                onPress={props.edit ? onEdit : onSave}
            />
        </View>

    </>

}

const styles = StyleSheet.create({
    genderTextContainer: {
        borderWidth: 1.3,
        borderRadius: 6,
        justifyContent: "center",
        alignSelf: 'flex-start'
    },
    genderText: {
        paddingVertical: 4,
        paddingHorizontal: 8,

    },
    toggleButton: {
        borderRadius: 0,
    },
    toggleButtonPressable: {

    },
    table: {
        marginVertical: 32,
    },
    header: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        paddingVertical: 8,
        borderBottomColor: Colors.grey400,
        borderTopColor: Colors.grey400,
        width: '100%',

    },
    percentOrValueForItemContainer: {
        flexDirection: "row",
        alignSelf: "flex-start",
        // justifyContent: "flex-end",
        overflow: "hidden",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.grey400,
        width: "60%"


    },
    percentOrValueForItemAmountType: {
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.highlight50,
    },
    bottomContainer: {
        paddingHorizontal: 16,
        flexDirection: "row",
        gap: 18,
        marginBottom: 12
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey500,
    },
    cancelButtonText: {
        color: Colors.black,
    },
    saveButton: {
        flex: 1,
    },

})

const borderLeftWidthColor = {
    borderLeftWidth: 1,
    borderLeftColor: Colors.grey400,
}

const borderRightWidthColor = {
    borderRightWidth: 1,
    borderRightColor: Colors.grey400,
}