import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError, formatDate} from "../../util/Helpers";

const appointmentForExistingBookingAPI = async (clientDetails, cartSliceState, prepaidStatus, prepaidAmount, splitUpState, cartGroupingId, cartBookingId) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + '/appointment/createAddtAppointmentForExistingBooking', {
            COD: 1,
            additional_discounts: cartSliceState.additionalDiscounts,
            additional_services: cartSliceState.customItems.map(customItem => {
                return {
                    "amount": customItem.price,
                    "id": customItem.id,
                    "name": customItem.name,
                    "resource_id": customItem.resource_id
                }
            }),
            client_membership_id: cartSliceState.clientMembershipID,
            grouping_id: cartGroupingId,
            appointment_date: formatDate(cartSliceState.appointment_date, "yyyy-mm-dd"),
            business_id: await SecureStore.getItemAsync('businessId'),
            booking_id: cartBookingId,
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
            device: "BUSINESS_WEB",
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
                            membership_number: item.membership_number,
                            res_cat_id: originalData.resource_category_id,
                            resource_id: originalData.resource_id,
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
                            type: item.type,
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
                            resource_id: cartSliceState.prepaid_wallet[0].resource_id,
                            type: "AMOUNT",
                            valid_from: "",
                            valid_till: "",
                            wallet_amount: item.wallet_amount,
                            wallet_description: item.wallet_description
                        }
                    else
                        return {
                            "amount": item.amount,
                            "bonus_value": 0,
                            "disc_value": item.disc_value,
                            "itemId": item.item_id,
                            "membership_id": 0,
                            "res_cat_id": item.res_cat_id,
                            "resource_id": item.resource_id,
                            "type": item.type,
                            "valid_from": "",
                            "valid_till": "",
                            "wallet_amount": 0
                        }
                })
            ],
            // endtime: new Date().toLocaleTimeString('en-GB', {
            //     hour: '2-digit',
            //     minute: '2-digit',
            //     second: '2-digit',
            //     hour12: false
            // }),
            endtime: "14:26:00",
            extra_charges: cartSliceState.chargesData[0].amount === 0 ? [] : cartSliceState.chargesData,
            hasGST: false,
            home_service: false,
            isWalletSelected: prepaidStatus === undefined ? false : prepaidStatus,
            is_direct_checkout: false,
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
            // starttime: new Date().toLocaleTimeString('en-GB', {
            //     hour: '2-digit',
            //     minute: '2-digit',
            //     second: '2-digit',
            //     hour12: false
            // }),
            starttime: "13:56:00",
            user_coupon: "",
            user_id: clientDetails.id,
            walkInUserId: clientDetails.id,
            walkin: "yes",
            wallet_amt: prepaidAmount === undefined ? 0 : prepaidAmount,
            isRewardSelected: cartSliceState.rewardAllocated.isRewardSelected,
            redeemed_points: cartSliceState.rewardAllocated.rewardPoints,
            reward_amt: cartSliceState.rewardAllocated.rewardAmount,
            splitPaymentMap: splitUpState.reduce((acc, item) => {
                return item.amount ? acc + 1 : acc;
            }, 0) !== 0 ? splitUpState.filter(state => state.shown).map(state => ({
                mode_of_payment: state.mode.toUpperCase(),
                amount: state.amount
            })) : [],
        }, {
            headers: {
                Authorization: `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        });

        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Appointment for existing booking API")
        throw e.response;
    }
}

export default appointmentForExistingBookingAPI;