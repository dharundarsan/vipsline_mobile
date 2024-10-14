import {Modal, View, StyleSheet, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import CustomDropdown from "../../ui/CustomDropdown";

export default function AdvancedFilters(props) {
    return <Modal style={{flex: 1}} visible={props.isVisible} animationType={"slide"}>
           <View style={styles.advancedFilters}>
               <View style={styles.header}>
                   <Text style={[textTheme.titleLarge, styles.headerText]}>
                       Filters
                   </Text>
                   <PrimaryButton
                       buttonStyle={styles.closeButton}
                       pressableStyle={styles.closeButtonPressable}
                       onPress={() => {
                           props.onClose();
                       }}
                   >
                       <Ionicons name="close" size={25} color="black" />
                   </PrimaryButton>
               </View>
               <View>
                   <Text style={[textTheme.titleMedium, styles.advancedFiltersText]}>
                       Advanced Filters
                   </Text>
                   <CustomDropdown
                       options={['Female client', 'Male client', 'Membership', 'Non-Membership', 'New client']}
                       highlightColor={Colors.highlight}
                       container={styles.dropdownContainer}
                       borderColor={Colors.grey250}
                       checkBoxSize={30}
                   />
               </View>
           </View>
    </Modal>;
}

const styles = StyleSheet.create({
    advancedFilters: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
        backgroundColor: Colors.grey150,
        justifyContent: 'center'

    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.grey150,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    headerText: {
        paddingVertical: 12
    },
    advancedFiltersText: {
        marginLeft: 16
    },
    dropdownContainer: {
        paddingHorizontal: 16,
        marginTop: 16
    }
})