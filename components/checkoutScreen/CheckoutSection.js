import {KeyboardAvoidingView, ScrollView, StyleSheet, Text, View} from "react-native";
import {DataTable} from "react-native-paper";
import Divider from "../../ui/Divider";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import {Entypo} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';
import {Keyboard} from "react-native";
import {useState, useEffect} from "react";
import PaymentModal from "./PaymentModal";

const CheckoutSection = () => {
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

    const styles = StyleSheet.create({
        checkoutSection: {
            justifyContent: "flex-end"
        },
        checkoutDetailRow: {
            flexDirection: "row",
            justifyContent: "space-around",
            borderBottomWidth: 1,
            borderBottomColor: Colors.grey600,
            borderStyle: "dashed",
            paddingVertical: 5,
        },
        checkoutDetailText: {},
        buttonContainer: {
            flexDirection: "row", margin: 10, gap: 10,
        },
        optionButton: {
            backgroundColor: Colors.transparent, borderColor: Colors.grey900, borderWidth: 1,
        },
        checkoutButton: {
            flex: 1,
        },
        checkoutButtonPressable: {
            // flex:1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "space-between", // alignItems:"stretch",
            // alignSelf:"auto",
        },
        checkoutButtonAmountAndArrowContainer: {
            flexDirection: "row", gap: 25,
        },
        checkoutButtonText: {
            color: Colors.white
        }
    });

    return <View style={styles.checkoutSection}>
        <PaymentModal isVisible={isPaymentModalVisible} onCloseModal={()=>{setIsPaymentModalVisible(false)}} />
        <View style={styles.checkoutDetailRow}>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Sub Total</Text>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ 5000</Text>
        </View>
        <View style={styles.checkoutDetailRow}>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Discount</Text>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ 5000</Text>
        </View>
        <View style={styles.checkoutDetailRow}>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>GST (18%)</Text>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ 5000</Text>
        </View>
        <View style={styles.checkoutDetailRow}>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Charges</Text>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ 5000</Text>
        </View>
        <View style={styles.buttonContainer}>
            <PrimaryButton buttonStyle={styles.optionButton}>
                <Entypo name="dots-three-horizontal" size={24} color="black"/>
            </PrimaryButton>
            <PrimaryButton buttonStyle={styles.checkoutButton} pressableStyle={styles.checkoutButtonPressable} onPress={()=>{setIsPaymentModalVisible(true)}}>
                <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>Total Amount</Text>
                <View style={styles.checkoutButtonAmountAndArrowContainer}>
                    <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>₹ 5000</Text>
                    <Feather name="arrow-right-circle" size={24} color={Colors.white}/>
                </View>
            </PrimaryButton>
        </View>
    </View>
}


export default CheckoutSection;