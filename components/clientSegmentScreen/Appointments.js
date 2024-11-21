import {View, Text, StyleSheet, FlatList} from 'react-native';
import textTheme from "../../constants/TextTheme";
import {AppointmentsCard} from "./AppointementsCard";
import {SalesCard} from "./SalesCard";
import Pagination from "./Pagination";
import React, {useEffect, useState} from "react";
import ClientDetailsPagination from "./ClientDetailsPagination";
import EntryModel from "./EntryModel";
import {loadAnalyticsClientDetailsFromDb, updatePageNo, updateSalesMaxEntry} from "../../store/clientInfoSlice";
import {useDispatch, useSelector} from "react-redux";
import EntryBoxModal from "./EntryBoxModal";
import {checkNullUndefined} from "../../util/Helpers";



export default function Appointments(props) {





    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const salesData = useSelector(state => state.clientInfo.analyticDetails);
    const details = useSelector(state => state.clientInfo.details);

    if(!checkNullUndefined(salesData)) {
        return <View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text style={textTheme.titleMedium}>Coming Soons</Text></View>
    }

    function renderItem(itemData) {
        return <AppointmentsCard
            status={itemData.item.status}
            date={itemData.item.appointment_date}
            time={itemData.item.start_time}
            invoiceNumber={itemData.item.business_invoice_no}
            service={itemData.item.resource_service}
            total={itemData.item.price}
            staffName={itemData.item.staff_name}
            duration={itemData.item.duration}
        />
    }



    useEffect(() => {
        dispatch(loadAnalyticsClientDetailsFromDb(props.clientid))
        dispatch(updateSalesMaxEntry(10));
        dispatch(updatePageNo(0));
    }, []);

    function radioButtonPressed(value) {
        dispatch(updateSalesMaxEntry(value));
    }



    return <View style={styles.billingActivity}>
        {

            isModalVisible &&
            <EntryBoxModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                radioButtomPressed={radioButtonPressed}
            />

        }
        <View style={styles.title}>
            <Text style={[textTheme.titleMedium]}>Appointments</Text>
        </View>

        <FlatList
            data={salesData.upcoming_appointmentList}
            renderItem={renderItem}
            style={styles.flatList}
            contentContainerStyle={{gap: 16}}
            showsVerticalScrollIndicator={false}
        />

        {
            checkNullUndefined(salesData.upcoming_appointmentList.length) && salesData.upcoming_appointmentList.length > 10 &&
            <ClientDetailsPagination
                setIsModalVisible={setIsModalVisible}
                totalCount={checkNullUndefined(salesData.upcoming_appointmentList.length) ? salesData.upcoming_appointmentList.length : 0}
                clientId={props.clientid}
            />
        }



    </View>
}

const styles = StyleSheet.create({
    billingActivity: {
        flex:1,
        alignItems: 'center',
        width: '100%'
    },
    title: {
        marginTop: 16
    },
    flatList: {
        width: '100%',
        marginTop: 16
    }
})