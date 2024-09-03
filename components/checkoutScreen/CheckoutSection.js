import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text, ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import {DataTable} from "react-native-paper";
import Divider from "../../ui/Divider";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import {Entypo, MaterialCommunityIcons} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';
import {Keyboard} from "react-native";
import {useState, useEffect, useRef} from "react";
import PaymentModal from "./PaymentModal";
import Popover from "react-native-popover-view";
import {loadWalletPriceFromDb} from "../../store/invoiceSlice";
import {useDispatch, useSelector} from "react-redux";
import {checkStaffOnCartItems} from "../../store/cartSlice";

const CheckoutSection = (props) => {
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const dispatch = useDispatch();
    const clientInfo = useSelector(state => state.clientInfo);
    const centralGST = 30;
    const stateGST = 30;

    const itemName = "Shampoo";
    const itemPrice = 500;


    const serviceDiscount = true;
    const productDiscount = false;

    const [discountCategory, setDiscountCategory] = useState({
        service: "",
        product: "",
        package: "",
    });

    const cartDetails = useSelector(state => state.cart.items);

    useEffect(() => {
        const updatedCategory = { service: 0, product: 0, package: 0 };

        cartDetails.forEach(item => {
            if (["Women", "Men", "General"].includes(item.gender)) {
                updatedCategory.service += item.service_discount;
            } else if (item.gender === "Products") {
                updatedCategory.product += item.service_discount;
            } else if (item.gender === "packages") {
                updatedCategory.package += item.price - item.total_price;
            }
        });

        setDiscountCategory({
            service: updatedCategory.service.toFixed(0),
            product: updatedCategory.product.toFixed(0),
            package: updatedCategory.package.toFixed(0),
        });
    }, [cartDetails]);

    const selectedClientDetails = useSelector(state => state.clientInfo.details);





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
        checkoutDetailText: {
            marginRight: 8
        },
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
        },
        checkoutDetailInnerContainer: {
            flexDirection: 'row',
            // borderWidth: 1
        },
        popoverStyle: {
            padding: 12
        }
    });


    return <View style={styles.checkoutSection}>
        <PaymentModal isVisible={isPaymentModalVisible} onCloseModal={() => {
            setIsPaymentModalVisible(false)
        }} price={ props.data !== null ? props.data[0].total_price : 0}/>
        <View style={styles.checkoutDetailRow}>
            {/*<Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Discount</Text>*/}
            {/*<Text*/}
            {/*    style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ { props.data !== null ? props.data[0].total_discount_in_price : 0}</Text>*/}
            <View>
                <Popover popoverStyle={styles.popoverStyle}
                         from={
                             <Pressable style={styles.checkoutDetailInnerContainer}>
                                 <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Discount</Text>
                                 <MaterialCommunityIcons name="information-outline" size={24} color="black"/>
                             </Pressable>
                }
                         offset={Platform.OS === "ios" ? 0 : 32}
                >
                    {
                        discountCategory.service !== "0" ?
                            <Text>Service Discount: ₹{discountCategory.service}</Text> : null
                    }
                    {
                        discountCategory.product !== "0" ?
                            <Text>Product Discount: ₹{discountCategory.product}</Text> : null
                    }
                    {
                        discountCategory.package !== "0" ?
                            <Text>Package Discount: ₹{discountCategory.package}</Text> : null
                    }
                    {
                        discountCategory.service === "0" &&
                        discountCategory.product === "0" &&
                        discountCategory.package === "0" ?
                            <Text>No discounts applied</Text> :
                            null
                    }
                </Popover>
            </View>

            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {props.data !== null ? props.data[0].total_discount_in_price : 0}</Text>
        </View>

        <View style={styles.checkoutDetailRow}>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Sub Total</Text>
            <Text
                style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ { props.data !== null ? props.data[0].total_price_after_discount : 0}</Text>
        </View>
        <View style={styles.checkoutDetailRow}>
            <View>
                <Popover popoverStyle={styles.popoverStyle}
                         from={
                             <Pressable style={styles.checkoutDetailInnerContainer}>
                                 <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>GST (18%)</Text>
                                 <MaterialCommunityIcons name="information-outline" size={24} color="black"/>
                             </Pressable>
                         }
                         offset={Platform.OS === "ios" ? 0 : 32}
                >
                    <Text>SGST (9%) : ₹ {props.data[0].gst_charges / 2}</Text>
                    <Text>CGST (9%) : ₹ {props.data[0].gst_charges / 2}</Text>
                </Popover>
            </View>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {props.data !== null ? props.data[0].gst_charges : 0}</Text>
        </View>
        {/*<View style={styles.checkoutDetailRow}>*/}
        {/*    <View>*/}
        {/*        <Popover popoverStyle={styles.popoverStyle}*/}
        {/*                 from={*/}
        {/*                     (<Pressable style={styles.checkoutDetailInnerContainer}>*/}
        {/*                         <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Charges</Text>*/}
        {/*                         <MaterialCommunityIcons name="information-outline" size={24} color="black"/>*/}
        {/*                     </Pressable>)*/}
        {/*                 }*/}
        {/*                 offset={Platform.OS === "ios" ? 0 : 32}*/}
        {/*        >*/}
        {/*            <Text>{itemName} : ₹ {itemPrice}</Text>*/}
        {/*        </Popover>*/}
        {/*    </View>*/}

        {/*    /!*<Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Charges</Text>*!/*/}
        {/*    <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ 5000</Text>*/}
        {/*</View>*/}
        <View style={styles.buttonContainer}>
            <PrimaryButton buttonStyle={styles.optionButton}>
                <Entypo name="dots-three-horizontal" size={24} color="black"/>
            </PrimaryButton>
            <PrimaryButton buttonStyle={styles.checkoutButton} pressableStyle={styles.checkoutButtonPressable}
                           onPress={() => {
                               if(!clientInfo.isClientSelected) {
                                   ToastAndroid.show("Please select client", ToastAndroid.LONG);
                                   return;
                               }
                               if (!dispatch(checkStaffOnCartItems())) {
                                   ToastAndroid.show("Please select staff", ToastAndroid.LONG);
                                   return;
                               }
                               setIsPaymentModalVisible(true)
                           }}>
                <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>Total Amount</Text>
                <View style={styles.checkoutButtonAmountAndArrowContainer}>
                    <Text
                        style={[textTheme.titleMedium, styles.checkoutButtonText]}>₹ {props.data !== null ? props.data[0].total_price : 0}</Text>
                    <Feather name="arrow-right-circle" size={24} color={Colors.white}/>
                </View>
            </PrimaryButton>
        </View>
    </View>
}


export default CheckoutSection;