import {KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {AntDesign, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import PrimaryButton from "../../ui/PrimaryButton";
import React, {useState} from "react";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import Divider from "../../ui/Divider";
import {formatDate} from "../../util/Helpers";
import RNDateTimePicker, {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {addItemToCart} from "../../store/cartSlice";
import {useDispatch} from "react-redux";

const EditMembershipModal = (props) => {
    const dispatch = useDispatch();
    const [validFromDate, setValidFromDate] = useState(Date.now());
    const [validUntilDate, setValidUntilDate] = useState(Date.now() + (props.data.duration * 24 * 60 * 60 * 1000));
    const [isValidFromDatePickerVisible, setIsValidFromDatePickerVisible] = useState(false);
    const [isValidUntilDatePickerVisible, setIsValidUntilDatePickerVisible] = useState(false);
    const [membershipPrice, setMembershipPrice] = useState(props.data.price);
    const [membershipId, setMembershipId] = useState(props.data.id);


    return <>
        {isValidFromDatePickerVisible && (
            <RNDateTimePicker
                value={new Date(validFromDate)}
                mode="date"
                display="default"
                onChange={(date) => {
                    setIsValidFromDatePickerVisible(false);
                    setValidFromDate(
                        date.nativeEvent.timestamp
                    );
                }}
            />
        )}
        {isValidUntilDatePickerVisible && (
            <RNDateTimePicker
                value={new Date(validUntilDate)}
                mode="date"
                display="default"
                onChange={(date) => {
                    setIsValidUntilDatePickerVisible(false);
                    setValidUntilDate(
                        date.nativeEvent.timestamp
                    );
                }}
            />
        )}
        <Modal visible={props.isVisible} style={styles.editMembershipModal}>
            <View style={styles.headingAndCloseContainer}>
                <Text style={[textTheme.titleLarge, styles.heading]}>{props.data.name}</Text>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    onPress={props.onCloseModal}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
            </View>
            <Divider/>
            <ScrollView style={{flex: 1,}}>

                <View style={styles.modalContent}>
                    <Text style={[textTheme.labelLarge]}>Valid from</Text>
                    <View style={styles.validInputContainer}>
                        <Text style={[textTheme.bodyLarge]}>{formatDate(validFromDate)}</Text>
                        <PrimaryButton buttonStyle={styles.calendarButtonStyle} onPress={() => {
                            setIsValidFromDatePickerVisible(true)
                        }}>
                            <MaterialCommunityIcons
                                name="calendar-month-outline"
                                size={24}
                                color={Colors.grey600}
                            />
                        </PrimaryButton>
                    </View>
                    <Text style={[textTheme.labelLarge]}>Valid until</Text>
                    <View style={styles.validInputContainer}>
                        <Text style={[textTheme.bodyLarge]}>{formatDate(validUntilDate)}</Text>
                        <PrimaryButton buttonStyle={styles.calendarButtonStyle} onPress={() => {
                            setIsValidUntilDatePickerVisible(true)
                        }}>
                            <MaterialCommunityIcons
                                name="calendar-month-outline"
                                size={24}
                                color={Colors.grey600}
                            />
                        </PrimaryButton>
                    </View>
                    <Text style={[textTheme.labelLarge]}>Membership Price</Text>
                    <View style={styles.membershipPriceInputContainer}>
                        <FontAwesome style={styles.rupeeSymbol} name="rupee" size={20} color={Colors.grey600}/>
                        <TextInput style={[textTheme.bodyLarge, styles.membershipInputText]} keyboardType={"number-pad"}
                                   value={membershipPrice.toString()}
                                   onChangeText={(price) => setMembershipPrice(price)}/>
                    </View>
                    <Text style={[textTheme.labelLarge]}>Membership ID</Text>
                    <View style={styles.membershipIDInputContainer}>
                        <TextInput style={[textTheme.bodyLarge, styles.membershipInputText]}
                                   value={membershipId.toString()} onChangeText={(_id) => setMembershipId(_id)}/>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.addToCartButtonContainer}>
                <PrimaryButton onPress={() => {
                    props.onCloseModal();
                    dispatch(addItemToCart(props.data));
                }} label={"Add to cart"}/>
            </View>

        </Modal>
    </>

}

const styles = StyleSheet.create({
    editMembershipModal: {
        flex: 1,
    },
    headingAndCloseContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    heading: {
        fontWeight: 500
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 5,
        backgroundColor: Colors.background,
    },
    modalContent: {
        flex: 1,
        padding: 30,
    },
    validInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 5,
        paddingLeft: 20,
        paddingRight: 1,
        marginTop: 10,
        marginBottom: 30,
    },
    membershipPriceInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 5,
        paddingRight: 20,
        marginTop: 10,
        marginBottom: 30,

    },
    calendarButtonStyle: {
        backgroundColor: Colors.background,
        alignSelf: "auto",
        borderRadius: 0,
        borderLeftWidth: 1,
        borderLeftColor: Colors.grey400,
    },
    rupeeSymbol: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 15,
        borderRightWidth: 1,
        borderRightColor: Colors.grey400,
    },
    membershipIDInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 5,
        paddingRight: 20,
        marginTop: 10,
        marginBottom: 30,
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    membershipInputText: {
        fontWeight: "500",
        flex: 1,
    },
    addToCartButtonContainer: {
        marginHorizontal: 30,
        marginTop:20,
        marginBottom: 20,
    }
})

export default EditMembershipModal