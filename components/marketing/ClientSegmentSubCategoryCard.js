import { Image, StyleSheet, Text, View } from "react-native";
import { Checkbox, RadioButton } from "react-native-paper";
import Colors from "../../constants/Colors";
import React, { useEffect, useState } from "react";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import CustomTextInput from "../../ui/CustomTextInput";
import moment from "moment";
import {func} from "prop-types";

export default function ClientSegmentSubCategoryCard(props) {
    const [subCategoryStatus, setSubCategoryStatus] = useState([]);
    const [selectedRadio, setSelectedRadio] = useState(null); // Track selected radio button
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromRange, setFromRange] = useState("");
    const [toRange, setToRange] = useState("");
    const [isCustomRangeSelected, setIsCustomRangeSelected] = useState(false);

    useEffect(() => {
        if(Array.isArray(props.subCategories)) {
            setSubCategoryStatus(
                props.subCategories.map((subCategory) => ({
                    name: subCategory.sub_name,
                    status: props.type === "radiobutton" ? "unchecked" : "unchecked",
                    id: subCategory.id,
                    sub_name: subCategory.sub_name,
                }))
            );
            setSelectedRadio(null); // Reset selected radio on subcategory change
        }

    }, [props.subCategories, props.type]);

    useEffect(() => {
        if (props.subCategories === "date" && fromDate !== null && toDate !== null) {
            props.onChangeCategory(
                {
                    category: props.targetAudience,
                    "sub-category": props.targetAudience === "New Customers" ? ["New Customers"] : [],
                    from: moment(fromDate).format("YYYY-MM-DD"),
                    to: moment(toDate).format("YYYY-MM-DD"),

                }
            )
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        if (props.subCategories === "date") {
            setFromDate(null);
            setToDate(null);
        }
    }, [props.targetAudience]);

    // useEffect(() => {
    //     if(props.type === "radiobutton" && isCustomRangeSelected) {
    //         if(fromRange !== "" && toRange !== "") {
    //             props.onChangeCategory([`${fromRange} - ${toRange}`]);
    //         }
    //     }
    // }, [fromRange, toRange]);

    function customRangeAPICall () {
        if(props.type === "radiobutton" && isCustomRangeSelected) {
            if(fromRange !== "" && toRange !== "") {
                props.onChangeCategory([`${fromRange} - ${toRange}`]);
            }
        }
    }

    const toggleCategoryStatus = (categoryName, radio_id, sub_name) => {
        if (props.type === "radiobutton") {
            if(props.targetAudience === "Average Spending Value") {
                console.log(sub_name)
                setSelectedRadio(categoryName);
                if(sub_name === "Custom Range") {
                    setIsCustomRangeSelected(true);
                }
                else {
                    props.onChangeCategory([sub_name])
                    setIsCustomRangeSelected(false);
                }
            }
            else {
                setSelectedRadio(categoryName);
                props.onChangeCategory([radio_id]);
                setIsCustomRangeSelected(false);
            }

        }
        else if(categoryName === "Select all") {
            const selectAll = subCategoryStatus.filter((subCategory) => subCategory.name === categoryName)[0];



            const updatedStatus = subCategoryStatus.map((subCategory) => (
                { ...subCategory, status: selectAll.status === "checked" ? "unchecked" : "checked" })
            );

            setSubCategoryStatus(updatedStatus)
            props.onChangeCategory(
                updatedStatus.
                filter((subCategory) => subCategory.status === "checked").
                map((subCategory) => subCategory.id));
        }

        else {
            const updatedStatus = subCategoryStatus.map((subCategory) =>
                subCategory.name === categoryName
                    ? { ...subCategory, status: subCategory.status === "checked" ? "unchecked" : "checked" }
                    : subCategory
            );
            setSubCategoryStatus(updatedStatus)
            props.onChangeCategory(
                updatedStatus.
                filter((subCategory) => subCategory.status === "checked").
                map((subCategory) => subCategory.id));
        }
    };

    if (!props.targetAudience) return null;

    return (
        <View style={styles.card}>
            {
                Array.isArray(props.subCategories) ?

                    subCategoryStatus.map((category) => (
                    <PrimaryButton
                        key={category.name}
                        pressableStyle={styles.primaryButtonPressable}
                        buttonStyle={styles.primaryButton}
                        onPress={() => toggleCategoryStatus(category.name, category.id, category.sub_name)}
                    >
                        {props.type === "checkbox" ? (
                            <Checkbox
                                status={category.status}
                                color={Colors.highlight}
                                uncheckedColor={Colors.grey300}
                                onPress={() => toggleCategoryStatus(category.name)}
                            />
                        ) : (
                            <RadioButton
                                value={category.name}
                                status={selectedRadio === category.name ? "checked" : "unchecked"}
                                onPress={() => {
                                    console.log(category)
                                    toggleCategoryStatus(category.name, category.id, category.sub_name)
                                }}
                                color={Colors.highlight}
                                uncheckedColor={Colors.grey300}
                            />
                        )}

                        <Text style={textTheme.titleSmall}>{category.name}</Text>

                    </PrimaryButton>

                    )) :
                    <View style={{paddingHorizontal: 6}}>
                        <CustomTextInput
                            type={"date"}
                            value={fromDate}
                            label={"From date"}
                            required
                            onChangeValue={setFromDate}
                            maximumDate={toDate === null ? new Date() : toDate}


                        />
                        <CustomTextInput
                            type={"date"}
                            value={toDate}
                            label={"To date"}
                            required
                            onChangeValue={setToDate}
                            maximumDate={new Date()}
                            minimumDate={fromDate === null ? undefined : fromDate}
                        />
                    </View>
            }
            {
                props.type === "radiobutton" && isCustomRangeSelected &&
                    <View style={{flexDirection: 'row', gap: 16, paddingLeft: 32}}>
                        <CustomTextInput
                            type={"number"}
                            placeholder={"Enter range from"}
                            value={fromRange}
                            onChangeText={setFromRange}
                            flex
                            labelEnabled={false}
                            onEndEditing={() => {
                                customRangeAPICall()
                            }}

                        />
                        <CustomTextInput
                            type={"number"}
                            placeholder={"Enter range to"}
                            value={toRange}
                            onChangeText={setToRange}
                            flex
                            labelEnabled={false}
                            onEndEditing={() => {
                                customRangeAPICall()
                            }}
                        />
                    </View>
            }



            <Text style={[textTheme.titleSmall, styles.totalRecipientsText]}>Total Recipients</Text>
            <PrimaryButton buttonStyle={styles.button} pressableStyle={styles.pressable} onPress={props.countOnPress}>
                <Text style={[textTheme.titleSmall, { color: Colors.highlight }]}>{props.segmentSubCategoryCount}</Text>
                <Image
                    source={require("../../assets/icons/marketingIcons/smsCampaign/half_eye.png")}
                    style={styles.image}
                />
            </PrimaryButton>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 18,
    },
    image: {
        width: 25,
        height: 25,
    },
    button: {
        marginTop: 8,
        backgroundColor: Colors.white,
        alignSelf: "flex-start",
    },
    pressable: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 8,
    },
    primaryButtonPressable: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 0,
        paddingVertical: 0,
        justifyContent: "flex-start",
    },
    primaryButton: {
        backgroundColor: Colors.white,
    },
    totalRecipientsText: {
        paddingLeft: 8,
        marginTop: 16,
    },
});
