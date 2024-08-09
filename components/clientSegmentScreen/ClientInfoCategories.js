import {View, Text, StyleSheet, FlatList} from 'react-native';
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import {Entypo} from "@expo/vector-icons";
import ItemCount from "../../ui/ItemCount";


const modalClientDetails = [
    {id: "clientDetails", title: "Client details", divider: false, msg: false, thickness: 1},
    {id: "billActivity", title: "Bill activity", divider: true, msg: false, thickness: 1},
    {id: "appointments", title: "Appointments", divider: true, msg: false, thickness: 1},
    {id: "memberships", title: "Memberships", divider: true, msg: true, count: 16, thickness: 1},
    {id: "packageSales", title: "Package sales", divider: true, msg: true, count: 0, thickness: 1},
    {id: "prepaidSales", title: "Prepaid sales", divider: true, msg: true, count: 0, thickness: 1},
    {id: "review", title: "Review", divider: true, msg: true, count: 0, thickness: 1},
    {id: "giftVoucher", title: "Gift Voucher", divider: true, msg: true, count: 0, thickness: 1},
];


export default function ClientInfoCategories(props) {
    function renderItem(itemData) {
        return (
            <>
            <PrimaryButton
                buttonStyle={[
                    styles.button,
                    {
                        borderTopWidth: itemData.item.divider ?
                            itemData.item.thickness :
                            null,
                        borderTopColor: Colors.grey250
                    }
                    ]}
                pressableStyle={styles.pressableStyle}
                onPress={ () => {
                    props.onPress(itemData.item.id)
                }}
            >
                <View style={styles.innerContainer}>
                    <View style={{flexDirection: "row", alignItems: "center",}}>
                        <Text style={[TextTheme.labelLarge]}>
                            {itemData.item.title}
                        </Text>
                        {
                            itemData.item.msg ?
                                <Text style={{marginHorizontal: 16}}>
                                    <ItemCount count={itemData.item.count} />
                                </Text> :
                                null
                        }

                    </View>
                    <Entypo name="chevron-small-right" size={24} color="black" />
                </View>
            </PrimaryButton>
            </>
        );
    }

    return (
        <View >
            <FlatList
                data={modalClientDetails}
                renderItem={renderItem}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "95%",
        justifyContent: 'space-between',
        marginVertical: 8
    },
    button: {
        backgroundColor: Colors.white,
        borderRadius: 0,
    },
    pressableStyle: {
        overflow: 'hidden'
    }

})