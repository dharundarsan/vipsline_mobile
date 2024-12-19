import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../Helpers";
import moment from "moment";

const getLeadsAPI = async (pageNo, pageSize, search_term, advancedFilters,) => {
    console.log("advancedFilters");
    console.log(advancedFilters);
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/leads/getLeadsByBusiness?pageNo=" + pageNo + "&pageSize=" + pageSize, {
            business_id: await SecureStore.getItemAsync('businessId'),
            search_term,
            followupDate: advancedFilters?.followupDate === undefined ? undefined : moment(advancedFilters?.followupDate).format("YYYY-MM-DD"),
            followupEndDate: advancedFilters?.followupEndDate === undefined ? undefined : moment(advancedFilters?.followupEndDate).format("YYYY-MM-DD"),
            fromDate: advancedFilters?.fromDate === undefined ? undefined : moment(advancedFilters?.fromDate).format("YYYY-MM-DD"),
            toDate: advancedFilters?.toDate === undefined ? undefined : moment(advancedFilters?.toDate).format("YYYY-MM-DD"),
            gender: advancedFilters?.gender,
            leadFollowUp: advancedFilters?.leadFollowUp,
            lead_campaign_source_id: advancedFilters?.lead_campaign?.lead_campaign_source_id,
            lead_owner: advancedFilters?.lead_owner?.id,
            lead_source: advancedFilters?.lead_source?.id,
            lead_status: advancedFilters?.lead_status,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error(e)
        console.error("Error: Get Leads API")
    }
}

export default getLeadsAPI;