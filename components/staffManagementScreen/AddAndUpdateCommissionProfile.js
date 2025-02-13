import {Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import BottomActionCard from "../../ui/BottomActionCard";
import Toast from "../../ui/Toast";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {Checkbox, Divider, RadioButton} from "react-native-paper";
import Colors from "../../constants/Colors";
import React, {useEffect, useRef, useState} from "react";
import CustomTextInput from "../../ui/CustomTextInput";
import Popover from "react-native-popover-view";
import {Row, Table} from "react-native-table-component";
import CommissionByTarget from "./CommissionByTarget";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {useDispatch, useSelector} from "react-redux";
import {
    getListOfCommissionProfile,
} from "../../store/staffSlice";
import getCommissionProfileDetailsAPI from "../../apis/staffManagementAPIs/getCommissionProfileDetailsAPI";
import updateCommissionProfileAPI from "../../apis/staffManagementAPIs/updateCommissionProfileAPI";
import calculateCommissionValueByIdAPI from "../../apis/staffManagementAPIs/calculateCommissionValueByIdAPI";
import {capitalizeFirstLetter, checkNullUndefined} from "../../util/Helpers";
import {
    transformData,
    transformDataForQualifyingItem
} from "../../apis/staffManagementAPIs/staffCommissionsHelperFunctions";
// import _ from "lodash";
import deleteStaffCommissionAPI from "../../apis/staffManagementAPIs/deleteStaffCommissionAPI";
import getListOfDataToDisplayForStaffCommissionProfile
    from "../../apis/staffManagementAPIs/getDataToDisplayForStaffCommissionProfile";


export default function AddAndUpdateCommissionProfile(props) {


    const dispatch = useDispatch();

    const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState();
    const toastRef = useRef(null);

    const [itemOrTarget, setItemOrTarget] = useState(props.edit ? props.data.profile_type === "commission by item" ? 1 : 2 : 1);
    const [profileName, setProfileName] = useState(props.edit ? props.data.profile_name : "");
    const [includeTax, setIncludeTax] = useState(props.edit ? itemOrTarget === 1 ? props.data.tax_enabled : props.data.include_tax : false);

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [targetMapping, setTargetMapping] = useState([
        {
            type_id: null,
            commission_from: 0,
            commission_to: 0,
            commission_percentage: 0,
            activation: true,
        },
    ]);
    const [qualifyingItems, setQualifyingItems] = useState([]);
    const [targetTier, setTargetTier] = useState("");
    const [computationalInterval, setComputationalInterval] = useState("");

    const [isLesserThenPrev, setIsLesserThenPrev] = useState(false);
    const [isFieldsEmpty, setIsFieldsEmpty] = useState(false);

    const [services, setServices] = useState([]);
    const [products, setProducts] = useState([]);
    const [membership, setMembership] = useState([]);
    const [packages, setPackages] = useState([]);
    const [prepaid, setPrepaid] = useState([]);
    const [custom_services, setCustom_services] = useState([]);

    const staffCommissionItem = useSelector(state => state.staff.staffCommissionItem);

    const [itemType, setItemType] = useState("Services")
    const [value, setValue] = useState(0);
    const [priceToggle, setPriceToggle] = useState("PERCENTAGE");

    const [currentDataForTarget, setCurrentDataForTarget] = useState({});

    const widthArr = [200, 120 ,200, 80];

    const profileNameRef = useRef(null);
    const computationalIntervalRef = useRef(null);
    const targetTierRef = useRef(null);






    // console.log(Object.keys(membership));



    useEffect(() => {

        async function f1() {

            if(itemOrTarget === 1) {
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
                    const response = await getListOfDataToDisplayForStaffCommissionProfile(itemType === "Custom services" ? "Custom_services" : itemType, props.edit ? props.data.id : undefined)


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
                        setPrepaid(response);
                    }
                    if(itemType === "Custom services") {
                        setCustom_services(response);
                    }



                    if(response[key] && response[key].length > 0) {
                        setPriceToggle(response[0].commission_type)
                    }
                }
            }

        }
        f1().then(() => {
            console.log("then ----------------------------------")
        })



        async function f() {
            const response = await getCommissionProfileDetailsAPI(props.data.id);

            if(response.data.other_message === null || response.data.other_message === "") {
                const data = response.data.data[0];
                setCurrentDataForTarget(data);
                const qualifying_items = data.qualifying_items
                setQualifyingItems(qualifying_items);
                setSelectedOptions(qualifying_items.map((item, index) => item.type === "Custom_services" ? "Custom services" : item.type ));
                setComputationalInterval(capitalizeFirstLetter(props.data.computation_interval))
                setIncludeTax(data.tax_enabled);
                setTargetTier(data.target_tier === "ZERO BASED" ? "Zero based" : "Progressive");
                setTargetMapping(data.target_mapping)
            }
            else {
                toastRef.current.show(response.data.other_message)
            }
        }

        if(props.edit && props.data.profile_type === "commission by target") {
            f()
        }

        console.log("kuyftdrgfgthyujikohugyfd")
    }, [itemType, itemOrTarget])





    async function onSave() {
        const profileNameValid = profileNameRef.current();
        const computationalIntervalValid = itemOrTarget === 2 ? computationalIntervalRef.current() : true;
        const targetTierValid = itemOrTarget === 2 ? targetTierRef !== "" : true;
        const targetMappingValid = itemOrTarget === 2 ? targetMapping[0].commission_percentage !== 0 && targetMapping[0].commission_to !== 0 : true;

        if(!profileNameValid || !computationalIntervalValid || !targetTierValid || !targetMappingValid) {
            if(!targetTierValid) {
                toastRef.current.show("target tier is required");
            }
            else if(!targetMappingValid) {
                toastRef.current.show("target mapping is required");
            }
            return
        }

        if(selectedOptions.length === 0) {
            toastRef.current.show("qualifying item is required");
            return
        }


        try {
            const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/addCommissionProfile", {
                profile_name: profileName,
                tax_enabled: includeTax,
                profile_type: itemOrTarget === 1 ? "commission by item" : "commission by target",
                business_id: await SecureStore.getItemAsync('businessId'),
                qualifying_items: itemOrTarget === 1 ? [] : selectedOptions.map((item) => ({
                    type: item,
                    type_id: null
                })),
                target_tier: itemOrTarget === 1 ? "" : targetTier || "ZERO BASED",
                target_mapping: itemOrTarget === 1 ? [] : targetMapping.map(({ commission_from, commission_to, commission_percentage, type_id }) => ({
                    commission_from,
                    commission_to: commission_to.toString(),
                    commission_percentage: commission_percentage.toString(),
                    type_id: type_id || null
                })),
                Services: itemOrTarget === 1 ? services.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Products: itemOrTarget === 1 ? (products).map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Membership: itemOrTarget === 1 ? (membership).map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Packages: itemOrTarget === 1 ? (packages).map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Prepaid: itemOrTarget === 1 ? (prepaid).map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Custom_services: itemOrTarget === 1 ? (custom_services).map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                computation_interval: itemOrTarget === 1 ? null : computationalInterval || "MONTHLY"

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
                toastRef.current.show(response.data.other_message);

            }
        }
        catch (e) {

        }
    }
    async function onEdit() {
        const profileNameValid = profileNameRef.current();
        const computationalIntervalValid = itemOrTarget === 2 ? computationalIntervalRef.current() : true;
        const targetTierValid = itemOrTarget === 2 ? targetTierRef !== "" : true;
        const targetMappingValid = itemOrTarget === 2 ? targetMapping[0].commission_percentage !== 0 && targetMapping[0].commission_to !== 0 : true;

        if(!profileNameValid || !computationalIntervalValid || !targetTierValid || !targetMappingValid) {
            if(!targetTierValid) {
                toastRef.current.show("target tier is required");
            }
            else if(!targetMappingValid) {
                toastRef.current.show("target mapping is required");
            }
            return
        }

        if(selectedOptions.length === 0) {
            toastRef.current.show("qualifying item is required");
            return
        }

        const response = await updateCommissionProfileAPI(
            {
                id: props.data.id,
                profile_name: profileName,
                tax_enabled: includeTax,
                profile_type: itemOrTarget === 1 ? "commission by item" : "commission by target",
                business_id: await SecureStore.getItemAsync('businessId'),
                Services: itemOrTarget === 1 ? services.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Products: itemOrTarget === 1 ? products.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Membership: itemOrTarget === 1 ? membership.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Packages: itemOrTarget === 1 ? packages.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Prepaid: itemOrTarget === 1 ? prepaid.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                Custom_services: itemOrTarget === 1 ? custom_services.map(({ data_id, commission_type, commission_value, type_id }) => ({
                    data_id: String(data_id),
                    commission_type,
                    commission_value,
                    type_id
                })) : [],
                qualifying_items: itemOrTarget === 1 ? [] : transformDataForQualifyingItem(currentDataForTarget.qualifying_items, selectedOptions),
                target_tier: itemOrTarget === 1 ? "" : targetTier,
                target_mapping:  itemOrTarget === 1 ? [] :  transformData(currentDataForTarget.target_mapping, targetMapping),
                computation_interval: itemOrTarget === 1 ? null : computationalInterval
            }
        );

        if(response.data.other_message === "" || response.data.other_message === null) {
            toastRef.current.show(response.data.message)
            props.onClose();
            dispatch(getListOfCommissionProfile());
        }
        else {
            toastRef.current.show(response.data.other_message);
        }
    }



    // console.log(itemOrTarget)

    function CheckBoxContainer() {
        return <View style={{flexDirection: "row", alignItems: "center"}}>
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
                        onChangeText={() => {}}
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
                    {/*<TextInput />*/}
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

            // flexArr={flexArr}
        />
    }

    return <Modal
        visible={props.visible}
        animationType={"slide"}
        style={styles.modal}
        onRequestClose={props.onClose}
        presentationStyle={"formSheet"}
    >
        <Toast ref={toastRef}/>
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

            />
        }
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleLarge, styles.titleText]}>{props.edit ? "Update Commission Profile" : "Add Commission Profile"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={() => {
                    props.onClose();
                    setServices([]);
                    setProducts([]);
                    setPackages([]);
                    setMembership([]);
                    setCustom_services([]);
                    setComputationalInterval([])
                    setTargetTier([])
                    setQualifyingItems([])
                    setIsFieldsEmpty([])
                    setIsLesserThenPrev([])
                    setTargetMapping([])
                    setSelectedOptions([])
                    setCurrentDataForTarget("")
                }}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>

        <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} style={{}}>
                <PrimaryButton
                    buttonStyle={styles.radioButtonStyle}
                    pressableStyle={styles.radioButtonPressable}
                    onPress={() => setItemOrTarget(1)}
                >

                    <RadioButton
                        value={"item"}
                        status={itemOrTarget === 1 ? "checked" : "unchecked"}
                        onPress={() => setItemOrTarget(1)}
                        color={Colors.highlight}
                        uncheckedColor={Colors.highlight}
                        />
                    <Text style={[textTheme.bodyMedium, {paddingRight: 4}]}>Commission by item</Text>
                    <Popover
                        from={<MaterialCommunityIcons name="information-outline" size={24} color="black"/>}
                    >
                        <Text style={[textTheme.bodyMedium, {padding: 8}]}>Set commission by percentage or by
                            value for sale items like services, products,
                            membership, packages,
                            prepaid and custom inherits</Text>

                    </Popover>

                </PrimaryButton>
                <PrimaryButton
                    buttonStyle={styles.radioButtonStyle}
                    pressableStyle={styles.radioButtonPressable}
                    onPress={() => setItemOrTarget(2)}
                >
                    <RadioButton
                        value={"target"}
                        status={itemOrTarget === 2 ? "checked" : "unchecked"}
                        onPress={() => setItemOrTarget(2)}
                        color={Colors.highlight}
                        uncheckedColor={Colors.highlight}
                    />
                    <Text style={[textTheme.bodyMedium, {paddingRight: 4}]}>Commission by target</Text>
                    <Popover
                        from={<MaterialCommunityIcons name="information-outline" size={24} color="black"/>}
                    >
                        <Text style={[textTheme.bodyMedium, {padding: 8}]}>Set commission slab for staff to meet
                            in a given time</Text>

                    </Popover>
                </PrimaryButton>

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
                {
                    itemOrTarget === 1 ?
                        <>

                        <CheckBoxContainer />

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>

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
                                                onPress={() => setPriceToggle("AMOUNT")}
                                            />
                                            <PrimaryButton
                                                label={"%"}
                                                buttonStyle={[styles.toggleButton, {backgroundColor: priceToggle === "PERCENTAGE" ? Colors.highlight80 : Colors.white}]}
                                                pressableStyle={styles.toggleButtonPressable}
                                                textStyle={{color: Colors.black}}
                                                onPress={() => setPriceToggle("PERCENTAGE")}
                                            />
                                        </View>
                                        <PrimaryButton
                                            label={"Apply all"}
                                            onPress={async () => {
                                                if(itemOrTarget === 1) {
                                                    const key = itemType === "Custom services" ? "Custom_services" : itemType;

                                                    const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/getListOfDatasToDisplay", {
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

                                                    const formattedData = response.data.data.flatMap(category =>
                                                        category.resource_categories.map(item => ({
                                                            ...item,
                                                            gender: category.gender
                                                        }))
                                                    );



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



                                                }
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
                                      keyExtractor ={(item) => item.data_id.toString()}
scrollEnabled={false}
                                       // estimatedItemSize={600}

                            />
                            </View>



                        </Table>
                    </ScrollView>
                    </> :
                        <CommissionByTarget
                            checkBox={<CheckBoxContainer />}
                            toastRef={toastRef}
                            setComputationalInterval={setComputationalInterval}
                            computationalInterval={computationalInterval}
                            setTargetTier={setTargetTier}
                            targetTier={targetTier}
                            setQualifyingItems={setQualifyingItems}
                            qualifyingItems={qualifyingItems}
                            setIsFieldsEmpty={setIsFieldsEmpty}
                            isFieldsEmpty={isFieldsEmpty}
                            setIsLesserThenPrev={setIsLesserThenPrev}
                            isLesserThenPrev={isLesserThenPrev}
                            setTargetMapping={setTargetMapping}
                            targetMapping={targetMapping}
                            setSelectedOptions={setSelectedOptions}
                            selectedOptions={selectedOptions}
                            currentDataForTarget={currentDataForTarget}
                            computationalIntervalRef={computationalIntervalRef}
                            targetTierRef={targetTierRef}

                        />
                }


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

        </View>


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
        justifyContent: "center",
        textAlign: "center",
    },
    modal: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 12,

    },
    radioButtonStyle: {
        backgroundColor: Colors.white,

    },
    radioButtonPressable: {
        justifyContent: "flex-start",
        flexDirection: "row",
        paddingHorizontal: 0,
    },
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
    }
})

const borderLeftWidthColor = {
    borderLeftWidth: 1,
    borderLeftColor: Colors.grey400,
}

const borderRightWidthColor = {
    borderRightWidth: 1,
    borderRightColor: Colors.grey400,
}