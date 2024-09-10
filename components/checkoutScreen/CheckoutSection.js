import {
    KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View
} from "react-native";
import { DataTable } from "react-native-paper";
import Divider from "../../ui/Divider";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Keyboard } from "react-native";
import { useState, useEffect, useRef } from "react";
import PaymentModal from "./PaymentModal";
import Popover from "react-native-popover-view";
import { loadWalletPriceFromDb } from "../../store/invoiceSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    checkStaffOnCartItems, clearCalculatedPrice,
    clearLocalCart,
    clearSalesNotes,
    loadCartFromDB,
    setCalculatedPrice,
    updateCalculatedPrice
} from "../../store/cartSlice";
import DropdownModal from "../../ui/DropdownModal";
import MiniActionTextModal from "./MiniActionTextModal";
import DeleteClient from "../clientSegmentScreen/DeleteClientModal";
import calculateCartPriceAPI from "../../util/apis/calculateCartPriceAPI";
import clearCartAPI from "../../util/apis/clearCartAPI";
import {updateChargeData, updateDiscount,updateSalesNotes} from "../../store/cartSlice";
import {checkNullUndefined} from "../../util/Helpers";
import {loadBusinessesListFromDb} from "../../store/listOfBusinessSlice";
import { updateTotalClientCount } from "../../store/clientFilterSlice";
import {clearClientInfo} from "../../store/clientInfoSlice";



