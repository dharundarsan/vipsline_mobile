// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
//
// export default async function checkoutBookingAPI(clientId, cart) {
//     let authToken = ""
//     try {
//         const value = await AsyncStorage.getItem('authKey');
//         if (value !== null) {
//             authToken = value;
//         }
//     } catch (e) {
//         console.log("auth token fetching error. (inside calculateCartPriceAPI)" + e);
//     }
//
//
//     let businessId = ""
//     try {
//         const value = await AsyncStorage.getItem('businessId');
//         if (value !== null) {
//             businessId = value;
//         }
//     } catch (e) {
//         console.log("businessId fetching error. (inside calculateCartPriceAPI)" + e);
//         throw e;
//     }
//
//     try {
//
//         const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + '/appointment/checkoutBooking', {}, {
//             headers: {
//                 Authorization: `Bearer ${authToken}`
//             }
//         })
//                   return Promise.resolve(response.data.data);
//
//     } catch (error) {
//     }
// }

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSelector} from "react-redux";
import {formatDate} from "../Helpers";
import {ToastAndroid} from "react-native";

export default async function checkoutBookingAPI(clientDetails, cartSliceState, prepaidStatus, prepaidAmount) {
    let authToken = "";
    let businessId = "";

    try {
        authToken = await AsyncStorage.getItem('authKey') || "";
        businessId = await AsyncStorage.getItem('businessId') || "";
    } catch (e) {
        console.error("Error fetching from AsyncStorage:", e);
        throw e; // Ensure that the error is propagated
    }

    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + '/appointment/checkoutBooking', {
            COD: 1,
            additional_discounts: cartSliceState.additionalDiscounts,
            additional_services: cartSliceState.customItems,
            client_membership_id: cartSliceState.client_membership_id,
            appointment_date: formatDate(Date.now(), "yyyy-mm-dd"),
            business_id: businessId,
            cart: cartSliceState.items
            .filter(item => {
                    if (item.gender === "membership") {
                        if (cartSliceState.editedCart.length === 0) return true;
                        else {
                            return !cartSliceState.editedCart.some(editedShips => item.membership_id === editedShips.id)
                        }
                    } else {
                        return !cartSliceState.editedCart.some(edited =>
                            item.item_id === edited.item_id
                        )
                    }
                }
            )
            .map(item => {
                return {id: item.item_id, resource_id: item.resource_id};
            }),
            coupon_code: "",
            covid_declaration: "true",
            device: "BUSINESS_MOBILE",
            editedPurchasedMemberShipId: [],
            edited_cart: [
                ...cartSliceState.editedCart.map(item => {
                    if (item.gender === "membership") {
                        const originalData = cartSliceState.items.filter(ele => ele.membership_id === item.id)[0];
                        return {
                            amount: item.price,
                            bonus_value: 0,
                            disc_value: 0,
                            itemId: originalData.item_id,
                            membership_id: item.id,
                            membership_number: "",
                            res_cat_id: originalData.resource_category_id,
                            resource_id: item.resource_id,
                            type: "AMOUNT",
                            valid_from: item.valid_from,
                            valid_till: item.valid_until,
                            wallet_amount: 0,
                        }
                    } else if (item.gender === "Products")
                        return {
                            amount: item.amount,
                            bonus_value: 0,
                            disc_value: item.disc_value,
                            itemId: item.item_id,
                            membership_id: 0,
                            product_id: item.product_id,
                            resource_id: item.resource_id,
                            type: "AMOUNT",
                            valid_from: "",
                            valid_till: "",
                            wallet_amount: 0,
                        }
                    else if (item.gender === "prepaid")
                        return {
                            amount: 0,
                            bonus_value: item.wallet_bonus,
                            disc_value: 0,
                            itemId: item.item_id,
                            membership_id: 0,
                            resource_id: item.resource_id,
                            type: "AMOUNT",
                            valid_from: "",
                            valid_till: "",
                            wallet_amount: item.wallet_amount,
                            wallet_description: item.wallet_description
                        }
                    else
                        return item
                })
            ],
            endtime: new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }),
            extra_charges: cartSliceState.chargesData[0].amount === 0 ? [] : cartSliceState.chargesData,
            hasGST: false,
            home_service: false,
            isWalletSelected: prepaidStatus === undefined ? false : prepaidStatus,
            is_direct_checkout: true,
            is_walkin_appt: false,
            memberShipIdPurchased: [],
            mobile_1: "",
            notes: "",
            prepaid_wallet: cartSliceState.prepaid_wallet[0].wallet_amount !== "" ? [{
                ...cartSliceState.prepaid_wallet[0],
                mobile: clientDetails.mobile_1,
            }] : [],
            promo_code: "",
            sales_notes: cartSliceState.salesNotes,
            starttime: new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }),
            user_coupon: "",
            user_id: clientDetails.id,
            walkInUserId: clientDetails.id,
            walkin: "yes",
            wallet_amt: prepaidAmount === undefined ? 0 : prepaidAmount,

        }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        if (response.data.other_message) {
            ToastAndroid.show(response.data.other_message, ToastAndroid.SHORT);
        }
        return response.data;
    } catch (error) {
        console.error("Error during checkoutBookingAPI call:", error);
        throw error; // Ensure that the error is propagated
    }
}
