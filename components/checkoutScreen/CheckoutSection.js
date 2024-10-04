import {
    KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View
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
import {
    checkStaffOnCartItems, clearCalculatedPrice,
    clearLocalCart,
    clearSalesNotes,
    loadCartFromDB,
    modifyClientMembershipId,
    setCalculatedPrice,
    updateCalculatedPrice
} from "../../store/cartSlice";
import DropdownModal from "../../ui/DropdownModal";
import MiniActionTextModal from "./MiniActionTextModal";
import DeleteClient from "../clientSegmentScreen/DeleteClientModal";
import calculateCartPriceAPI from "../../util/apis/calculateCartPriceAPI";
import clearCartAPI from "../../util/apis/clearCartAPI";
import {updateChargeData, updateDiscount, updateSalesNotes} from "../../store/cartSlice";
import {checkNullUndefined, showToast} from "../../util/Helpers";
import {loadBusinessesListFromDb} from "../../store/listOfBusinessSlice";
import {updateTotalClientCount} from "../../store/clientFilterSlice";
import {clearClientInfo} from "../../store/clientInfoSlice";
import InvoiceModal from "./InvoiceModal";
import * as Haptics from 'expo-haptics';
import Toast from "../../ui/Toast";
import {updateToastRef} from "../../store/toastSlice";
import {checkoutScreenToast} from "../../screens/CheckoutScreen";
// import Toast from 'react-native-root-toast';


const CheckoutSection = (props) => {
    const tot = useSelector(state => state.cart.calculatedPrice);


    // const totalChargeAmount = useSelector(state => state.cart.calculatedPrice[0]?.extra_charges_value);
    const totalChargeAmount = checkNullUndefined(tot) ?
        checkNullUndefined(tot[0]) ?
            checkNullUndefined(tot[0].extra_charges_value) ?
                tot[0].extra_charges_value :
                0 :
            0 :
        0;

    const cart = useSelector(state => state.cart);
    // console.log(cart);

    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const dispatch = useDispatch();
    const clientInfo = useSelector(state => state.clientInfo);
    const centralGST = 30;
    const stateGST = 30;
    const calculatedPrice = useSelector(state => state.cart.calculatedPrice) || []
    // console.log("const calculatedPrice = useSelector(state => state.cart.calculatedPrice)")
    const customItems = useSelector(state => state.cart.customItems);


    const itemName = "Shampoo";
    const itemPrice = 500;


    const serviceDiscount = true;
    const productDiscount = false;
    const chargesAmount = useSelector(state => state.cart.chargesData);

    const [discountCategory, setDiscountCategory] = useState({
        service: "", product: "", package: "",
    });

    const cartDetails = useSelector(state => state.cart.items);

    useEffect(() => {
        const updatedCategory = {service: 0, product: 0, package: 0};

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
        }, checkoutDetailRow: {
            flexDirection: "row",
            justifyContent: "space-around",
            borderBottomWidth: 1,
            borderBottomColor: Colors.grey600,
            paddingVertical: 5,
        }, checkoutDetailText: {
            marginRight: 8
        }, buttonContainer: {
            flexDirection: "row", margin: 10, gap: 10,
        }, optionButton: {
            backgroundColor: Colors.transparent, borderColor: Colors.grey900, borderWidth: 1,
        }, checkoutButton: {
            flex: 1,
        }, checkoutButtonPressable: {
            // flex:1,
            flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", // alignItems:"stretch",
            // alignSelf:"auto",
        }, checkoutButtonAmountAndArrowContainer: {
            flexDirection: "row", gap: 25,
        }, checkoutButtonText: {
            color: Colors.white
        }, checkoutDetailInnerContainer: {
            flexDirection: 'row', // borderWidth: 1
        }, popoverStyle: {
            padding: 12
        }, primaryViewChildrenStyle: {
            flexDirection: "row", alignItems: "center"
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ActionModal, setActionModal] = useState(false);
    const [title, setTitle] = useState("")
    const [isDelete, setIsDelete] = useState(false);
    const [discountValue, setDiscountValue] = useState("");
    const [selectedDiscountMode, setSelectedDiscountMode] = useState("PERCENTAGE")
    const [clickedValue, setClickedValue] = useState("")
    const cartItems = useSelector((state) => state.cart.items);
    const editedCart = useSelector((state) => state.cart.editedCart);
    const [salesnote, setSalesnote] = useState("");
    const [chargesInputData, setChargesInputData] = useState([{index: 0}]);
    const [data, setData] = useState([{}])

    useEffect(() => {
        // console.log(JSON.stringify(cartItems,null,3));
        // if(cartItems.length === 0){
        dispatch(updateDiscount([]));
        // }
    }, [])

    function openModal(title, value) {
        setTitle(title);
        setClickedValue(value);
    }

    const invoiceDetails = useSelector(state => state.invoice.details);
    const moreInvoiceDetails = useSelector(state => state.invoice.invoiceDetails);
    const customDiscount = useSelector(state => state.cart.additionalDiscounts);

    async function addDiscount(discountMode, type, amount) {
        if (type === "clear") {
            setDiscountValue("")
            dispatch(updateDiscount([]));
            setSelectedDiscountMode("PERCENTAGE")
        } else {
            if (selectedDiscountMode === "AMOUNT") {
                if ((calculatedPrice[0].total_price_after_discount - discountValue) <= 0) {
                    setDiscountValue(discountValue)
                    // showToast()
                    // TODO
                    props.checkoutScreenToast("Discount should be less than subtotal", 2000);

                    // toastRef.current.show("discount should be less than the amount", 2000);
                    setActionModal(false);
                    return;
                }
            } else if (selectedDiscountMode === "PERCENTAGE") {
                if (discountValue >= 100) {
                    setDiscountValue(amount);
                    // showToast();
                    // TODO
                    props.checkoutScreenToast("Discount should be less than subtotal", 2000);
                    setActionModal(false);
                    return;
                }
            }
            const addDiscount = {
                name: "Custom Discount", type: discountMode, amount: discountValue
            }
            setSelectedDiscountMode(discountMode)
            dispatch(updateDiscount(addDiscount));
        }
        dispatch(updateCalculatedPrice());
        setActionModal(false);
    }

    async function addCharges() {
        if (calculatedPrice[0]) {
            return null;
        }
        // if (!chargesInputData || chargesInputData.length === 0) {
        dispatch(updateChargeData(chargesInputData));
        // }
    }


    async function updateCharges() {
        if (!chargesInputData || chargesInputData.length === 0) {
            return;
        }

        const updatedCharges = chargesInputData.map((item) => {
            // Convert `amount` to a number, default to 0 if conversion fails
            const convertedAmount = parseFloat(item.amount);

            return {
                ...item, amount: isNaN(convertedAmount) ? 0 : convertedAmount,
            };
        });

        dispatch(updateChargeData(updatedCharges));
        dispatch(updateCalculatedPrice());


        setActionModal(false);
    }

    async function UpdateSalesNotes() {
        dispatch(updateSalesNotes(salesnote));
        setActionModal(false)
    }

    function clearCharges() {

        setChargesInputData([{index: 0}])
        dispatch(updateChargeData([{index: 0, name: "", amount: 0,}]));
        dispatch(updateCalculatedPrice());

        setActionModal(false);
    }

    function clearSaleNotes() {
        setSalesnote("");
        dispatch(clearSalesNotes());
        setActionModal(false);
    }

    const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);






    return <View style={styles.checkoutSection}>


        {ActionModal && <MiniActionTextModal isVisible={ActionModal}
                                             onCloseModal={() => {
                                                 setActionModal(false)
                                             }}
                                             total_price_after_discount={calculatedPrice[0].total_price_after_discount}
                                             selectedDiscountMode={selectedDiscountMode}
                                             setSelectedDiscountMode={setSelectedDiscountMode}
                                             clearSalesNotes={clearSaleNotes}
                                             chargesInputData={chargesInputData}
                                             setChargesInputData={setChargesInputData}
                                             title={title}
                                             clickedValue={clickedValue}
                                             data={data}
                                             setDiscountValue={setDiscountValue}
                                             discountValue={discountValue}
                                             onChangeValue={setSalesnote}
                                             salesNote={salesnote}
                                             addDiscount={addDiscount}
                                             addCharges={addCharges}
                                             updateCharges={updateCharges}
                                             UpdateSalesNotes={UpdateSalesNotes}
                                             clearCharges={clearCharges}
        />}
        {isDelete && <DeleteClient
            isVisible={isDelete}
            ActionOptionName={"Cancel Sale"}
            onCloseModal={() => {
                setIsDelete(false)
                // setModalVisibility(false);
                // dispatch(loadClientInfoFromDb(props.id))
            }}
            header={"Cancel Sale"}
            content={"If you cancel this sale transaction will not be processed."}
            onCloseClientInfoAfterDeleted={async () => {
                // props.setVisible(false);
                // props.setSearchQuery("");
                // props.setFilterPressed("all_clients_count");
                await clearCartAPI();
                dispatch(modifyClientMembershipId({type: "clear"}))
                clearSaleNotes();
                dispatch(clearLocalCart());
                dispatch(clearClientInfo());
                dispatch(clearCalculatedPrice())
            }}
            checkoutScreenToast={() => {
                props.checkoutScreenToast("sale cancelled", 2000);
            }}
        />}
        {isModalOpen && <DropdownModal
            isVisible={isModalOpen}
            onCloseModal={() => {

                setIsModalOpen(false)
            }}
            dropdownItems={["Apply Discount", "Add Charges", "Add Sales Notes", "Cancel Sales"]}
            onChangeValue={(value) => {

                if (value === "Apply Discount") {
                    openModal("Add Discount", value)
                    setData([{
                        header: "Enter Discount",
                        boxType: "textBox",
                        typeToggle: 1,
                        keyboardType: "number-pad",
                        selectedDiscountMode: selectedDiscountMode,
                        setSelectedDiscountMode: setSelectedDiscountMode
                    }])
                    setActionModal(true)
                } else if (value === "Add Charges") {
                    openModal("Add extra charges", value)
                    setData([{
                        boxType: "Charges", typeToggle: 0
                    }])
                    setActionModal(true)
                } else if (value === "Add Sales Notes") {
                    openModal("Add a note", value)
                    setData([{
                        header: "Sales notes", boxType: "multiLineBox", typeToggle: 0,
                    }])
                    setActionModal(true)
                } else if (value === "Cancel Sales") {
                    setIsDelete(true);
                }
            }}
            iconImage={[require("../../assets/icons/checkout/actionmenu/applydiscount.png"), require("../../assets/icons/checkout/actionmenu/addcharges.png"), require("../../assets/icons/checkout/actionmenu/salesnote.png"), require("../../assets/icons/checkout/actionmenu/cancelsale.png")]}
            primaryViewChildrenStyle={styles.primaryViewChildrenStyle}
            imageWidth={25}
            imageHeight={25}
        />}
        {isPaymentModalVisible &&
            <PaymentModal isVisible={isPaymentModalVisible}
                          onCloseModal={() => {
                              setIsPaymentModalVisible(false)
                          }}
                          setIsInvoiceModalVisible={setIsInvoiceModalVisible}
                          checkoutScreenToast={() => {
                              props.checkoutScreenToast("Sale Cancelled", 2000);
                          }}
                          price={calculatedPrice.length === 0 ? 0 : calculatedPrice[0].total_price}/>
        }
        {
            isInvoiceModalVisible && Object.keys(invoiceDetails).length !== 0 && Object.keys(moreInvoiceDetails).length !== 0 ?
                <InvoiceModal data={props.data} isVisible={isInvoiceModalVisible} onCloseModal={() => {
                    setIsInvoiceModalVisible(false);
                    // props.onClhttps://gamma.partners.vipsline.com/checkoutoseModal();
                }}/> :
                null
        }
        <View style={[styles.checkoutDetailRow, Platform.OS === "android" ? {borderStyle: "dashed"} : null]}>
            {/*<Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Discount</Text>*/}
            {/*<Text*/}
            {/*    style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ { calculatedPrice.length !== 0 ? calculatedPrice[0].total_discount_in_price : 0}</Text>*/}
            <View>
                {
                    checkNullUndefined(calculatedPrice[0]) ? calculatedPrice[0].total_discount_in_price === 0 ?
                            <Pressable style={styles.checkoutDetailInnerContainer}>
                                <Text
                                    style={[textTheme.titleMedium, styles.checkoutDetailText]}>Discount</Text>
                                <MaterialCommunityIcons name="information-outline" size={24}
                                                        color="black"/>
                            </Pressable> :

                            <Popover popoverStyle={styles.popoverStyle}
                                     from={<Pressable style={styles.checkoutDetailInnerContainer}>
                                         <Text
                                             style={[textTheme.titleMedium, styles.checkoutDetailText]}>Discount</Text>
                                         <MaterialCommunityIcons name="information-outline" size={24}
                                                                 color="black"/>
                                     </Pressable>}
                                     offset={Platform.OS === "ios" ? 0 : 32}
                            >
                                {discountCategory.service !== "0" ?
                                    <Text>Service Discount: ₹{discountCategory.service}</Text> : null}
                                {discountCategory.product !== "0" ?
                                    <Text>Product Discount: ₹{discountCategory.product}</Text> : null}
                                {discountCategory.package !== "0" ?
                                    <Text>Package Discount: ₹{discountCategory.package}</Text> : null}
                                {checkNullUndefined(customDiscount) && checkNullUndefined(customDiscount[0]) && checkNullUndefined(customDiscount[0].amount) ?
                                    <Text>Custom
                                        Discount: {customDiscount[0].type === "PERCENTAGE" ? `${customDiscount[0].amount}%` : `₹${customDiscount[0].amount}`}</Text> : null}
                                {discountCategory.service === "0" && discountCategory.product === "0" && discountCategory.package === "0" && customDiscount !== undefined && customDiscount.length === 0 ?
                                    <Text>No discounts applied</Text> : null}
                            </Popover> :
                        <></>
                }
            </View>

            <Text
                style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {calculatedPrice.length === 0 ? 0 : calculatedPrice[0].total_discount_in_price}</Text>
        </View>

        <View style={[styles.checkoutDetailRow, Platform.OS === "android" ? {borderStyle: "dashed"} : null]}>
            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Sub Total</Text>
            <Text
                style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {calculatedPrice.length !== 0 ? calculatedPrice[0].total_price_after_discount : 0}</Text>
        </View>
        <View style={[styles.checkoutDetailRow, Platform.OS === "android" ? {borderStyle: "dashed"} : null]}>
            <View>
                {
                    checkNullUndefined(calculatedPrice[0]) && calculatedPrice[0].gst_charges === 0 ?
                        <Pressable style={styles.checkoutDetailInnerContainer}>
                            <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>GST
                                (18%)</Text>
                            <MaterialCommunityIcons name="information-outline" size={24} color="black"/>
                        </Pressable> :
                        <Popover popoverStyle={styles.popoverStyle}
                                 from={<Pressable style={styles.checkoutDetailInnerContainer}>
                                     <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>GST
                                         (18%)</Text>
                                     <MaterialCommunityIcons name="information-outline" size={24} color="black"/>
                                 </Pressable>}
                                 offset={Platform.OS === "ios" ? 0 : 32}
                        >
                            {calculatedPrice.length === 0 ? null : calculatedPrice[0].tax_details.map((item, index) => (
                                <View key={index} style={styles.calculatepriceRow}>
                                    <Text style={[textTheme.bodyMedium, styles.checkoutDetailText]}>
                                        {item.name + ": "} ₹ {item.value}
                                    </Text>
                                </View>))

                            }
                        </Popover>
                }
            </View>
            <Text
                style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {calculatedPrice.length === 0 ? 0 : calculatedPrice[0].gst_charges}</Text>
        </View>
        {
            totalChargeAmount !== 0 ?
                <View
                    style={[styles.checkoutDetailRow, Platform.OS === "android" ? {borderStyle: "dashed"} : null]}>
                    <View>
                        {
                            chargesAmount[0].amount === 0 ?
                                <Pressable style={styles.checkoutDetailInnerContainer}>
                                    <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Charges</Text>
                                    <MaterialCommunityIcons name="information-outline" size={24} color="black"/>
                                </Pressable> :
                                <Popover popoverStyle={styles.popoverStyle}
                                         from={
                                             (<Pressable style={styles.checkoutDetailInnerContainer}>
                                                 <Text
                                                     style={[textTheme.titleMedium, styles.checkoutDetailText]}>Charges</Text>
                                                 <MaterialCommunityIcons name="information-outline" size={24}
                                                                         color="black"/>
                                             </Pressable>)
                                         }
                                         offset={Platform.OS === "ios" ? 0 : 32}
                                >
                                    {

                                        chargesAmount.map((item, index) => {
                                            return (
                                                <View key={index}>
                                                    <Text key={index}>{item.name} : ₹ {item.amount}</Text>
                                                </View>

                                            )
                                        })
                                    }
                                </Popover>
                        }
                    </View>

                    {/*<Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Charges</Text>*/}
                    {/*<Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>*/}
                    {/*    ₹ {checkNullUndefined(chargesAmount[0].amount) ? chargesAmount[0].amount : null}*/}
                    {/*</Text>*/}
                    <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {totalChargeAmount}</Text>
                </View> :
                <></>
        }
        <View style={styles.buttonContainer}>
            <PrimaryButton buttonStyle={styles.optionButton} onPress={() => {

                setIsModalOpen(true)
            }}>
                <Entypo name="dots-three-horizontal" size={24} color="black"/>
            </PrimaryButton>
            <PrimaryButton buttonStyle={styles.checkoutButton}
                           pressableStyle={styles.checkoutButtonPressable}
                           onPress={() => {


                               if (!clientInfo.isClientSelected) {
                                   // ToastAndroid.show("Please select client", ToastAndroid.LONG);
                                   // Toast.show("Please select client", {
                                   //     duration: Toast.durations.LONG,
                                   //     position: Toast.positions.BOTTOM,
                                   //     shadow: false,
                                   //     backgroundColor: "black",
                                   //     opacity: 1
                                   // })
                                   props.checkoutScreenToast("Please select client", 2000);


                                   return;
                               }
                               if (!dispatch(checkStaffOnCartItems())) {
                                   // ToastAndroid.show("Please select staff", ToastAndroid.LONG);
                                   // Toast.show("Please select staff", {
                                   //     duration: Toast.durations.LONG,
                                   //     position: Toast.positions.BOTTOM,
                                   //     shadow: false,
                                   //     backgroundColor: "black",
                                   //     opacity: 1
                                   // })
                                   props.checkoutScreenToast("Please select staff", 2000);
                                   return;
                               }
                               setIsPaymentModalVisible(true)
                           }}>
                <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>Total Amount</Text>
                <View style={styles.checkoutButtonAmountAndArrowContainer}>
                    <Text
                        style={[textTheme.titleMedium, styles.checkoutButtonText]}>₹ {calculatedPrice.length === 0 ? 0 : calculatedPrice[0].total_price}</Text>
                    <Feather name="arrow-right-circle" size={24} color={Colors.white}/>
                </View>
            </PrimaryButton>
        </View>

    </View>
}

export default CheckoutSection;