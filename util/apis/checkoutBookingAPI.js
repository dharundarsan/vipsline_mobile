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
//         console.log(response.data.data);
//         console.log(cart)
//         console.log(clientId)
//         return Promise.resolve(response.data.data);
//
//     } catch (error) {
//     }
// }

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function checkoutBookingAPI(clientId, cart) {
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
            additional_discounts: [],
            additional_services: [],
            appointment_date: "2024-09-09",
            business_id: businessId,
            cart: cart.map(item => {
                return {
                    // ...item,
                    // item_id: undefined,
                    // resource_category_id: undefined,
                    // resource_category_name: undefined,
                    // price: undefined,
                    // discounted_price: undefined,
                    // business_name: undefined,
                    // total_price: undefined,
                    // parent_resource_category_id: undefined,
                    // parent_resource_category_name: undefined,
                    // service_discount: undefined,
                    //
                    id: item.item_id,
                    resource_id: item.resource_id,
                }
            }),
            coupon_code: "",
            covid_declaration: "true",
            device: "BUSINESS_WEB",
            editedPurchasedMemberShipId: [],
            edited_cart: [],
            endtime: "17:17:00",
            extra_charges: [],
            hasGST: false,
            home_service: false,
            isWalletSelected: false,
            is_direct_checkout: true,
            is_walkin_appt: false,
            memberShipIdPurchased: [],
            mobile_1: "",
            notes: "",
            prepaid_wallet: [],
            promo_code: "",
            sales_notes: "",
            starttime: "17:35:00",
            user_coupon: "",
            user_id: clientId,
            walkInUserId: clientId,
            walkin: "yes",
            wallet_amt: 0,
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error during checkoutBookingAPI call:", error);
        throw error; // Ensure that the error is propagated
    }
}
