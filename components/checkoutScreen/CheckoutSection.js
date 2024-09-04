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
import {checkStaffOnCartItems, loadCartFromDB} from "../../store/cartSlice";
import DropdownModal from "../../ui/DropdownModal";
import MiniActionTextModal from "./MiniActionTextModal";
import DeleteClient from "../clientSegmentScreen/DeleteClientModal";
import {loadClientInfoFromDb} from "../../store/clientInfoSlice";
import Cart from "./Cart";
import calculateCartPriceAPI from "../../util/apis/calculateCartPriceAPI";
import clearCartAPI from "../../util/apis/clearCartAPI";


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
        },
        primaryViewChildrenStyle: {
            flexDirection: "row",
            alignItems: "center"
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ActionModal,setActionModal] = useState(false);
    const [title, setTitle] = useState("")
    const [isDelete, setIsDelete] = useState(false);
    const [discountValue, setDiscountValue] = useState("");
    const [selectedDiscountMode, setSelectedDiscountMode] = useState("percentage")
    const [clickedValue, setClickedValue] = useState("")
    const [data, setData] = useState([{}])
    const cartItems = useSelector((state) => state.cart.items);
    const editedItems = useSelector((state) => state.cart.editedItems);
    const [salesnote, setSalesnote] = useState("");

    function openModal(title,value){
        setTitle(title);
        setClickedValue(value);
    }
    async function addDiscount(discountMode,type){
        const addDiscount = {
            name:"Custom Discount",
            type:discountMode,
            amount:discountValue
        }
        console.log(addDiscount);
        await calculateCartPriceAPI({
            additional_discounts: type === "clear" ? [] : [addDiscount],
            additional_services: props.customItems,
            cart: cartItems.length === 0 ? [] : cartItems.map(item => {
                return {id: item.item_id}
            }),
            coupon_code: "",
            edited_cart: editedItems.map(item => {
                return {
                    amount:item.price,
                    bonus_value: 0,
                    disc_value: 0,
                    itemId: item.item_id,
                    membership_id: item.id,
                    membership_number: "",
                    res_cat_id: 282773,
                    resource_id: item.resource_id,
                    type: "AMOUNT",
                    valid_from: item.valid_from,
                    valid_till: item.valid_until,
                    wallet_amount: 0,
                }
            }),
            extra_charges: [],
            isWalletSelected: false,
            promo_code: "",
            user_coupon: "",
            walkin: "yes",
            wallet_amt: 0
        }).then(result => {
            props.setCalculatedPrice(result);
        })
        setActionModal(false);
    }
    return <View style={styles.checkoutSection}>
        <PaymentModal isVisible={isPaymentModalVisible} onCloseModal={() => {
            setIsPaymentModalVisible(false)
        }} price={ props.data !== null ? props.data[0].total_price : 0}/>
        {
            ActionModal && <MiniActionTextModal isVisible={ActionModal}
                onCloseModal={()=>{setActionModal(false)}}
                title={title}
                clickedValue={clickedValue}
                data={data}
                setDiscountValue={setDiscountValue}
                discountValue={discountValue}
                onChangeValue={setSalesnote}
                addDiscount={addDiscount}
            />
        }
        {
            isDelete && <DeleteClient
                isVisible={isDelete}
                onCloseModal={() => {
                    setIsDelete(false)
                    // setModalVisibility(false);
                    // console.log("Fetched")
                    // dispatch(loadClientInfoFromDb(props.id))
                }}
                header={"Cancel Sale"}
                content={"If you cancel this sale transaction will not be processed. Do you wish to exit?"}
                onCloseClientInfoAfterDeleted={async () => {
                    // props.setVisible(false);
                    // props.setSearchQuery("");
                    // props.setFilterPressed("all_clients_count");
                    await clearCartAPI(process.env.EXPO_PUBLIC_BUSINESS_ID)
                    dispatch(loadCartFromDB());
                }}
            />
        }
        {
            isModalOpen ?
                <DropdownModal
                    isVisible={isModalOpen}
                    onCloseModal={() => {
                        setIsModalOpen(false)
                    }}
                    dropdownItems={[
                        "Apply Discount",
                        "Add Charges",
                        "Add Sales Notes",
                        "Cancel Sales"
                    ]}
                    onChangeValue={(value) => {
                        console.log(value)
                        if (value === "Apply Discount") {
                            openModal("Add Discount",value)
                            setData([{
                                header:"Enter Discount",
                                boxType:"textBox",
                                typeToggle:1,
                                keyboardType:"number-pad",
                                selectedDiscountMode:selectedDiscountMode,
                                setSelectedDiscountMode:setSelectedDiscountMode
                            }])
                            setActionModal(true)
                        } else if (value === "Add Charges") {
                            openModal("Add extra charges",value)
                            setData([
                            {
                                header:"Item name",
                                boxType:"textBox",
                                typeToggle:0,
                                keyboardType:"number-pad",
                            },
                            {
                                header:"Price",
                                boxType:"priceBox",
                                typeToggle:0,
                                keyboardType:"number-pad"
                            }
                        ])
                            setActionModal(true)
                        } else if (value === "Add Sales Notes") {
                            openModal("Add a note",value)
                            setData([{
                                header:"Sales notes",
                                boxType:"multiLineBox",
                                typeToggle:0,
                            }])
                            setActionModal(true)
                        } else if (value === "Cancel Sales") {
                            setIsDelete(true);
                        }
                    }}
                    iconImage={[
                        require("../../assets/icons/checkout/actionmenu/applydiscount.png"),
                        require("../../assets/icons/checkout/actionmenu/addcharges.png"),
                        require("../../assets/icons/checkout/actionmenu/salesnote.png"),
                        require("../../assets/icons/checkout/actionmenu/cancelsale.png")
                    ]}
                    primaryViewChildrenStyle={styles.primaryViewChildrenStyle}
                    imageWidth={25}
                    imageHeight={25}
                />

                :
                <>
                    <PaymentModal isVisible={isPaymentModalVisible} onCloseModal={() => {
                        setIsPaymentModalVisible(false)
                    }}
                                  price={props.data[0].total_price}/>
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
                    <View style={styles.buttonContainer}>
                        <PrimaryButton buttonStyle={styles.optionButton} onPress={() => setIsModalOpen(true)}>
                            <Entypo name="dots-three-horizontal" size={24} color="black"/>
                        </PrimaryButton>
                        <PrimaryButton buttonStyle={styles.checkoutButton}
                                       pressableStyle={styles.checkoutButtonPressable}
                                       onPress={() => {
                                           setIsPaymentModalVisible(true)
                                       }}>
                            <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>Total Amount</Text>
                            <View style={styles.checkoutButtonAmountAndArrowContainer}>
                                <Text
                                    style={[textTheme.titleMedium, styles.checkoutButtonText]}>₹ {props.data[0].total_price}</Text>
                                <Feather name="arrow-right-circle" size={24} color={Colors.white}/>
                            </View>
                        </PrimaryButton>
                    </View>
                </>
        }
    </View>
}


export default CheckoutSection;