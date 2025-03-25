import Toast from "../../ui/Toast";
import ChooseTemplateModal from "./ChooseTemplateModal";
import {Modal, Text, View, StyleSheet, FlatList, Dimensions} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useEffect, useRef, useState} from "react";
import Colors from "../../constants/Colors";
import CustomTextInput from "../../ui/CustomTextInput";
import {useSelector} from "react-redux";
import {Checkbox} from "react-native-paper";
import portal from "react-native-paper/src/components/Portal/Portal";
import getParentServiceCategoriesAPI from "../../apis/marketingAPI/SMSCampaignAPI/getParentServiceCategoriesAPI";

const HEIGHT = Dimensions.get("window").height;

export default function SegmentSubCategoryListViewModal(props) {
    const toastRef = useRef(null);

    const [subCategory, setSubCategory] = useState("All Services");
    const [checkedIds, setCheckedIds] = useState([]);
    const [itemsToDisplay, setItemsToDisplay] = useState(props.title === "Service Category" ? [] :
        useSelector(state => state.catalogue[props.title === "Services" ? "services" : "products"]))



    function getServicesData() {
        if(props.title === "Service Category"){
            return []
        }

        else if(subCategory === "All Services") {
            return [
                ...itemsToDisplay["women"].filter(service => service.resource_categories.length > 0).map(item => item.resource_categories).flat().map(item => (
                        {
                            ...item,
                            id: item.id.toString(),
                        }
                    )),
                ...itemsToDisplay["men"].filter(service => service.resource_categories.length > 0).map(item => item.resource_categories).flat().map(item => (
                        {
                            ...item,
                            id: item.id.toString(),
                        }
                    )),
                ...itemsToDisplay["kids"].filter(service => service.resource_categories.length > 0).map(item => item.resource_categories).flat().map(item => (
                        {
                            ...item,
                            id: item.id.toString(),
                        }
                    )),
                ...itemsToDisplay["general"].filter(service => service.resource_categories.length > 0).map(item => item.resource_categories).flat().map(item => (
                    {
                        ...item,
                        id: item.id.toString(),
                    }
                ))
            ]
        }
        else {
            return itemsToDisplay[subCategory.toLowerCase()].filter(service => service.resource_categories.length > 0).map(item => item.resource_categories).flat().map(item => (
                {
                    ...item,
                    id: item.id.toString(),
                }
            ));
        }
    }

    function getProductsData() {
        if(props.title === "Service Category"){
            return []
        }

        return Object.values(itemsToDisplay.items[0]).flat().map(item => (
            {
                ...item,
                id: item.id.toString(),
            }
        ));
    }

    function getServiceCategoryData() {
        if(props.title === "Service Category"){
            return itemsToDisplay.map(item => (
                {
                    ...item,
                    id: item.id.toString(),
                }
            ))
        }
    }

    useEffect(() => {
        if(props.title === "Service Category") {
            getParentServiceCategoriesAPI().then((response) => {
                setItemsToDisplay(response.data.data);
            })
        }
    }, []);







    // console.log(JSON.stringify(Object.values(itemsToDisplay.items[0]).flat() , null, 2));

    // console.log(JSON.stringify(itemsToDisplay[subCategory.toLowerCase()].filter(service => service.resource_categories.length > 0).map(item => item.resource_categories).flat(), null, 2));

    function renderItem({item}) {
        return <PrimaryButton
            pressableStyle={styles.itemContainerPressable}
            buttonStyle={styles.itemContainer}
            onPress={() => {
                props.setSegmentSubType(prev => (
                    prev.includes(item.id) ?
                        prev.filter((id) => id !== item.id) :
                        [...prev, item.id.toString()]))
            }}
        >
            <View style={{width:'45%'}}>
                <Text>{item.name}</Text>
            </View>
            {
                props.title === "Products" ?
                    <></> :
                    <View style={{flex: 1}}>
                        <View
                            style={
                                [styles.genderTextContainer,
                                    {
                                        borderColor:
                                            item.gender === "Women" ? Colors.orange :
                                                item.gender === "Men" ? Colors.blue :
                                                    item.gender === "Kids" ? Colors.purple :
                                                        Colors.brown
                                    }
                                ]}>
                            <Text
                                style={[textTheme.labelMedium, styles.genderText]}>{item.gender}</Text>
                        </View>
                    </View>
            }

            <Checkbox
                status={props.segmentSubType.includes(item.id) ? "checked" : "unchecked"}
                color={Colors.highlight}
                uncheckedColor={Colors.grey400}
            />
        </PrimaryButton>
    }

    return <Modal
        visible={props.visible}
        animationType="slide"
        style={styles.modal}
        onRequestClose={props.onClose}
        presentationStyle={"formSheet"}
    >
        <Toast ref={toastRef}/>


        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleMedium, {fontSize: 20,}, styles.titleText]}>{props.title}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onClose}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <View style={styles.modalContent}>
            <FlatList
                data={
                    props.title === "Service Category" ?
                        getServiceCategoryData() :
                        props.title === "Products" ?
                            getProductsData() :
                            getServicesData()
                }
                renderItem={renderItem}
                ListHeaderComponent={() => (
                    <>
                        {
                            props.title === "Services" ?
                            <CustomTextInput
                                type={"dropdown"}
                                dropdownItems={["All Services", "Women", "Men", "Kids", "General"]}
                                value={subCategory}
                                onChangeValue={(value) => setSubCategory(value)}

                            /> : <></>
                        }


                        <Text style={[textTheme.titleMedium]}>
                            {props.title + " Segment"}
                        </Text>
                    </>
                )}
                ListEmptyComponent={() => (
                    <View style={{justifyContent: "center", alignItems: "center", marginTop: HEIGHT / 3}}>
                        <Text style={[textTheme.titleMedium]}>No data found!</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}

            />
            <View style={styles.bottomContainer}>
                <PrimaryButton
                    label={"Save"}
                    buttonStyle={styles.saveButton}
                    onPress={props.onSave}
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
    genderTextContainer: {
        borderWidth: 1.3,
        borderRadius: 6,
        justifyContent: "center",
        alignSelf: 'flex-start',

    },
    genderText: {
        paddingVertical: 4,
        paddingHorizontal: 8,

    },
    itemContainerPressable: {
        flexDirection: 'row',
        alignItems: "center",
        paddingVertical: 12,
        // borderWidth: 1,
        justifyContent: "space-between",
        paddingHorizontal: 0,
        paddingLeft: 8
    },
    itemContainer: {
        backgroundColor: Colors.white,
    },
    bottomContainer: {
        paddingHorizontal: 16,
        flexDirection: "row",
        gap: 18,
        marginVertical: 12
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