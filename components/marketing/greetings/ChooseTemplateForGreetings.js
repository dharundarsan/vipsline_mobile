import Toast from "../../../ui/Toast";
import {ActivityIndicator, FlatList, Modal, StyleSheet, Text, View} from "react-native";
import textTheme from "../../../constants/TextTheme";
import PrimaryButton from "../../../ui/PrimaryButton";
import {Ionicons, Octicons} from "@expo/vector-icons";
import Divider from "../../../ui/Divider";
import React, {useEffect, useRef, useState} from "react";
import Colors from "../../../constants/Colors";
import CustomTextInput from "../../../ui/CustomTextInput";
import getListOfPromotionTypesAPI from "../../../apis/marketingAPI/SMSCampaignAPI/getListOfPromotionTypesAPI";
import getListOfSMSTemplatesByType from "../../../apis/marketingAPI/SMSCampaignAPI/getListOfSMSTemplatesByType";
import calculatePricingForSMSCampaign from "../../../apis/marketingAPI/SMSCampaignAPI/calculatePricingForSMSCampaign";
import {DynamicBoldText} from "../DynamicBoldText";

export default function ChooseTemplateForGreetings(props) {
    const toastRef = useRef(null);
    const [templateNames, setTemplateNames] = useState([]);
    const [templateName, setTemplateName] = useState(props.edit ? props.greetingTemplateData.template_name : props.greetingType.split(" ")[0]);
    const [isLoading, setIsLoading] = useState(-1);
    const [templateList, setTemplateList] = useState([]);

    useEffect(() => {
        const template_id = props.greetingTemplateData.template_name === "My Template" ? "7" : props.templateTypeId;
        getListOfSMSTemplatesByType(props.edit ? template_id : props.templateTypeId).then((response) => {
            setTemplateList(response.data.data.map((item) => {
                const current_template_id = item.template_id;
                return {
                    ...item,
                    is_assigned: props.greetingTemplateData.selected_template_ids.includes(current_template_id),
                }}));
        })
        getListOfPromotionTypesAPI(props.type).then((response) => {
            setTemplateNames(response.data.data.filter((item) => item.name === "My Template" || item.name === props.greetingType.split(" ")[0]));
        })
    }, []);

    function renderItem({item, index}) {
        return <View style={styles.templateCard}>
            <Text style={[textTheme.titleMedium]}>{item.template_name}</Text>
            <DynamicBoldText text={item.sample_template}/>
            <PrimaryButton
                buttonStyle={[styles.button, (item.is_assigned ? {backgroundColor: Colors.highlight,} : null)]}
                pressableStyle={[styles.buttonPressable, (item.is_assigned ?
                    {
                        flexDirection: "row",
                        gap: 8,
                        justifyContent: 'flex-start',
                        paddingHorizontal: 24,
                        paddingVertical: 6
                    } : null)]}
                textStyle={[textTheme.bodyMedium]}
                onPress={() => {
                    setIsLoading(index);

                    let updated = ""

                    if (props.greetingTemplateData.selected_template_ids.includes(item.template_id)) {
                        toastRef.current.show("This template is already selected.");
                        setIsLoading(-1)
                        return;
                    }

                    if (props.changeTemplateIndex !== -1)
                    {
                        props.setGreetingTemplateData((prev) => {
                            return {
                                ...prev,
                                selected_template_ids: prev.selected_template_ids.map((id) => id === props.changeTemplateIndex ? item.template_id : id),
                                template_name: templateName,
                            }});
                    }
                    else {
                        props.setGreetingTemplateData((prev) => {
                            return {
                                ...prev,
                                selected_template_ids: [...props.greetingTemplateData.selected_template_ids, item.template_id],
                                template_name: templateName,
                            }});


                    }
                    updated = templateList.map((template) => ({
                        ...template,
                        is_assigned: template.is_assigned || template.template_id === item.template_id,

                    }))
                    setTemplateList(updated);
                    calculatePricingForSMSCampaign(item.sample_template).then((response) => {

                        const res = response.data.data[0];

                        props.setTemplateData((prev) => {
                            // const newTemplate = {
                            //     template_id: item.template_id,
                            //     template_name: templateName,
                            //     selected_template: item.sample_template,
                            //     credit_per_sms: res.credit_per_sms,
                            //     sms_char_count: res.sms_character_count,
                            //     total_sms_credit: res.total_sms_credit,
                            //     type: "greetings",
                            //     variables: item.variables,
                            //
                            // };

                            const baseTemplate = {
                                template_id: "",
                                template_name: "",
                                selected_template: "",
                                credit_per_sms: 0,
                                sms_char_count: 0,
                                total_sms_credit: 0,
                                type: "greetings",
                                variables: "",
                                addMore: true,
                                editTemplate: false,
                                templateStringWithBoldChar: "",
                                send_days_before: "",
                                template: "",
                                delivery_time: "",
                                mode: "",
                                templateMappingId: ""
                            };

                            const newTemplate = {
                                ...baseTemplate, // Ensures all default properties are present
                                ...prev.find((template) => template.template_id === props.changeTemplateIndex) || {}, // Retain existing values
                                template_id: item.template_id,
                                template_name: templateName,
                                selected_template: item.sample_template,
                                credit_per_sms: res.credit_per_sms,
                                sms_char_count: res.sms_character_count,
                                total_sms_credit: res.total_sms_credit,
                                type: "greetings",
                                variables: item.variables,
                                template: item.template
                            };

                            if (props.changeTemplateIndex !== -1) {
                                // console.log(prev)
                                return prev.map((template, index) =>
                                    template.template_id === props.changeTemplateIndex ? newTemplate : template
                                );
                            } else if (prev.length === 1 && prev[0].template_name === "") {
                                return [newTemplate];
                            } else {
                                return [...prev, newTemplate];
                            }
                        });
                            setIsLoading(-1);
                            props.onClose();
                    })

                }}
            >
                {
                    item.is_assigned ?
                        <Octicons name="check" size={24} color={Colors.white} /> :
                        <></>
                }
                <Text style={[textTheme.bodyMedium, {color: item.is_assigned ? Colors.white : Colors.highlight}]}>
                    {item.is_assigned ? "Assigned" : "Assign template"}
                </Text>
                {
                     index === isLoading ?
                        <ActivityIndicator size="small" color={Colors.white} /> :
                        <></>
                }
            </PrimaryButton>
        </View>
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
            <Text style={[textTheme.titleMedium, {fontSize: 20,}, styles.titleText]}>{"Choose a Template"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onClose}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <FlatList
            data={templateList}
            renderItem={renderItem}
            ListHeaderComponent={() => <CustomTextInput
                type={"dropdown"}
                placeholder={"Choose template"}
                dropdownItems={templateNames.map((item) => item.name)}
                onChangeValue={(template) => {
                    setTemplateName(template);
                    getListOfSMSTemplatesByType((templateNames.filter((item) => item.name === template)[0].id)).then((response) => {
                        // console.log(response.data.data);
                        setTemplateList(response.data.data.map((item) => {
                            const current_template_id = item.template_id;

                            return {
                                ...item,
                                is_assigned: props.greetingTemplateData.selected_template_ids.includes(current_template_id),
                            }
                        }));
                    })
                }}
                value={templateName}
            />}
            style={styles.modalContent}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => <View style={{justifyContent: "center", alignItems: "center"}}>
                <Text style={[textTheme.titleMedium]}>No templates added, add templates to start sending campaigns</Text>
            </View>}

        />


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
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    templateCard: {
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
        gap: 24
    },
    contentContainer: {
        gap: 24
    },
    button: {
        alignSelf: "flex-start",
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.highlight,
    },
    buttonPressable: {
        paddingHorizontal: 18,
        paddingVertical: 8,
    }
})