import {View, StyleSheet, Text, FlatList, VirtualizedList, Pressable, TouchableOpacity} from "react-native";
import CustomTextInput from "../../ui/CustomTextInput";
import React, {useEffect, useState} from "react";
import CustomDropdown from "../../ui/CustomDropdown";
import Colors from "../../constants/Colors";
import {Divider} from "react-native-paper";
import {CustomRadioButton} from "../../ui/CustomRadioButtons";
import {default as And} from "../../ui/Divider";
import CustomPriceInput from "../../ui/CustomPriceInput";
import textTheme from "../../constants/TextTheme";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";
import PrimaryButton from "../../ui/PrimaryButton";
import getCommissionProfileDetailsAPI from "../../apis/staffManagementAPIs/getCommissionProfileDetailsAPI";


const options = [
    { "Zero based": "Rate of highest tier reached applies to total sales" },
    { "Progressive": "Percentage only apply to their respective tiers", }
];

export default function CommissionByTarget({
                                               toastRef,
                                               checkBox,
                                               setComputationalInterval,
                                               computationalInterval,
                                               setTargetTier,
                                               targetTier,
                                               setQualifyingItems,
                                               qualifyingItems,
                                               setIsFieldsEmpty,
                                               isFieldsEmpty,
                                               setIsLesserThenPrev,
                                               isLesserThenPrev,
                                               setTargetMapping,
                                               targetMapping,
                                               setSelectedOptions,
                                               selectedOptions,
                                               currentDataForTarget,
      computationalIntervalRef,
    targetTierRef

}) {




    const addTier = () => {
        if (targetMapping.length === 0) return;

        if(isLesserThenPrev) {
            return;
        }

        const lastItem = targetMapping[targetMapping.length - 1];

        if(lastItem.commission_to === 0 || lastItem.commission_percentage === 0) {
            setIsFieldsEmpty(true);
            toastRef.current.show("'To' field and 'Commission percentage' field should not left empty");

            return;
        }
        else {
            setIsFieldsEmpty(false);
        }

        const newTier = {
            type_id: null, // Increment type_id
            commission_from: lastItem.commission_to + 0.01, // Ensure sequential range
            commission_to: 0, // Increment range
            commission_percentage: 0, // Default percentage
            activation: true,
        };

        setTargetMapping([...targetMapping, newTier]);
    };

    const removeTier = () => {
        setTargetMapping(targetMapping.slice(0, targetMapping.length - 1));
    };


    const updateCommissionPercentage = (text, index) => {
        // Convert text input to a number
        const newValue = parseFloat(text) || 0;


        setTargetMapping((prev) =>
            prev.map((tier, i) =>
                i === index ? { ...tier, commission_percentage: newValue } : tier
            )
        );

    };

    const updateCommissionTo = (text,index) => {
        // Convert text input to a number


        const newValue = parseFloat(text) || 0;

        setTargetMapping((prev) =>
            prev.map((tier, i) =>
                i === index && tier.commission_to !== newValue
                    ? { ...tier, commission_to: newValue }
                    : tier
            )
        );




        // if((targetMapping[index].commission_from > newValue) || (index === 0 ? 0 : (targetMapping[index - 1].commission_to + 0.01) > newValue)) {
        //     setIsLesserThenPrev(true);
        //     console.log("exec")
        // }
        // else if((targetMapping[index].commission_from <= newValue) || (index === 0 ? 0 : (targetMapping[index - 1].commission_to + 0.01) <= newValue)){
        //     setIsLesserThenPrev(false);
        // }

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
                // onEndEditing={(newValue) => {
                //     if((targetMapping[index].commission_from > newValue) ||
                //         ((index === 0 ? 0 : targetMapping[index - 1].commission_to + 0.01) > newValue)) {
                //         setIsLesserThenPrev("Enter a higher value in the 'To' field than the 'From' field.");
                //     }
                //     else if((targetMapping.length - 1 > index && targetMapping[index + 1].commission_to <= newValue)) {
                //         setIsLesserThenPrev(`'Commission to' value in ${index + 1} is higher than the ${index + 2}`)
                //
                //     }
                //     else if((targetMapping[index].commission_from <= newValue) || (index === 0 ? 0 : (targetMapping[index - 1].commission_to + 0.01) <= newValue)){
                //         setIsLesserThenPrev("");
                //     }
                // }}


            />
            <CustomPriceInput
                priceToggle={"PERCENTAGE"}
                innerContainerStyle={{backgroundColor: Colors.grey100}}
                onOnchangeText={(text) => updateCommissionPercentage(text, index)}
                defaultValue={item.commission_percentage.toString()}
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



    const allItems = [
        { type: "Services", type_id: null },
        { type: "Products", type_id: null },
        { type: "Memberships", type_id: null },
        { type: "Prepaid", type_id: null },
        { type: "Custom services", type_id: null },
    ];



    return <View style={styles.commissionByTarget}>
        <CustomDropdown
            options={["Services", "Products", "Prepaid", "Membership", "Packages", "Custom services"]}
            highlightColor={Colors.highlight}
            container={styles.dropdownContainer}
            borderColor={Colors.grey250}
            checkBoxSize={30}
            selectedOptions={selectedOptions}
            setSelectedOptions={(item1) => {
                setSelectedOptions(item1);
                // const qualifyingItems1 = currentDataForTarget.qualifying_items;
                //
                //
                // const previousItemsMap = Object.fromEntries(
                //     qualifyingItems1.map(item => [item.type, { activation: item.activation, type_id: item.type_id }])
                // );
                //
                // const updatedItems = allItems
                //     .map(item => ({
                //         ...item,
                //         type_id: previousItemsMap[item.type]?.type_id ?? item.type_id,
                //         activation: item1.includes(item.type)
                //             ? true
                //             : previousItemsMap[item.type] !== undefined
                //                 ? false
                //                 : undefined
                //     }))
                //     .filter(item => item.activation !== undefined);
                //
                // setQualifyingItems(updatedItems);

                // console.log(JSON.stringify(item1, null, 2));


            }}
            scrollEnabled={false}
            label={"Qualifying Item"}
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
        {
            checkBox
        }
        <Divider />

        <CustomRadioButton
            options={options}
            label={"Target Tier"}
            labelStyle={{marginBottom: 16, fontWeight: 'bold'}}
            uncheckedColor={Colors.highlight}
            checkedColor={Colors.highlight}
            selectedKey={targetTier}
            setSelectedKey={setTargetTier}
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
             targetMapping.length > 1 && isLesserThenPrev  ?
                <Text style={[textTheme.bodyMedium, {color: Colors.error}]}>{isLesserThenPrev}</Text> : <></>
        }
        {
            isFieldsEmpty ?
                <Text style={[textTheme.bodyMedium, {color: Colors.error}]}>'To' and 'Commission percentage' should not left empty</Text> :
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
})


const borderLeftWidthColor = {
    borderLeftWidth: 1,
    borderLeftColor: Colors.grey400,
}

const borderRightWidthColor = {
    borderRightWidth: 1,
    borderRightColor: Colors.grey400,
}