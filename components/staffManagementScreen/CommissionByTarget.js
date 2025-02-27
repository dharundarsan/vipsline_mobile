import {View, StyleSheet, Text, FlatList, VirtualizedList, Pressable, TouchableOpacity, ScrollView} from "react-native";
import CustomTextInput from "../../ui/CustomTextInput";
import React, {useEffect, useRef, useState} from "react";
import CustomDropdown from "../../ui/CustomDropdown";
import Colors from "../../constants/Colors";
import {Checkbox, Divider} from "react-native-paper";
import {CustomRadioButton} from "../../ui/CustomRadioButtons";
import CustomPriceInput from "../../ui/CustomPriceInput";
import textTheme from "../../constants/TextTheme";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import PrimaryButton from "../../ui/PrimaryButton";
import getCommissionProfileDetailsAPI from "../../apis/staffManagementAPIs/getCommissionProfileDetailsAPI";
import {capitalizeFirstLetter} from "../../util/Helpers";
import {getListOfCommissionProfile} from "../../store/staffSlice";
import axios from "axios";
import {
    transformData,
    transformDataForQualifyingItem
} from "../../apis/staffManagementAPIs/staffCommissionsHelperFunctions";
import * as SecureStore from "expo-secure-store";
import updateCommissionProfileAPI from "../../apis/staffManagementAPIs/updateCommissionProfileAPI";
import {useDispatch} from "react-redux";
import BottomActionCard from "../../ui/BottomActionCard";
import deleteStaffCommissionAPI from "../../apis/staffManagementAPIs/deleteStaffCommissionAPI";


const options = [
    { "Zero based": "Rate of highest tier reached applies to total sales" },
    { "Progressive": "Percentage only apply to their respective tiers", }
];

