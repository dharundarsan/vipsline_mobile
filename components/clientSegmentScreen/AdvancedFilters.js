import {Modal, View, StyleSheet, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import CustomDropdown from "../../ui/CustomDropdown";
import CustomTextInput from "../../ui/CustomTextInput";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearAppliedFilters, loadClientFiltersFromDb, updateAppliedFilters} from "../../store/clientFilterSlice";
import {convertAppliedFilters, dateFormatter, formatDate, shadowStyling, shadowStylingTop} from "../../util/Helpers";
import {Col} from "react-native-table-component"
import {clientFilterNames} from "../../util/chooseFilter";
import {loadClientCountFromDb} from "../../store/clientSlice";

export default function AdvancedFilters(props) {

    const dispatch = useDispatch();

    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isNewClient, setIsNewClient] = useState(false);

    const appliedFilters = useSelector(state => state.clientFilter.appliedFilters);


    useEffect(() => {
        const x = getActiveFilters(appliedFilters)
        setSelectedOptions(x);
        setFromDate(appliedFilters.fromDate === "" ? null : appliedFilters.fromDate);
        setToDate(appliedFilters.toDate === "" ? null : appliedFilters.toDate);
    }, []);


    useEffect(() => {
        const containNewClient = selectedOptions.some(item => item.includes("New client"));
        setIsNewClient(containNewClient);
    }, [selectedOptions]);

    // useEffect(() => {
    //     props.selectedOptions(selectedOptions);
    // }, [selectedOptions, fromDate, toDate]);

    const hasActiveFilters = (filterObj) => {
        // Check if any of filter1 to filter5 are defined and not an empty string
        return ['filter1', 'filter2', 'filter3', 'filter4', 'filter5'].some(key => {
            const value = filterObj[key];
            return value !== undefined && value !== "";
        });
    };

    const getActiveFilters = (filterObj) => {
        // Define a mapping from filter values to their descriptive strings
        const filterMapping = {
            male: "Male client",
            female: "Female client",
            membership: "Membership",
            "non-membership": "Non-Membership",
            "new client": "New client",
        };

        // Return an array of formatted filter values that are defined and not empty
        return Object.entries(filterObj)
            .filter(([key, value]) => value !== undefined && value !== "")
            .map(([key, value]) => filterMapping[value] || value); // Map to descriptive strings
    };

    const fromDateRef = useRef(null)
    const toDateRef = useRef(null)




    return <Modal style={{flex: 1}} visible={props.isVisible} animationType={"slide"} presentationStyle={"formSheet"} onRequestClose={props.onClose}>
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
               <View style={styles.body}>
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
                       setSelectedOptions={setSelectedOptions}

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
                          onChangeValue={(value) => {
                              setFromDate(value)
                          }}
                          value={fromDate === null || fromDate === undefined ? null : new Date(fromDate)}
                          validator={(text) => {
                              if(isNewClient) {
                                  return "From Date is Required"
                              }
                              else if(toDate !== null) {
                                  return "From Date is Required"
                              }
                          }}
                          onSave={(callback) => {
                              fromDateRef.current = callback;
                          }}
                          errorStyle={{marginLeft: 16}}


                       />
                       <CustomTextInput
                           type={"date"}
                           label={"To date"}
                           labelTextStyle={[textTheme.titleMedium, styles.lastVisitedText]}
                           dateInputContainer={styles.dateInputContainer}
                           labelEnabled={false}
                           container={{marginBottom: 0}}
                           maximumDate={new Date(Date.now())}
                           value={toDate === null || toDate === undefined ? null : new Date(toDate)}
                           onChangeValue={(value) => {
                               setToDate(value);
                           }}
                           minimumDate={fromDate === null ? undefined : fromDate}
                           validator={(text) => {
                               if(isNewClient) {
                                   return "To Date is Required"
                               }
                               else if(fromDate !== null) {
                                   return "To Date is Required"
                               }
                           }}
                           onSave={(callback) => {
                                toDateRef.current = callback;
                           }}
                           errorStyle={{marginLeft: 16}}
                       />
                   </View>


               </View>
           </View>
        <View style={{alignItems: 'center', borderWidth: 1, borderColor: Colors.grey250}}>
            <View style={styles.bottomButtonContainer}>
                <PrimaryButton
                    label={"Clear filters"}
                    buttonStyle={styles.clearButton}
                    textStyle={[styles.clearFilterText, textTheme.titleSmall]}
                    onPress={() => {
                        dispatch(clearAppliedFilters());
                        dispatch(loadClientFiltersFromDb(10, clientFilterNames(props.filterPressed)));
                        const initialState = {
                                fromDate: "",
                                toDate: "",
                                filter1: undefined,
                                filter2: undefined,
                                filter3:undefined,
                                filter4:undefined,
                                filter5: undefined,
                        }
                        setSelectedOptions(getActiveFilters(initialState));
                        setFromDate(null);
                        setToDate(null)
                    }}
                />
                <PrimaryButton
                    label={"Apply"}
                    buttonStyle={styles.applyButton}
                    textStyle={[styles.applyText, textTheme.titleSmall]}
                    onPress={async () => {
                        const fromDateRefHandler = fromDateRef.current();
                        const toDateRefHandler = toDateRef.current();



                        if((isNewClient) && (fromDate === null || toDate === null)) return;
                        if(!((fromDate === null && toDate === null) || (fromDate !== null && toDate !== null))) return;

                        props.setVisibility(false);
                        const _appliedFilters = convertAppliedFilters(fromDate, toDate, selectedOptions);
                        dispatch(updateAppliedFilters(_appliedFilters));
                        await dispatch(loadClientFiltersFromDb(10, clientFilterNames(props.filterPressed)));
                        props.selectedOptions(selectedOptions);
                    }}
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
        backgroundColor: Colors.grey150,
        justifyContent: 'center'

    },
    body: {
        marginTop: 32
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
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
        paddingVertical: 20,
        width: "80%"
    },
    clearButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
        flex: 1
    },
    applyButton: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        flex: 1
    },
    applyText: {
        color: Colors.white
    },
    clearFilterText: {
        color: Colors.black
    }
})