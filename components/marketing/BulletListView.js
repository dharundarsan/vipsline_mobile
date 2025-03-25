import {FlatList, View, StyleSheet, Text} from "react-native";
import Colors from "../../constants/Colors";
import CustomTextInput from "../../ui/CustomTextInput";
import textTheme from "../../constants/TextTheme";

export default function BulletListView(props)  {
    function renderItem({item}) {
        return (<View style={styles.item}>
            <View style={styles.bullet}/>
            <Text style={[textTheme.bodyMedium, {flex: 1}]}>{item}</Text>
        </View>)
    }

    return (<FlatList
            data={props.data}
            renderItem={renderItem}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: Colors.black,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,

    }
})