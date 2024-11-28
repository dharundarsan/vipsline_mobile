import {
    Button,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    View
} from "react-native";
import {AntDesign, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import PrimaryButton from "../../ui/PrimaryButton";
import React, {useRef, useState} from "react";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import Divider from "../../ui/Divider";
import {checkNullUndefined, formatDate} from "../../util/Helpers";
import RNDateTimePicker, {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {addItemToCart, addItemToEditedCart, editMembership, updateCalculatedPrice} from "../../store/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import CustomTextInput from "../../ui/CustomTextInput";
import * as Haptics from "expo-haptics";
import Toast from "../../ui/Toast";


const EditMembershipModal = (props) => {
    const dispatch = useDispatch();
    const editedCart = useSelector(state => state.cart.editedCart);
    const editedData = editedCart.filter(item => item.membership_id === props.data.membership_id)[0]
    const appointmentDate = useSelector(state => state.cart.appointment_date);
    const [date, setDate] = useState(new Date(appointmentDate).setHours(0, 0, 0, 0));
    const [validFromDate, setValidFromDate] = useState(editedData ? new Date(editedData.valid_from) : date);
    const [validUntilDate, setValidUntilDate] = useState(editedData ? new Date(editedData.valid_until) : date + (props.data.duration * 24 * 60 * 60 * 1000));
    const [membershipPrice, setMembershipPrice] = useState(editedData ? editedData.amount : props.data.price);
    const [membershipNumber, setMembershipNumber] = useState(editedData ? editedData.membership_number === undefined ? "" : editedData.membership_number : "");
    const cartItems = useSelector(state => state.cart.items);
    const businessDetail = useSelector(state => state.businessDetail.detail)

    const toastRef = useRef(null);

    const handleSave = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (!props.edited && (cartItems.some(item => item.membership_id === props.data.id || editedCart.some(item => item.membership_id === props.data.id)))) {
            toastRef.current.show("Membership already exists in cart", 2000);
            return;
        }
        try {
            if (props.edited) {
                dispatch(editMembership({
                    id: props.data.id === undefined ? props.data.membership_id : props.data.id,
                    data: {
                        amount: membershipPrice,
                        price: membershipPrice,
                        total_price: membershipPrice,
                        bonus_value: 0,
                        disc_value: 0,
                        type: "AMOUNT",
                        id: props.data.membership_id,
                        res_cat_id: props.data.resource_category_id,
                        valid_from: formatDate(validFromDate, "yyyy-mm-dd"),
                        valid_until: formatDate(validUntilDate, "yyyy-mm-dd"),
                        membership_number: membershipNumber,
                    }
                }))
                dispatch(updateCalculatedPrice())
                props.onCloseModal()
            } else {
                if (new Date(validFromDate).getTime() !== new Date(date).getTime() ||
                    new Date(validUntilDate).getTime() !== new Date(date + (props.data.duration * 24 * 60 * 60 * 1000)).getTime() ||
                    membershipPrice !== props.data.price ||
                    membershipNumber !== "" ||
                    new Date(appointmentDate).getDate() !== new Date(Date.now()).getDate()) {
                    dispatch(addItemToEditedCart({
                        ...props.data,
                        gender: "membership",
                        price: membershipPrice,
                        total_price: membershipPrice,
                        amount: membershipPrice,
                        resource_id: null,
                        "id": props.data.id,
                        "membership_id": props.data.id,
                        "membership_number": membershipNumber,
                        "valid_from": formatDate(validFromDate, "yyyy-mm-dd"),
                        "valid_until": formatDate(validUntilDate, "yyyy-mm-dd"),
                    }));
                    await dispatch(addItemToCart({membership_id: props.data.id, membership_number: membershipNumber}));
                    props.onCloseModal();
                    props.closeOverallModal()
                    return;
                }
                const temp = Math.floor(Math.random() * 90000) + 10000;
                await dispatch(addItemToCart({membership_id: props.data.id, membership_number: membershipNumber}));
                props.onCloseModal();
                props.closeOverallModal()
            }
        } catch (e) {
            toastRef.current.show(e, 2000)
        }

    }
    return <>
        <Modal visible={props.isVisible} style={styles.editMembershipModal} animationType={"slide"}
               presentationStyle="pageSheet" onRequestClose={props.onCloseModal}>
            <Toast ref={toastRef}/>

            <View style={styles.headingAndCloseContainer}>
                <Text
                    style={[textTheme.titleLarge, styles.heading]}> {props.edited ? props.data.resource_category_name : props.data.name}</Text>
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
                    <CustomTextInput label={"Valid from"} type={"date"} value={new Date(validFromDate)}
                                     minimumDate={new Date()}
                                     onChangeValue={(value) => {
                                         if (new Date(value).getTime() > new Date(validUntilDate).getTime()) {
                                             setValidUntilDate(new Date(value).getTime() + (props.data.duration * 24 * 60 * 60 * 1000))
                                         }
                                         if (new Date(value).getTime() < new Date(validUntilDate).getTime()) {
                                             setValidUntilDate(new Date(value).getTime() + (props.data.duration * 24 * 60 * 60 * 1000))
                                         }
                                         setValidFromDate(value)
                                     }}/>
                    <CustomTextInput label={"Valid until"} type={"date"} value={new Date(validUntilDate)}
                                     minimumDate={new Date()}
                                     onChangeValue={(value) => {
                                         if (new Date(validFromDate).getTime() > new Date(value).getTime()) {
                                             toastRef.current.show("Valid from date cannot be higher than valid until date")
                                             return;
                                         }
                                         setValidUntilDate(value)
                                     }}/>
                    <CustomTextInput label={"Membership Price"} type={"price"}
                                     value={membershipPrice.toString()}
                                     onChangeText={(price) => {
                                         if (price === "") setMembershipPrice(0)
                                         else setMembershipPrice(parseFloat(price))
                                     }}/>
                    {businessDetail[0].is_membership_enabled && <CustomTextInput type={"number"} label={"Membership ID"}
                                                                                 value={membershipNumber.toString()}
                                                                                 onChangeText={(_id) => setMembershipNumber(_id)}/>}
                </View>
            </ScrollView>
            <View style={styles.addToCartButtonContainer}>
                <PrimaryButton onPress={handleSave} label={"Add to cart"}/>
            </View>
        </Modal>
    </>

}

const styles = StyleSheet.create({
    editMembershipModal: {
        flex: 1,
    },
    headingAndCloseContainer: {
        // marginTop: Platform.OS === "ios" ? 50 : 0,
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
    addToCartButtonContainer: {
        marginHorizontal: 30,
        marginTop: 20,
        marginBottom: 20,
    }
})

export default EditMembershipModal