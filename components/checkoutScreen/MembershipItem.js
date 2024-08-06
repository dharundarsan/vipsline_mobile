import {StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import {capitalizeFirstLetter} from "../../util/Helpers";
import {addItemToCart} from "../../store/cartSlice";
import {useDispatch} from "react-redux";
import EditMembershipModal from "./EditMembershipModal";
import React, {useState} from "react";

const MembershipItem = (props) => {
    const dispatch = useDispatch();
    const [isEditMembershipModalVisible, setIsEditMembershipModalVisible] = useState(false);

    const closeEditMembershipModal = () => {
        setIsEditMembershipModalVisible(false);
    }

    const styles = StyleSheet.create({
        membershipItemButton: {
            margin: 10,
            borderWidth: 1,
            borderColor: props.selected ? Colors.blue : Colors.grey400,
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: Colors.transparent,
        },
        membershipItemPressable: {
            paddingHorizontal: 30,
            paddingVertical: 10,
        },
        membershipItemInnerContainer: {
            width: "100%",
        },
        leftBar: {
            position: "absolute",
            backgroundColor: Colors.highlight,
            width: 5,
            height: "200%",
            left: 0,
        },
        nameText: {
            marginBottom: 10,
        },
        durationText: {
            color: Colors.grey600,
        },
        servicesAndProductsText: {
            color: Colors.grey600,
            marginBottom: 5,
        },
        priceText: {}
    })

    return <>
        <EditMembershipModal isVisible={isEditMembershipModalVisible} onCloseModal={closeEditMembershipModal} data={props.data} />
        <PrimaryButton buttonStyle={styles.membershipItemButton} pressableStyle={styles.membershipItemPressable}
                       onPress={() => {
                           // props.addToTempSelectedItems(props.data);
                           // dispatch(addItemToCart(props.data));
                           setIsEditMembershipModalVisible(true);
                       }}>
            <View style={styles.leftBar}></View>
            <View style={styles.membershipItemInnerContainer}>
                <Text style={[styles.nameText, textTheme.titleMedium]}>{capitalizeFirstLetter(props.data.name)}</Text>
                <Text style={[styles.durationText, textTheme.labelLarge]}>Duration of
                    Membership: {props.data.duration} days</Text>
                <Text
                    style={[styles.servicesAndProductsText, textTheme.labelLarge]}>Services: {props.data.total_services_count} •
                    Products: {props.data.total_product_count}</Text>
                <Text style={[textTheme.titleMedium, styles.priceText]}>₹ {props.data.price}</Text>
            </View>
        </PrimaryButton>
    </>

}


export default MembershipItem;