export default function CommissionByTarget(props) {


    const dispatch = useDispatch();

    const [profileName, setProfileName] = useState(props.edit ? props.data.profile_name : "");
    const [includeTax, setIncludeTax] = useState(props.edit ? props.data.tax_enabled : false);

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [targetMapping, setTargetMapping] = useState([
        {
            type_id: null,
            commission_from: 0,
            commission_to: "",
            commission_percentage: "",
            activation: true,
        },
    ]);
    // const [qualifyingItems, setQualifyingItems] = useState([]);
    const [targetTier, setTargetTier] = useState("");
    const [computationalInterval, setComputationalInterval] = useState("");

    const [isLesserThenPrev, setIsLesserThenPrev] = useState("");
    const [isFieldsEmpty, setIsFieldsEmpty] = useState(false);

    const profileNameRef = useRef(null);
    const computationalIntervalRef = useRef(null);
    const targetTierRef = useRef(null);
    const qualifyingItemRef = useRef(null);
    const [currentDataForTarget, setCurrentDataForTarget] = useState({});
    const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState();


    async function onSave() {
        const profileNameValid = profileNameRef.current();
        const computationalIntervalValid = computationalIntervalRef.current();
        const targetTierValid = targetTier !== "";
        const targetMappingValid = targetMapping[0].commission_to !== 0 ;

        if(!profileNameValid || !computationalIntervalValid || !targetTierValid || !targetMappingValid) {
            if(!targetTierValid) {
                props.toastRef.current.show("target tier is required", true);
            }
            else if(!targetMappingValid) {
                props.toastRef.current.show("target mapping is required");
            }
            return

        }

        if(selectedOptions.length === 0) {
            props.toastRef.current.show("qualifying item is required");
            return
        }

        if(targetMapping.length > 1 && isLesserThenPrev.length > 0) {
            props.toastRef.current.show(isLesserThenPrev);
            return;
        }
        else if((targetMapping[targetMapping.length - 1].commission_to === 0)) {
            props.toastRef.current.show("target tier entry can't be zero");
            return;
        }
        if((targetMapping[targetMapping.length - 1].commission_to === 0)) {
            props.toastRef.current.show("Target mapping should not left empty", true);
            setIsLesserThenPrev("Target mapping should not left empty")

            return;
        }
        else {
            setIsLesserThenPrev("")
        }

        try {
            const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/addCommissionProfile", {
                    profile_name: profileName,
                    tax_enabled: includeTax,
                    profile_type: "commission by target",
                    business_id: await SecureStore.getItemAsync('businessId'),
                    qualifying_items: selectedOptions.map((item) => ({
                        type: item === "Custom services" ? "Custom_services" : item,
                        type_id: null
                    })),
                    target_tier: targetTier.toUpperCase(),
                    target_mapping: targetMapping.map(({ commission_from, commission_to, commission_percentage, type_id }) => ({
                        commission_from: commission_from,
                        commission_to: commission_to,
                        commission_percentage: commission_percentage,
                        type_id: type_id || null
                    })),
                    Services: [],
                    Products: [],
                    Membership: [],
                    Packages: [],
                    Prepaid: [],
                    Custom_services: [],
                    computation_interval: computationalInterval
                },
                {
                    headers: {
                        'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
                    }
                });


            // console.log(response)
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
        const computationalIntervalValid = computationalIntervalRef.current();
        const targetTierValid = targetTier !== "";
        const targetMappingValid = targetMapping[0].commission_to !== 0;




        if(!profileNameValid || !computationalIntervalValid || !targetTierValid || !targetMappingValid) {
            if(!targetTierValid) {
                props.toastRef.current.show("target tier is required", true);
            }
            else if(!targetMappingValid) {
                props.toastRef.current.show("target mapping is required");
            }
            return

        }



        if(selectedOptions.length === 0) {
            props.toastRef.current.show("qualifying item is required");
            return
        }

        if(targetMapping.length > 1 && isLesserThenPrev.length > 0) {
            props.toastRef.current.show(isLesserThenPrev);
            return;
        }
        else if((targetMapping[targetMapping.length - 1].commission_to === 0)) {
            props.toastRef.current.show("target tier entry can't be zero");
            return;
        }
        if((targetMapping[targetMapping.length - 1].commission_to === 0)) {
            props.toastRef.current.show("Target mapping should not left empty", true);
            setIsLesserThenPrev("Target mapping should not left empty")

            return;
        }
        else {
            setIsLesserThenPrev("")
        }


        const response = await updateCommissionProfileAPI(
            {
                id: props.data.id,
                profile_name: profileName,
                tax_enabled: includeTax,
                profile_type: "commission by target",
                business_id: await SecureStore.getItemAsync('businessId'),
                Services: [],
                Products:  [] ,
                Membership:  [] ,
                Packages: [] ,
                Prepaid: [] ,
                Custom_services:  [] ,
                qualifying_items: transformDataForQualifyingItem(currentDataForTarget.qualifying_items, selectedOptions),
                target_tier: targetTier.toUpperCase(),
                target_mapping: transformData(currentDataForTarget.target_mapping, targetMapping),
                computation_interval: computationalInterval
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


    useEffect(() => {
        async function f() {
            const response = await getCommissionProfileDetailsAPI(props.data.id);

            if(response.data.other_message === null || response.data.other_message === "") {
                const data = response.data.data[0];
                setCurrentDataForTarget(data);
                const qualifying_items = data.qualifying_items
                // setQualifyingItems(qualifying_items);
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

        if(props.edit) {
            f()
        }
    }, []);




    const addTier = () => {

        if (targetMapping.length === 0) return;

        if(isLesserThenPrev) {
            return;
        }

        const lastItem = targetMapping[targetMapping.length - 1];

        if(lastItem.commission_to === 0) {
            setIsFieldsEmpty(true);
            toastRef.current.show("'To' field field should not left empty");

            return;
        }
        else {
            setIsFieldsEmpty(false);
        }
        const newTier = {
            type_id: null, // Increment type_id
            commission_from: lastItem.commission_to + 0.01, // Ensure sequential range
            commission_to: "", // Increment range
            commission_percentage: "", // Default percentage
            activation: true,
        };

        setTargetMapping([...targetMapping, newTier]);
    };

    const removeTier = () => {
        setTargetMapping(targetMapping.slice(0, targetMapping.length - 1));
        setIsLesserThenPrev("")

    };


    const updateCommissionPercentage = (text, index) => {
        // Convert text input to a number
        const newValue = text === "0" ? 0 : parseFloat(text) || "";

        setTargetMapping((prev) =>
            prev.map((tier, i) =>
                i === index ? { ...tier, commission_percentage: newValue } : tier
            )
        );

    };

    const updateCommissionTo = (text,index) => {
        // Convert text input to a number

        setIsFieldsEmpty(false);

        const newValue = parseFloat(text) || "";

        setTargetMapping((prev) =>
            prev.map((tier, i) =>
                i === index && tier.commission_to !== newValue
                    ? { ...tier, commission_to: newValue }
                    : tier
            )
        );

        if((targetMapping[index].commission_from > newValue) ||
            ((index === 0 ? 0 : targetMapping[index - 1].commission_to + 0.01) >= newValue)) {
            setIsLesserThenPrev("Enter a higher value in the 'To' field than the 'From' field.");
        }
        else if((targetMapping.length - 1 > index && targetMapping[index + 1].commission_to <= newValue)) {
            setIsLesserThenPrev(`'Commission to' value in ${index + 1} is higher than the ${index + 2}`)

        }
        else if((targetMapping[index].commission_from <= newValue) || (index === 0 ? 0 : (targetMapping[index - 1].commission_to + 0.01) <= newValue)){
            setIsLesserThenPrev("");
        }

    };



    function renderItem({item, index}) {

        return <View style={styles.renderItemStyle}>
            <CustomPriceInput
                priceToggle={"VALUE"}
                container={{marginRight: 16}}
                innerContainerStyle={{backgroundColor: Colors.grey100}}
                readOnly
                value={index === 0 ? "0" : (targetMapping[index - 1].commission_to + 0.01).toString()}

            />
            <CustomPriceInput
                priceToggle={"VALUE"}
                container={{marginRight: 16}}
                innerContainerStyle={{backgroundColor: Colors.grey100}}
                onOnchangeText={(text) => updateCommissionTo(text, index)}
                defaultValue={item.commission_to.toString()}
            />
            <CustomPriceInput
                priceToggle={"PERCENTAGE"}
                innerContainerStyle={{backgroundColor: Colors.grey100}}
                onOnchangeText={(text) => updateCommissionPercentage(text, index)}
                defaultValue={item.commission_percentage.toString()}
                // value={item.commission_percentage.toString()}
            />
            <TouchableOpacity style={{alignItems: "center", justifyContent:"center", width: "8%"}}>
                {
                    index !== 0 && index === targetMapping.length - 1 ?
                        <MaterialIcons name="delete-outline" size={28} color={Colors.error} onPress={() => removeTier()} /> :
                        <></>

                }
            </TouchableOpacity>
            </View>
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
        >
    <View style={styles.commissionByTarget}>
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
            container={{marginBottom: 0}}
        />
        <CustomDropdown
            options={["Services", "Products", "Prepaid", "Membership", "Packages", "Custom services"]}
            highlightColor={Colors.highlight}
            container={styles.dropdownContainer}
            borderColor={Colors.grey250}
            checkBoxSize={30}
            selectedOptions={selectedOptions}
            setSelectedOptions={(item1) => {
                setSelectedOptions(item1);
            }}
            scrollEnabled={false}
            label={"Qualifying Item"}
            validator={(text) => {
                if(text.length === 0) {
                    return "qualifying item is required";
                }
                else return true;
            }}
            onSave={(callback) => {
                qualifyingItemRef.current = callback;
            }}

        />
        <CustomTextInput
            type={"dropdown"}
            dropdownItems={[
                "Daily",
                "Monthly",
            ]}
            label={"Calculation Interval"}
            container={{marginBottom: 0}}
            value={computationalInterval}
            onChangeValue={setComputationalInterval}
            validator={(value) => {
                if(value === undefined || value === null || value === "") return "calculation interval is required";
                else return true;
            }}
            onSave={(callback) => computationalIntervalRef.current = callback}
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

        <Divider />

        <CustomRadioButton
            options={options}
            label={"Target Tier"}
            labelStyle={{marginBottom: 16, fontWeight: 'bold'}}
            uncheckedColor={Colors.highlight}
            checkedColor={Colors.highlight}
            selectedKey={targetTier}
            setSelectedKey={setTargetTier}
            defaultValue={"Zero based"}
        />
        <View style={styles.addCommissionTableHeaderContainer}>
            <Text>From</Text>
            <Text>To</Text>
            <Text style={{paddingRight: 34}}>Commission %</Text>
        </View>
        <Divider />

        <FlatList
            data={targetMapping}
            renderItem={renderItem}
            scrollEnabled={false}
            contentContainerStyle={{gap: 16}}
            removeClippedSubviews={false}

        />
        {
             isLesserThenPrev  !== ""  ?
                <Text style={[textTheme.bodyMedium, {color: Colors.error}]}>{isLesserThenPrev}</Text> : <></>
        }
        {
            isLesserThenPrev  === "" && isFieldsEmpty ?
                <Text style={[textTheme.bodyMedium, {color: Colors.error}]}>'To' field should not left empty</Text> :
                <></>
        }
        <PrimaryButton
            buttonStyle={[styles.addShiftButton]}
            pressableStyle={styles.addShiftButtonPressable}
            onPress={() => {
                addTier()
            }}
        >
            <AntDesign name="pluscircleo" size={24} color={Colors.highlight} />
            <Text style={[textTheme.bodyLarge, {color: Colors.highlight}]}>
                Add tier
            </Text>
        </PrimaryButton>
    </View>
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
    dropdownContainer: {

    },
    commissionByTarget: {
        gap: 20,
        marginBottom: 30

    },
    addCommissionTableHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        // marginBottom:5,
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
    renderItemStyle: {
        flexDirection: "row",
    },
    addShiftButton: {
        backgroundColor: Colors.white,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    addShiftButtonPressable: {
        flexDirection: 'row',
        gap: 8,
        width: undefined,
        borderRadius: 6,
        paddingHorizontal: 4,
        paddingRight: 12

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