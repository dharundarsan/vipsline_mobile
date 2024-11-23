import {View, Text, StyleSheet, FlatList} from 'react-native';
import textTheme from "../../constants/TextTheme";
import {SalesCard} from "./SalesCard";
import {useDispatch, useSelector} from "react-redux";
import ClientDetailsPagination from "./ClientDetailsPagination";
import React, {useEffect, useState} from "react";
import EntryModel from "./EntryModel";
import Colors from "../../constants/Colors";
import EntryBoxModal from "./EntryBoxModal";
import {loadAnalyticsClientDetailsFromDb, updatePageNo, updateSalesMaxEntry} from "../../store/clientInfoSlice";
import {checkNullUndefined} from "../../util/Helpers";


export default function BillingActivity(props) {
    const dispatch = useDispatch();


    const [isModalVisible, setIsModalVisible] = useState(false);

    const salesData = useSelector(state => state.clientInfo.analyticDetails);

    if(!checkNullUndefined(salesData)) {
        return <View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text style={textTheme.titleMedium}>Coming Soons</Text></View>
    }

    function radioButtonPressed(value) {
        dispatch(updateSalesMaxEntry(value));
    }


    useEffect(() => {
        dispatch(loadAnalyticsClientDetailsFromDb(props.clientId))
        dispatch(updateSalesMaxEntry(10));
        dispatch(updatePageNo(0));
    }, []);

    function renderItem(itemData) {
        return <SalesCard
            status={itemData.item.status}
            date={itemData.item.appointment_date}
            time={itemData.item.start_time}
            invoiceNumber={itemData.item.business_invoice_no}
            service={itemData.item.resource_service}
            total={itemData.item.price}
        />
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
            <Text style={[textTheme.titleMedium]}>Sales</Text>
        </View>
        <FlatList
            data={salesData.history_appointmentList}
            renderItem={renderItem}
            style={styles.flatList}
            contentContainerStyle={{gap: 16}}
            showsVerticalScrollIndicator={false}


        />


        {
            checkNullUndefined(salesData.history_appointment_count) && salesData.history_appointment_count > 10 &&
            <ClientDetailsPagination
                setIsModalVisible={setIsModalVisible}
                totalCount={salesData.history_appointment_count}
                clientId={props.clientId}
            />

        }

    </View>
}

const styles = StyleSheet.create({
    billingActivity: {
        flex:1,
        alignItems: 'center',
        width: '100%',
    },
    title: {
        marginTop: 16
    },
    flatList: {
        width: '100%',
        marginTop: 16
    }
})