const CheckoutSection = (props) => {
    const tot = useSelector(state => state.cart.calculatedPrice);
            // const totalChargeAmount = useSelector(state => state.cart.calculatedPrice[0]?.extra_charges_value);
    const totalChargeAmount = tot === undefined || tot === null ? 0 : tot[0].extra_charges_value;
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
        }, checkoutDetailRow: {
            flexDirection: "row",
            justifyContent: "space-around",
            borderBottomWidth: 1,
            borderBottomColor: Colors.grey600,
            borderStyle: "dashed",
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
    const [selectedDiscountMode, setSelectedDiscountMode] = useState("percentage")
    const [clickedValue, setClickedValue] = useState("")
    const cartItems = useSelector((state) => state.cart.items);
    const editedCart = useSelector((state) => state.cart.editedCart);
    const [salesnote, setSalesnote] = useState("");
    const [chargesInputData, setChargesInputData] = useState([{ index: 0 }]);
    const [data, setData] = useState([{}])

    function openModal(title, value) {
        setTitle(title);
        setClickedValue(value);
    }
    console.log("calculatedPrice " + calculatedPrice);
    

    const checkoutDiscount = useSelector(state => state.checkoutAction.additionalDiscounts)
    const checkoutCharges = useSelector(state => state.checkoutAction.chargesData);

    async function addDiscount(discountMode, type) {
        const addDiscount = {
            name: "Custom Discount", type: discountMode, amount: discountValue
        }

        if (type === "clear") {
            dispatch(updateDiscount([]));  // Clear the discounts
        } else {
            dispatch(updateDiscount(addDiscount));  // Overwrite with the new discount
        }
        dispatch(updateCalculatedPrice());

        setActionModal(false);
    }

    async function addCharges() {
        if(calculatedPrice[0]){
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
        console.log(1);
        
        setChargesInputData([{index:0}])
        console.log(2);
        dispatch(updateChargeData([{index:0,name: "",amount: 0,}]));
        console.log(3);
        dispatch(updateCalculatedPrice());
        console.log(4);
        setActionModal(false);
    }

    return <View style={styles.checkoutSection}>


        {ActionModal && <MiniActionTextModal isVisible={ActionModal}
                                             onCloseModal={() => {
                                                 setActionModal(false)
                                             }}
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
                                             clearCharges = {clearCharges}
        />}
        {isDelete && <DeleteClient
            isVisible={isDelete}
            onCloseModal={() => {
                setIsDelete(false)
                // setModalVisibility(false);
                                // dispatch(loadClientInfoFromDb(props.id))
            }}
            header={"Cancel Sale"}
            content={"If you cancel this sale transaction will not be processed. Do you wish to exit?"}
            onCloseClientInfoAfterDeleted={async () => {
                // props.setVisible(false);
                // props.setSearchQuery("");
                // props.setFilterPressed("all_clients_count");
                clearCartAPI();
                dispatch(clearSalesNotes());
                dispatch(clearLocalCart());
                dispatch(clearClientInfo());
                dispatch(clearCalculatedPrice())
            }}
        />}
        {isModalOpen ? <DropdownModal
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
        /> :
            <>
                <PaymentModal isVisible={isPaymentModalVisible} onCloseModal={() => {
                    setIsPaymentModalVisible(false)
                }}
                    price={calculatedPrice.length === 0 ? 0 : calculatedPrice[0].total_price} />
                <View style={styles.checkoutDetailRow}>
                    {/*<Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Discount</Text>*/}
                    {/*<Text*/}
                    {/*    style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ { calculatedPrice.length !== 0 ? calculatedPrice[0].total_discount_in_price : 0}</Text>*/}
                    <View>
                        <Popover popoverStyle={styles.popoverStyle}
                            from={<Pressable style={styles.checkoutDetailInnerContainer}>
                                <Text
                                    style={[textTheme.titleMedium, styles.checkoutDetailText]}>Discount</Text>
                                <MaterialCommunityIcons name="information-outline" size={24}
                                    color="black" />
                            </Pressable>}
                            offset={Platform.OS === "ios" ? 0 : 32}
                        >
                            {discountCategory.service !== "0" ?
                                <Text>Service Discount: ₹{discountCategory.service}</Text> : null}
                            {discountCategory.product !== "0" ?
                                <Text>Product Discount: ₹{discountCategory.product}</Text> : null}
                            {discountCategory.package !== "0" ?
                                <Text>Package Discount: ₹{discountCategory.package}</Text> : null}
                            {discountCategory.service === "0" && discountCategory.product === "0" && discountCategory.package === "0" ?
                                <Text>No discounts applied</Text> : null}
                        </Popover>
                    </View>

                    <Text
                        style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {calculatedPrice.length === 0 ? 0 : calculatedPrice[0].total_discount_in_price}</Text>
                </View>

                <View style={styles.checkoutDetailRow}>
                    <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Sub Total</Text>
                    <Text
                        style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {calculatedPrice.length !== 0 ? calculatedPrice[0].total_price_after_discount : 0}</Text>
                </View>
                <View style={styles.checkoutDetailRow}>
                    <View>
                        <Popover popoverStyle={styles.popoverStyle}
                            from={<Pressable style={styles.checkoutDetailInnerContainer}>
                                <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>GST
                                    (18%)</Text>
                                <MaterialCommunityIcons name="information-outline" size={24} color="black" />
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
                    </View>
                    <Text
                        style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {calculatedPrice.length === 0 ? 0 : calculatedPrice[0].gst_charges}</Text>
                </View>
                <View style={styles.checkoutDetailRow}>
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
                                             <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Charges</Text>
                                             <MaterialCommunityIcons name="information-outline" size={24} color="black"/>
                                         </Pressable>)
                                     }
                                     offset={Platform.OS === "ios" ? 0 : 32}
                            >
                                {

                                    chargesAmount.map((item, index) => {
                                        return(
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
                </View>
                <View style={styles.buttonContainer}>
                    <PrimaryButton buttonStyle={styles.optionButton} onPress={() => setIsModalOpen(true)}>
                        <Entypo name="dots-three-horizontal" size={24} color="black" />
                    </PrimaryButton>
                    <PrimaryButton buttonStyle={styles.checkoutButton}
                        pressableStyle={styles.checkoutButtonPressable}
                        onPress={() => {
                            if (!clientInfo.isClientSelected) {
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
                                style={[textTheme.titleMedium, styles.checkoutButtonText]}>₹ {calculatedPrice.length === 0 ? 0 : calculatedPrice[0].total_price}</Text>
                            <Feather name="arrow-right-circle" size={24} color={Colors.white} />
                        </View>
                    </PrimaryButton>
                </View>
            </>
        }
    </View>
}

export default CheckoutSection;