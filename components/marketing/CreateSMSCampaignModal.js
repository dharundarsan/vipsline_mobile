import Toast from "../../ui/Toast";
import {Modal, Text, View, StyleSheet, ScrollView, Image, ActivityIndicator} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useEffect, useRef, useState} from "react";
import Colors from "../../constants/Colors";
import CustomTextInput from "../../ui/CustomTextInput";
import ChooseTemplateModal from "./ChooseTemplateModal";
import ClientSegmentSubCategoryCard from "./ClientSegmentSubCategoryCard";
import getListOfCustomerSegmentTypesAPI from "../../apis/marketingAPI/SMSCampaignAPI/getListOfCustomerSegmentTypesAPI";
import {DynamicBoldText} from "./DynamicBoldText";
import getListOfSegmentSubType from "../../apis/marketingAPI/SMSCampaignAPI/getListOfSegmentSubType";
import getListOfClientByFilters from "../../apis/marketingAPI/SMSCampaignAPI/getListOfClientByFilters";
import SegmentSubCategoryListViewModal from "./SegmentSubCategoryListViewModal";
import createCampaignAPI from "../../apis/marketingAPI/SMSCampaignAPI/createCampaignAPI";


export default function CreateSMSCampaignModal(props) {
    const toastRef = useRef(null);

    const [campaignName, setCampaignName] = useState("");
    const [targetAudience, setTargetAudience] = useState("")
    const [listOfCustomerSegmentTypes, setListOfCustomerSegmentTypes] = useState([]);
    const [templateData, setTemplateData] = useState({
        template_id: "",
        template_name: "",
        selected_template: "",
        template_list: "",
        credit_per_sms: 0,
        sms_char_count: 0,
        total_sms_credit: 0
    });
    const [edit, setEdit] = useState(false);
    const [segmentSubCategories, setSegmentSubCategories] = useState([]);
    const [segmentSubCategoryCount, setSegmentSubCategoryCount] = useState(0);
    const [mobileNumbers, setMobileNumbers] = useState([]);
    const [subCategoryListViewModalVisibility, setSubCategoryListViewModalVisibility] = useState(false);
    const [segmentSubType, setSegmentSubType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [templateValid, setTemplateValid] = useState(true);

    const [chooseTemplateModalVisibility, setChooseTemplateModalVisibility] = useState(false);

    const campaignNameRef = useRef(null);
    const selectedTemplateRef = useRef(null);
    const targetAudienceRef = useRef(null);

    useEffect(() => {
        getListOfCustomerSegmentTypesAPI().then((response) => {
            setListOfCustomerSegmentTypes(response.data.data[0]);
        })
    }, []);

    async function onSave() {
        setLoading(true)

        const campaignNameValid = campaignNameRef.current();
        const selectTemplateValid = templateData.selected_template !== "";
        const targetAudienceValid = targetAudienceRef.current();

        if(!campaignNameValid || !targetAudienceValid) {
            if(!selectTemplateValid) {
                setTemplateValid(false);
            }
            setLoading(false)
            return;
        }
        if(!selectTemplateValid) {
            setTemplateValid(false);
            setLoading(false)
            return;
        }


        const response = await createCampaignAPI(
            campaignName,
            templateData.selected_template,
            templateData.credit_per_sms,
            segmentSubType,
            listOfCustomerSegmentTypes.filter((item) => item.name === targetAudience)[0].id,
            mobileNumbers,
            templateData.total_sms_credit
        )



        if (response.data.status_code === 200) {
            props.toastRef.current.show(response.data.message)
            setLoading(false)
            props.onSave();
        }
        else {
            toastRef.current.show(response.data.other_message)
            setLoading(false)
        }
        setLoading(false)

    }

    return <Modal
        visible={props.visible}
        animationType="slide"
        style={styles.modal}
        onRequestClose={props.onClose}
        presentationStyle={"formSheet"}
    >
        <Toast ref={toastRef}/>
        {
            chooseTemplateModalVisibility &&
            <ChooseTemplateModal
                visible={chooseTemplateModalVisibility}
                onClose={() => {
                    setChooseTemplateModalVisibility(false);
                    setTemplateValid(true);
                }}
                templateData={templateData}
                setTemplateData={setTemplateData}
                edit={edit}
            />
        }
        {
            subCategoryListViewModalVisibility &&
            <SegmentSubCategoryListViewModal
                visible={subCategoryListViewModalVisibility}
                onClose={() => setSubCategoryListViewModalVisibility(false)}
                title={targetAudience}
                setSegmentSubType={setSegmentSubType}
                segmentSubType={segmentSubType}
                onSave={() => {
                    setSubCategoryListViewModalVisibility(false);
                    getListOfClientByFilters(0, 10, {
                        category: targetAudience,
                        "sub-category": segmentSubType
                    }).then(response => {
                        const count = response.data.data[0].total_count
                        setSegmentSubCategoryCount(count)
                        getListOfClientByFilters(0, count, {
                            category: targetAudience,
                            "sub-category": segmentSubType
                        }).then(response => {
                            setMobileNumbers(response.data.data[0].mobile_numbers);
                        })
                    });
                    setSegmentSubCategories([])
                }}
            />
        }

        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleMedium, {fontSize: 20,}, styles.titleText]}>{"Create Campaign"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onClose}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <>
            <ScrollView
                style={styles.modalContent}
            >
                <View style={styles.TRAIRegulationInfoContainer}>
                    <View style={styles.TRAIHeaderContainer}>
                        <MaterialIcons name="info" size={24} color={Colors.highlight} />

                        <Text style={[textTheme.titleMedium]}>TRAI Regulation</Text>
                    </View>
                    <Text style={[textTheme.bodyMedium]}>
                        We have TRAI regulation for sending promotional text messages. Please send your template content and template ID to the support@vipsline.com. We will review and approve those. Then, you can send the campaigns.
                    </Text>
                </View>

                <View style={styles.promotionalSenderContainer}>
                    <View style={{flexDirection: "row", gap: 8}}>
                        <Image source={require("../../assets/icons/marketingIcons/smsCampaign/message.png")} style={{width: 25, height: 25}}/>
                        <Text style={[textTheme.bodyMedium]}>Promotional Sender ID</Text>
                    </View>
                    <Text style={[textTheme.titleMedium]}>632401</Text>
                </View>

                <Text style={[textTheme.titleMedium, {paddingHorizontal: 8, marginTop: 32}]}>Enter the campaign details</Text>

                <CustomTextInput
                    label={"Campaign name"}
                    type={"text"}
                    value={campaignName}
                    maxLength={20}
                    placeholder={"Enter Campaign name"}
                    container={{marginTop: 24}}
                    onChangeText={(text) => setCampaignName(text)}
                    validator={(text) => {
                        if (campaignName === "" || campaignName.trim().length === 0) {
                            return "Campaign name is required.";
                        }
                        else return true;
                    }}
                    onSave={(callback) => campaignNameRef.current = callback}
                    required
                />

                <Text style={[textTheme.bodyMedium]}>SMS campaign content</Text>

                {
                    templateData.template_name === "" ?
                        <>
                            <PrimaryButton
                                label={"Select message template"}
                                buttonStyle={styles.selectTemplateButton}
                                pressableStyle={styles.selectTemplatePressable}
                                textStyle={styles.selectTemplateButtonText}
                                onPress={() => setChooseTemplateModalVisibility(true)}
                            />
                            {
                                templateValid ? <></> :
                                <Text style={[textTheme.bodyMedium, {color: Colors.error}]}>{"Template is required"}</Text>
                            }

                        </> :
                        <View style={styles.campaignContent}>
                            <DynamicBoldText
                                text={templateData.selected_template}
                                textStyle={{paddingHorizontal: 16,}}
                            />
                            <View style={{alignItems: "flex-end"}}>
                                <Text style={[textTheme.bodyMedium, {color: Colors.grey500, paddingTop: 32, paddingHorizontal: 16, paddingBottom: 12}]}>
                                    {`${templateData.credit_per_sms} Credit     Aa | ${templateData.sms_char_count}`}
                                </Text>
                            </View>

                            <View style={{flexDirection: "row", backgroundColor: Colors.grey150}}>
                                <PrimaryButton
                                    buttonStyle={{
                                        flex: 1,
                                        borderRadius: 0,
                                        backgroundColor: Colors.grey150
                                    }}
                                    pressableStyle={{
                                        flexDirection: "row",
                                        gap: 8,
                                    }}
                                    onPress={() => {
                                        setEdit(true);
                                        setChooseTemplateModalVisibility(true);
                                    }}
                                >
                                    <Image source={require("../../assets/icons/marketingIcons/smsCampaign/data_flow_horizontal.png")} style={{width: 25, height: 25}}/>
                                    <Text style={[textTheme.bodyMedium, {color: Colors.highlight}]}>Change template</Text>
                                </PrimaryButton>
                                <PrimaryButton
                                    buttonStyle={{
                                        flex: 1,
                                        borderRadius: 0,
                                        backgroundColor: Colors.grey150
                                    }}
                                    pressableStyle={{
                                        flexDirection: "row",
                                        gap: 8,
                                    }}
                                >
                                    <Image source={require("../../assets/icons/marketingIcons/smsCampaign/attachment.png")} style={{width: 25, height: 25}}/>
                                    <Text style={[textTheme.bodyMedium, {color: Colors.highlight}]}>Insert variable</Text>
                                </PrimaryButton>

                            </View>

                        </View>
                }

                <CustomTextInput
                    type={"dropdown"}
                    dropdownItems={listOfCustomerSegmentTypes.map(item => item.name)}
                    label={"Select target audience"}
                    container={{marginTop: 24}}
                    placeholder={"Choose customer segment"}
                    value={targetAudience}
                    onChangeValue={(segmentName) => {
                        setTargetAudience(segmentName)
                        setSegmentSubCategoryCount(0);
                        if(["Services", "Products", "Service Category"].includes(segmentName)) {
                            setSubCategoryListViewModalVisibility(true);
                            return;
                        }

                        if(["Visited Date Range", "New Customers"].includes(segmentName)) {
                            setSegmentSubCategories("date")
                            return;

                        }
                        const customer_type_id = listOfCustomerSegmentTypes.filter((item) => item.name === segmentName)[0].id

                        getListOfSegmentSubType(customer_type_id).then((response) => {
                            setSegmentSubCategories(response.data.data[0]);
                        })

                    }}
                    validator={(text) => {
                        if(targetAudience.length === 0) {
                            return "Target Audience is required.";
                        }
                        else return true;
                    }}
                    onSave={(callback) => targetAudienceRef.current = callback}
                    required
                />
                {
                    (targetAudience !== "" && !subCategoryListViewModalVisibility) &&
                    <ClientSegmentSubCategoryCard
                        subCategories={segmentSubCategories}
                        targetAudience={targetAudience}
                        countOnPress={() => {}}
                        onChangeCategory={(subCategory) => {
                            console.log(subCategory)
                            setSegmentSubType(subCategory);
                            const payload = Array.isArray(subCategory) ? {
                                category: targetAudience,
                                "sub-category": subCategory
                            } : {
                                ...subCategory,
                            }
                            getListOfClientByFilters(0, 10, payload).then(response => {
                                const count = response.data.data[0].total_count
                                setSegmentSubCategoryCount(count)
                                getListOfClientByFilters(0, count, payload).then(response => {
                                    setMobileNumbers(response.data.data[0].mobile_numbers);
                                })
                            })
                        }}
                        type={["Non-Returning Customers", "Average Spending Value"].includes(targetAudience) ? "radiobutton" : "checkbox"}
                        segmentSubCategoryCount={segmentSubCategoryCount}
                    />
                }





            </ScrollView>

            <View style={styles.bottomContainer}>
                <Text style={[textTheme.titleMedium, {textAlign: 'right', color: Colors.highlight}]}>Send a test SMS to my number</Text>
                <View style={styles.bottomInnerContainer}>
                <PrimaryButton
                    onPress={async () => {

                    }}
                    buttonStyle={{
                        backgroundColor: "white",
                        borderWidth: 1,
                        borderColor: Colors.grey400,

                    }}
                    pressableStyle={{paddingHorizontal: 14, paddingVertical: 8, flex: 1}}>
                    <Image source={require("../../assets/icons/marketingIcons/smsCampaign/eye.png")} style={{width: 25, height: 25}} />
                </PrimaryButton>
                    {
                        loading ?
                            <PrimaryButton
                                buttonStyle={styles.saveButton}
                                pressableStyle={styles.saveButtonPressable}
                                onPress={onSave}
                            >
                                <ActivityIndicator size="small" color={Colors.white} />
                            </PrimaryButton> :
                            <PrimaryButton
                                buttonStyle={styles.saveButton}
                                pressableStyle={styles.saveButtonPressable}
                                onPress={onSave}
                            >
                                <Ionicons name="send-sharp" size={24} color={Colors.white} />
                                <Text style={[textTheme.titleMedium, {color: Colors.white}]}>Send</Text>
                            </PrimaryButton>
                    }

                </View>
            </View>

        </>

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
        marginBottom: 32
    },
    TRAIRegulationInfoContainer: {
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 16,
        gap: 12,
        backgroundColor: Colors.grey150
    },
    TRAIHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    promotionalSenderContainer: {
        borderWidth: 1,
        borderColor: Colors.grey400,
        backgroundColor: Colors.grey150,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 24,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    selectTemplateButton: {
        backgroundColor: Colors.highlight50,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Colors.highlight,
        marginTop: 8,
        marginBottom: 8,
        // borderBottomWidth: 0
    },
    selectTemplatePressable: {

    },
    selectTemplateButtonText: {
        color: Colors.highlight,
    },
    bottomContainer: {
        paddingHorizontal: 16,
        marginBottom: 6,
        gap: 12
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
    saveButtonPressable: {
        flexDirection: 'row',
        gap: 8
    },
    bottomInnerContainer: {
        flexDirection: "row",
        gap: 18,
    },
    campaignContent: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: Colors.grey400,
        paddingHorizontal: 0,
        paddingTop: 16,
        overflow: 'hidden',
        marginBottom: 32,
        marginTop: 8

    }

})