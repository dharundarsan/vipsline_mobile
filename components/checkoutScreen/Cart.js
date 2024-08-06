import React, {useState} from 'react';
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
import {useSelector} from "react-redux";

const Cart = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const cartItems = useSelector((state) => state.cart.items);

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
            {cartItems.length === 0 ?
                <View style={styles.emptyCartContainer}>
                    <MaterialIcons style={styles.icon} name="add-shopping-cart" size={40} color={Colors.highlight}/>
                    <Text style={[TextTheme.titleMedium, styles.emptyCartText]}>Your cart is empty</Text>
                    <Text style={styles.selectServiceText}>Select an service or item to checkout</Text>
                    <PrimaryButton label="Add items to cart" buttonStyle={styles.addItemButton}
                                   onPress={openAddItemModal}/>
                </View> :
                <>
                    <View style={{flex: 1}}>
                        <FlatList fadingEdgeLength={50} style={{flexGrow: 0}} data={cartItems}
                                  keyExtractor={(item, index) => index}
                                  renderItem={({item}) => <CartItem data={item}/>}
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