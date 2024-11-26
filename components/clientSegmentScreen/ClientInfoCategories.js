import {View, Text, StyleSheet, FlatList} from 'react-native';
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import {Entypo} from "@expo/vector-icons";
import ItemCount from "../../ui/ItemCount";

/**
 * ClientInfoCategories Component
 *
 * This component renders a list of categories related to client information.
 * Each category is displayed as a button, which, when pressed, triggers an action
 * defined by the `onPress` function passed via props. The categories include options
 * like 'Client details', 'Bill activity', 'Appointments', and more, each with
 * optional dividers and message counts.
 *
 * Props:
 * @param {Function} onPress - Function to be called when a category is pressed.
 *
 * State:
 * None
 *
 * Data:
 * - `modalClientDetails`: An array of objects representing different client categories.
 *   - {string} id: Unique identifier for the category.
 *   - {string} title: Display name of the category.
 *   - {boolean} divider: Determines whether a top border is added.
 *   - {boolean} msg: Indicates if a message count should be displayed.
 *   - {number} count: The count to be displayed next to the category title if `msg` is true.
 *   - {number} thickness: The thickness of the top border if `divider` is true.
 *
 * Components:
 * - `PrimaryButton`: A customizable button component.
 * - `ItemCount`: A component that displays a count next to a category title.
 * - `FlatList`: A React Native component for efficiently rendering lists.
 *
 * Usage:
 * ```jsx
 * <ClientInfoCategories onPress={(id) => console.log(id)} />
 * ```
 */




const modalClientDetails = [
    {id: "clientDetails", title: "Client details", divider: false, msg: false, thickness: 1},
    // {id: "billActivity", title: "Bill activity", divider: true, msg: false, thickness: 1},
    // {id: "appointments", title: "Appointments", divider: true, msg: false, thickness: 1},
    // {id: "memberships", title: "Memberships", divider: true, msg: true, count: 0, thickness: 1},
    // {id: "packageSales", title: "Package sales", divider: true, msg: true, count: 0, thickness: 1},
    // {id: "prepaidSales", title: "Prepaid sales", divider: true, msg: true, count: 0, thickness: 1},
    // {id: "review", title: "Review", divider: true, msg: true, count: 0, thickness: 1},
    // {id: "giftVoucher", title: "Gift Voucher", divider: true, msg: true, count: 0, thickness: 1},
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
                    onPress={() => {
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
                                        <ItemCount count={itemData.item.count}/>
                                    </Text> :
                                    null
                            }

                        </View>
                        <Entypo name="chevron-small-right" size={24} color="black"/>
                    </View>
                </PrimaryButton>
            </>
        );
    }

    return (
        <View>
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