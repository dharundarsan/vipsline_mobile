import {StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";
import React, {useState} from "react";
import getLeadStatusColor from "../../util/getLeadStatusColor";
import EnquiryNotesModal from "./EnquiryNotesModal";

const enquiryNoteCard = (props) => {
    const [isEditEnquiryNotesModalVisible, setIsEditEnquiryNotesModalVisible] = useState(false)
    const styles = StyleSheet.create({
        enquiryNoteCard: {
            borderColor: "#D5D7DA",
            borderWidth: 1,
            borderRadius: 8,
        },
        enquiryNoteHeader: {
            flexDirection: "row",
            borderBottomColor: "#D5D7DA",
            borderBottomWidth: 1,
            paddingHorizontal: 20,
            paddingVertical: 5,
            alignItems: "center",
            justifyContent: "space-between"
        },
        enquiryNoteContent: {
            paddingVertical: 20,
            paddingHorizontal: 25,
        },
        editButtonIcon: {},
        badgeContainer: {
            minWidth: 80,
            paddingHorizontal: 10,
            backgroundColor: getLeadStatusColor(props.followup.lead_status).background,
            alignItems: "center",
            borderRadius: 5,
        },
        badgeText: {
            color: getLeadStatusColor(props.followup.lead_status).text,
            fontWeight: "500",
        }
    })
    return <View style={{marginBottom: 25}}>
        <View style={styles.enquiryNoteCard}>
            {isEditEnquiryNotesModalVisible && <EnquiryNotesModal refreshLeadsData={props.refreshLeadsData}
                                                                  edit={true}
                                                                  leadProfileToastRef={props.leadProfileToastRef}
                                                                  lead={props.lead}
                                                                  isVisible={isEditEnquiryNotesModalVisible}
                                                                  onCloseModal={() => {
                                                                      setIsEditEnquiryNotesModalVisible(false)
                                                                  }}
                                                                  data={props.followup}/>}
            <View style={styles.enquiryNoteHeader}>
                <View style={{flexDirection: "row", alignItems: "center", gap: 15,}}>
                    <Text style={textTheme.titleMedium}>{props.followup.notes_date}</Text>
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{props.followup.lead_status}</Text>
                    </View>
                </View>
                <PrimaryButton
                    pressableStyle={{
                        paddingHorizontal: 10,
                        paddingVertical: 10
                    }}
                    buttonStyle={{
                        backgroundColor: "white", borderColor: "#D5D7DA",
                        borderWidth: 1,
                        borderRadius: 8,
                    }}
                    onPress={() => {
                        setIsEditEnquiryNotesModalVisible(true)
                    }}>
                    <Feather style={styles.editButtonIcon} name="edit-2" size={15} color="black"/>
                </PrimaryButton>
            </View>
            <View style={styles.enquiryNoteContent}>
                <Text
                    style={textTheme.bodyMedium}>{props.followup.notes ? props.followup.notes : "No Description Added"}</Text>
                {props.followup.date && <>
                    <Text/>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                        <View
                            style={{backgroundColor: "#E9FAEE", alignSelf: "flex-start", padding: 2, borderRadius: 3}}>
                            <MaterialCommunityIcons name="calendar-range" size={20} color="#10192899"/>
                        </View>
                        <Text style={textTheme.bodyMedium}>Next follow-up date: <Text
                            style={[textTheme.bodyMedium, {fontWeight: "bold"}]}>{props.followup.date}</Text>
                        </Text>
                    </View>
                    <Text/>
                </>}

                {props.followup.time && <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                    <View style={{backgroundColor: "#E9FAEE", alignSelf: "flex-start", padding: 2, borderRadius: 3}}>
                        <Feather name="clock" size={20} color="#10192899"/>
                    </View>
                    <Text style={textTheme.bodyMedium}>Time: <Text
                        style={[textTheme.bodyMedium, {fontWeight: "bold"}]}>{props.followup.time}</Text>
                    </Text>
                </View>}
            </View>
        </View>
        <Text style={{marginTop: 5, fontSize: 12}}>{props.followup.notes_date} • {props.followup.notes_time}</Text>
    </View>
}

export default enquiryNoteCard;
