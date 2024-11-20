import {Modal, View, StyleSheet, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import CustomDropdown from "../../ui/CustomDropdown";
import CustomTextInput from "../../ui/CustomTextInput";

export default function AdvancedFilters(props) {
    function selectedOptions(options) {
        props.selectedOptions(options)
    }




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
                       selectedOptions={selectedOptions}
                   />

                   <Text style={[textTheme.titleMedium, styles.lastVisitedText]}>
                       Last visited date
                   </Text>
                   <View style={styles.filterDateContainer}>
                       <CustomTextInput
                          type={"date"}
                          label={"From date"}
                          labelTextStyle={[textTheme.titleMedium, styles.lastVisitedText]}
                          dateInputContainer={styles.dateInputContainer}
                          labelEnabled={false}
                          container={{marginBottom: 16}}
                          maximumDate={new Date(Date.now())}
                       />
                       <CustomTextInput
                           type={"date"}
                           label={"To date"}
                           labelTextStyle={[textTheme.titleMedium, styles.lastVisitedText]}
                           dateInputContainer={styles.dateInputContainer}
                           labelEnabled={false}
                           container={{marginBottom: 0}}
                       />
                   </View>


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
        marginTop: 8
    },
    lastVisitedText: {
        marginTop: 16,
        marginLeft: 16
    },
    dateInputContainer: {
        marginHorizontal: 12
    },
    filterDateContainer: {
        borderWidth: 1,
        marginHorizontal: 16,
        borderColor: Colors.grey250,
        marginTop: 8,
        paddingVertical: 24,
        borderRadius: 4
    }
})