import {Modal, StyleSheet, Text, View} from "react-native";
import Toast from "../../ui/Toast";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Divider, RadioButton} from "react-native-paper";
import Colors from "../../constants/Colors";
import React, {useRef, useState} from "react";
import CommissionByTarget from "./CommissionByTarget";
import CommissionByItem from "./CommissionByItem";
import Popover from "react-native-popover-view";

export default function AddAndUpdateCommissionProfile(props) {

    // const dispatch = useDispatch();
    // const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState();
    const toastRef = useRef(null);

    const [itemOrTarget, setItemOrTarget] = useState(props.edit ? props.data.profile_type === "commission by item" ? 1 : 2 : 1);
    // const [profileName, setProfileName] = useState(props.edit ? props.data.profile_name : "");
    // const [includeTax, setIncludeTax] = useState(props.edit ? itemOrTarget === 1 ? props.data.tax_enabled : props.data.include_tax : false);
    //
    // const [selectedOptions, setSelectedOptions] = useState([]);
    // const [targetMapping, setTargetMapping] = useState([
    //     {
    //         type_id: null,
    //         commission_from: 0,
    //         commission_to: "",
    //         commission_percentage: "",
    //         activation: true,
    //     },
    // ]);
    // const [qualifyingItems, setQualifyingItems] = useState([]);
    // const [targetTier, setTargetTier] = useState("");
    // const [computationalInterval, setComputationalInterval] = useState("");
    //
    // const [isLesserThenPrev, setIsLesserThenPrev] = useState("");
    // const [isFieldsEmpty, setIsFieldsEmpty] = useState(false);

    // const [services, setServices] = useState([]);
    // const [products, setProducts] = useState([]);
    // const [membership, setMembership] = useState([]);
    // const [packages, setPackages] = useState([]);
    // const [prepaid, setPrepaid] = useState([]);
    // const [custom_services, setCustom_services] = useState([]);
    //
    //
    //
    // const [itemType, setItemType] = useState("Services")
    // const [value, setValue] = useState(0);
    // const [priceToggle, setPriceToggle] = useState("PERCENTAGE");
    //
    // const [currentDataForTarget, setCurrentDataForTarget] = useState({});
    //
    // const widthArr = (screenWidth > 500 ? [screenWidth*0.4, screenWidth*0.2, screenWidth*0.3, screenWidth*0.1] : [200, 120 ,200, 80]);
    //
    // const profileNameRef = useRef(null);
    // const computationalIntervalRef = useRef(null);
    // const targetTierRef = useRef(null);
    // const qualifyingItemRef = useRef(null);
    //
    // const [isValueChanged, setIsValueChanged] = useState({
    //     Services: false,
    //     Products: false,
    //     Prepaid: false,
    //     "Custom services": false,
    //     Membership: false,
    //     Packages: false,
    // })
    //
    //




    // console.log(Object.keys(membership));



    // useEffect(() => {
    //
    //     async function f1() {
    //
    //         if(itemOrTarget === 1) {
    //             const key = itemType === "Custom services" ? "Custom_services" : itemType;
    //             if ((itemType === "Services" ?
    //                     services :
    //                     itemType === "Products" ?
    //                         products :
    //                         itemType === "Membership" ?
    //                             membership :
    //                             itemType === "Prepaid" ?
    //                                 prepaid :
    //                                 itemType === "Packages" ?
    //                                     packages : custom_services
    //             )?.length === 0) {
    //                 getListOfDataToDisplayForStaffCommissionProfile(itemType === "Custom services" ? "Custom_services" : itemType, props.edit ? props.data.id : undefined).then((response) => {
    //                     if(itemType === "Services") {
    //                         setServices(response);
    //                     }
    //                     if (itemType === "Products") {
    //                         setProducts(response);
    //                     }
    //                     if (itemType === "Membership") {
    //                         setMembership(response);
    //                     }
    //                     if (itemType === "Packages") {
    //                         setPackages(response);
    //                     }
    //                     if (itemType === "Prepaid") {
    //                         setPrepaid(response[0].resource_categories);
    //                     }
    //                     if(itemType === "Custom services") {
    //                         // console.log(response)
    //                         setCustom_services(response[0].resource_categories);
    //                     }
    //
    //
    //                     if(response.length > 0 && Object.keys(response[0]).length > 0) {
    //                         setPriceToggle(response[0].commission_type)
    //                     }
    //                 })
    //             }
    //         }
    //
    //     }
    //     f1().then(() => {
    //         console.log("then ----------------------------------")
    //     })



    //     async function f() {
    //         const response = await getCommissionProfileDetailsAPI(props.data.id);
    //
    //         if(response.data.other_message === null || response.data.other_message === "") {
    //             const data = response.data.data[0];
    //             setCurrentDataForTarget(data);
    //             const qualifying_items = data.qualifying_items
    //             setQualifyingItems(qualifying_items);
    //             setSelectedOptions(qualifying_items.map((item, index) => item.type === "Custom_services" ? "Custom services" : item.type ));
    //             setComputationalInterval(capitalizeFirstLetter(props.data.computation_interval))
    //             setIncludeTax(data.tax_enabled);
    //             setTargetTier(data.target_tier === "ZERO BASED" ? "Zero based" : "Progressive");
    //             setTargetMapping(data.target_mapping)
    //         }
    //         else {
    //             toastRef.current.show(response.data.other_message)
    //         }
    //     }
    //
    //     if(props.edit && props.data.profile_type === "commission by target") {
    //         f()
    //     }
    //
    // }, [itemType, itemOrTarget])






    // async function onSave() {
    //     const profileNameValid = profileNameRef.current();
    //     const computationalIntervalValid = itemOrTarget === 2 ? computationalIntervalRef.current() : true;
    //     const targetTierValid = itemOrTarget === 2 ? targetTier !== "" : true;
    //     const targetMappingValid = itemOrTarget === 2 ? targetMapping[0].commission_to !== 0 : true;
    //
    //     if(!profileNameValid || !computationalIntervalValid || !targetTierValid || !targetMappingValid) {
    //         if(itemOrTarget === 2 && !targetTierValid) {
    //             toastRef.current.show("target tier is required", true);
    //         }
    //         else if(itemOrTarget === 2 && !targetMappingValid) {
    //             toastRef.current.show("target mapping is required");
    //         }
    //         return
    //
    //     }
    //
    //     if(itemOrTarget === 1 && (Object.values(isValueChanged)).every((value) => value === false)) {
    //         toastRef.current.show("Please enter a commission value");
    //         return;
    //     }
    //
    //     if(itemOrTarget === 2 && selectedOptions.length === 0) {
    //         toastRef.current.show("qualifying item is required");
    //         return
    //     }
    //
    //     if(itemOrTarget === 2 && targetMapping.length > 1 && isLesserThenPrev.length > 0) {
    //         toastRef.current.show(isLesserThenPrev);
    //         return;
    //     }
    //     else if(itemOrTarget === 2 && (targetMapping[targetMapping.length - 1].commission_to === 0)) {
    //         toastRef.current.show("target tier entry can't be zero");
    //         return;
    //     }
    //     if(itemOrTarget === 2 && (targetMapping[targetMapping.length - 1].commission_to === 0)) {
    //         toastRef.current.show("Target mapping should not left empty", true);
    //         setIsLesserThenPrev("Target mapping should not left empty")
    //
    //         return;
    //     }
    //     else {
    //         setIsLesserThenPrev("")
    //     }
    //
    //     try {
    //         const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/addCommissionProfile", {
    //             profile_name: profileName,
    //             tax_enabled: includeTax,
    //             profile_type: itemOrTarget === 1 ? "commission by item" : "commission by target",
    //             business_id: await SecureStore.getItemAsync('businessId'),
    //             qualifying_items: itemOrTarget === 1 ? [] : selectedOptions.map((item) => ({
    //                 type: item === "Custom services" ? "Custom_services" : item,
    //                 type_id: null
    //             })),
    //             target_tier: itemOrTarget === 1 ? "" : targetTier.toUpperCase(),
    //             target_mapping: itemOrTarget === 1 ? [] : targetMapping.map(({ commission_from, commission_to, commission_percentage, type_id }) => ({
    //                 commission_from: commission_from,
    //                 commission_to: commission_to,
    //                 commission_percentage: commission_percentage,
    //                 type_id: type_id || null
    //             })),
    //             Services: itemOrTarget === 1 ? isValueChanged[itemType] ? services.map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Products: itemOrTarget === 1 ? isValueChanged[itemType] ? (products).map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Membership: itemOrTarget === 1 ? isValueChanged[itemType] ? (membership).map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Packages: itemOrTarget === 1 ? isValueChanged[itemType] ? (packages).map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Prepaid: itemOrTarget === 1 ? isValueChanged[itemType] ? (prepaid).map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Custom_services: itemOrTarget === 1 ? isValueChanged[itemType] ? (custom_services).map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             computation_interval: itemOrTarget === 1 ? null : computationalInterval || "MONTHLY"
    //
    //         },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
    //                 }
    //             });
    //
    //
    //             // console.log(response)
    //         if(response.data.other_message === "" || response.data.other_message === null ) {
    //             props.toastRef.current.show(response.data.message)
    //             props.onClose();
    //             dispatch(getListOfCommissionProfile());
    //         }
    //         else {
    //             toastRef.current.show(response.data.other_message);
    //         }
    //     }
    //     catch (e) {
    //         toastRef.current.show(e.response.data.other_message, true);
    //
    //     }
    // }
    //
    // // console.log(isValueChanged)
    // async function onEdit() {
    //
    //     const profileNameValid = profileNameRef.current();
    //     const computationalIntervalValid = itemOrTarget === 2 ? computationalIntervalRef.current() : true;
    //     const targetTierValid = itemOrTarget === 2 ? targetTier !== "" : true;
    //     const targetMappingValid = itemOrTarget === 2 ? targetMapping[0].commission_to !== 0 : true;
    //
    //
    //
    //
    //     if(!profileNameValid || !computationalIntervalValid || !targetTierValid || !targetMappingValid) {
    //         if(itemOrTarget === 2 && !targetTierValid) {
    //             toastRef.current.show("target tier is required", true);
    //         }
    //         else if(itemOrTarget === 2 && !targetMappingValid) {
    //             toastRef.current.show("target mapping is required");
    //         }
    //         return
    //
    //     }
    //
    //     if(itemOrTarget === 1 && (Object.values(isValueChanged)).every((value) => value === false)) {
    //         toastRef.current.show("Please enter a commission value");
    //         return;
    //     }
    //
    //     if(selectedOptions.length === 0 && itemOrTarget === 2) {
    //         toastRef.current.show("qualifying item is required");
    //         return
    //     }
    //
    //     if(itemOrTarget === 2 && targetMapping.length > 1 && isLesserThenPrev.length > 0) {
    //         toastRef.current.show(isLesserThenPrev);
    //         return;
    //     }
    //     else if(itemOrTarget === 2 && (targetMapping[targetMapping.length - 1].commission_to === 0)) {
    //         toastRef.current.show("target tier entry can't be zero");
    //         return;
    //     }
    //     if(itemOrTarget === 2 && (targetMapping[targetMapping.length - 1].commission_to === 0)) {
    //         toastRef.current.show("Target mapping should not left empty", true);
    //         setIsLesserThenPrev("Target mapping should not left empty")
    //
    //         return;
    //     }
    //     else {
    //         setIsLesserThenPrev("")
    //     }
    //
    //
    //     const response = await updateCommissionProfileAPI(
    //         {
    //             id: props.data.id,
    //             profile_name: profileName,
    //             tax_enabled: includeTax,
    //             profile_type: itemOrTarget === 1 ? "commission by item" : "commission by target",
    //             business_id: await SecureStore.getItemAsync('businessId'),
    //             Services: itemOrTarget === 1 ? isValueChanged[itemType] ? services.map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Products: itemOrTarget === 1 ? isValueChanged[itemType] ? products.map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Membership: itemOrTarget === 1 ? isValueChanged[itemType] ? membership.map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Packages: itemOrTarget === 1 ? isValueChanged[itemType] ? packages.map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Prepaid: itemOrTarget === 1 ? isValueChanged[itemType] ? prepaid.map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             Custom_services: itemOrTarget === 1 ? isValueChanged[itemType] ? custom_services.map(({ data_id, commission_type, commission_value, type_id }) => ({
    //                 data_id: String(data_id),
    //                 commission_type: priceToggle,
    //                 commission_value,
    //                 type_id
    //             })) : [] : [],
    //             qualifying_items: itemOrTarget === 1 ? [] : transformDataForQualifyingItem(currentDataForTarget.qualifying_items, selectedOptions),
    //             target_tier: itemOrTarget === 1 ? "" : targetTier.toUpperCase(),
    //             target_mapping:  itemOrTarget === 1 ? [] :  transformData(currentDataForTarget.target_mapping, targetMapping),
    //             computation_interval: itemOrTarget === 1 ? null : computationalInterval
    //         }
    //     );
    //
    //     if(response.data.other_message === "" || response.data.other_message === null) {
    //         toastRef.current.show(response.data.message)
    //         props.onClose();
    //         dispatch(getListOfCommissionProfile());
    //     }
    //     else {
    //         toastRef.current.show(response.data.other_message);
    //     }
    // }

    return <Modal
        visible={props.visible}
        animationType={"slide"}
        style={styles.modal}
        onRequestClose={props.onClose}
        presentationStyle={"formSheet"}
    >
        <Toast ref={toastRef}/>

        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleLarge, styles.titleText]}>{props.edit ? "Update Commission Profile" : "Add Commission Profile"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={() => {
                    props.onClose();
                }}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <View style={styles.modalContent}>
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
                    value={"item"}
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
                        in a given time period</Text>

                </Popover>

            </PrimaryButton>

            {
                itemOrTarget === 1 ?
                    <CommissionByItem
                        toastRef={toastRef}
                        onClose={props.onClose}
                        edit={props.edit}
                        data={props.data}
                    /> :
                    <CommissionByTarget
                        toastRef={toastRef}
                        onClose={props.onClose}
                        edit={props.edit}
                        data={props.data}
                    />
            }

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