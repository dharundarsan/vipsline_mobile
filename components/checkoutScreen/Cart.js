import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList
} from "react-native";
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import TextTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import AddItemModal from "./AddItemModal";
import CartItem from "./CartItem";
import CheckoutSection from "./CheckoutSection";
import {useDispatch, useSelector} from "react-redux";
import calculateCartPriceAPI from "../../util/apis/calculateCartPriceAPI";
import { updateDiscount } from '../../store/cartSlice';

const Cart = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const cartItems = useSelector((state) => state.cart.items);
    const editedCart = useSelector((state) => state.cart.editedCart);
    const staffs = useSelector((state) => state.staff.staffs);
    // const [customItems, setCustomItems] = useState([]);
    // const [calculatedPrice, setCalculatedPrice] = useState([]);
    const dispatch = useDispatch()
    const customItems = useSelector(state => state.cart.customItems)
    // useEffect(() => {
    //     if (cartItems.length === 0 && editedMembership.length === 0 && customItems.length === 0 && editedCart.length === 0) {
    //         setCalculatedPrice([]);
    //     }
    //
    //     if (editedCart.length > 1) return;
    //

    //     calculateCartPriceAPI({
    //         additional_discounts: [],
    //         additional_services: customItems,
    //         cart: cartItems.length === 0 ? [] : cartItems.map(item => {
    //             return {id: item.item_id}
    //         }),
    //         coupon_code: "",
    //         edited_cart: [...editedMembership.map(item => {
    //             return {
    //                 amount: item.price,
    //                 bonus_value: 0,
    //                 disc_value: 0,
    //                 itemId: item.item_id,
    //                 membership_id: item.id,
    //                 membership_number: "",
    //                 res_cat_id:  282773,
    //                 resource_id: item.resource_id,
    //                 type: "AMOUNT",
    //                 valid_from: item.valid_from,
    //                 valid_till: item.valid_until,
    //                 wallet_amount: 0,
    //             }
    //         }),
    //             ...editedCart.map(item => ({
    //                 amount: item.amount,
    //                 bonus_value: 0,
    //                 disc_value: item.disc_value,
    //                 itemId: item.item_id,
    //                 membership_id: 0,
    //                 res_cat_id: item.resource_category_id,
    //                 resource_id: item.resource_id,
    //                 type: "AMOUNT",
    //                 valid_from: "",
    //                 valid_till: "",
    //                 wallet_amount: 0,
    //             }))],
    //         extra_charges: [],
    //         isWalletSelected: false,
    //         promo_code: "",
    //         user_coupon: "",
    //         walkin: "yes",
    //         wallet_amt: 0
    //     }).then(result => {
    //         setCalculatedPrice(result);
    //     })
    //
    // }, [customItems, editedMembership, editedCart, cartItems]);

    const openAddItemModal = () => {
        setIsModalVisible(true);
    }

    const closeAddItemModal = () => {
        setIsModalVisible(false);
    }

    const styles = StyleSheet.create({
        cart: {
            flex: 1,
        },
        icon: {},
        cartItemScrollView: {
            flex: 1,
        },
        emptyCartContainer: {
            flex: 0.6,
            justifyContent: "center",
            alignItems: "center",
        },
        emptyCartText: {marginTop: 5},
        selectServiceText: {},
        addItemButton: {marginTop: 15},
        modalOverlay: {
            flex: 1,
        },
        modalContainer: {
            marginTop: (Dimensions.get("screen").height - Dimensions.get("window").height + 9),
            flex: 1,
            backgroundColor: Colors.background,
            width: '100%',
            overflow: 'hidden',
        },
        addItemsWithLogoButton: {
            marginTop: 5,
            marginBottom: 5,
            alignSelf: "flex-start",
            backgroundColor: Colors.transparent,
        },
        addItemsWithLogoContainer: {
            flexDirection: "row",
            gap: 10,
        },
        addItemWithLogo_text: {
            color: Colors.highlight
        },
        closeContainer: {},
        closeIcon: {}
    });

    return (
        <View style={styles.cart}>
            <AddItemModal visible={isModalVisible} closeModal={closeAddItemModal} openModal={openAddItemModal}/>
            {cartItems.length === 0 && customItems.length === 0 && editedCart.length === 0 ?
                <View style={styles.emptyCartContainer}>
                    <MaterialIcons style={styles.icon} name="add-shopping-cart" size={40} color={Colors.highlight}/>
                    <Text style={[TextTheme.titleMedium, styles.emptyCartText]}>Your cart is empty</Text>
                    <Text style={styles.selectServiceText}>Select an service or item to checkout</Text>
                    <PrimaryButton label="Add items to cart" buttonStyle={styles.addItemButton}
                                   onPress={openAddItemModal}/>
                </View> :
                <>
                    <View style={{flex: 1}}>
                        <FlatList fadingEdgeLength={50} style={{flexGrow: 0}}
                                  data={[...cartItems, ...customItems]}
                                  keyExtractor={(item, index) => {
                                      return item.item_id
                                  }}
                                  renderItem={({item}) => <CartItem staffs={staffs} data={item}/>}
                        />
                        <PrimaryButton buttonStyle={styles.addItemsWithLogoButton} onPress={openAddItemModal}>
                            <View style={styles.addItemsWithLogoContainer}>
                                <Text style={[TextTheme.titleMedium, styles.addItemWithLogo_text]}>Add items to
                                    cart</Text>
                                <MaterialIcons name="add-circle-outline" size={24} color={Colors.highlight}/>
                            </View>
                        </PrimaryButton>
                    </View>
                    <CheckoutSection/>
                </>
            }
        </View>
    );
}

export default Cart;
