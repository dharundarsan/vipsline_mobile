import {View, StyleSheet, Text, Image, FlatList} from "react-native";
import textTheme from "../constants/TextTheme";
import PrimaryButton from "../ui/PrimaryButton";
import React, {useCallback, useEffect, useRef, useState} from "react";
import RecordExpenses from "../components/expensesScreen/RecordExpenses";
import SearchBar from "../ui/SearchBar";
import Colors from "../constants/Colors";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import ExpenseFilters from "../components/expensesScreen/ExpenseFilters";
import {useDispatch, useSelector} from "react-redux";
import {
    loadExpensesFromDb,
    loadSearchExpensesFromDb,
    updateCurrentExpense,
    updateCurrentExpensesId, updateFilters
} from "../store/ExpensesSlice";
import {capitalizeFirstLetter, dateFormatter} from "../util/Helpers";
import ExpensesPagination from "../components/expensesScreen/ExpensesPagination";
import EntryModal from "../components/expensesScreen/EntryModal";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {useFocusEffect} from "@react-navigation/native";
import SearchExpensesPagination from "../components/expensesScreen/SearchExpensesPagination";
import {loadBusinessNotificationDetails} from "../store/listOfBusinessSlice";
import {Col} from "react-native-table-component";
import moment from "moment/moment";
import Toast from "../ui/Toast";


export default function Expenses() {
    const dispatch = useDispatch();

    const [isVisible, setIsVisible] = useState(false);
    const [advancedFiltersVisibility, setAdvancedFiltersVisibility] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [updateIsVisible, setUpdateIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [clientDeleted, setClientDeleted] = useState(0);

    const totalExpensesCount = useSelector(state => state.expenses.totalExpenses);
    const totalExpensesAmount = useSelector(state => state.expenses.amount);
    const expenseItems = useSelector(state => state.expenses.expenses);

    const isExpensesExists = useSelector(state => state.expenses.isExpensesExists);
    const currentExpense = useSelector(state => state.expenses.currentExpense);

    const {range, category, fromDate, toDate} = useSelector(state => state.expenses);

    const toastRef = useRef(null);




    useEffect(() => {
        dispatch(loadSearchExpensesFromDb(searchQuery));
        if(searchQuery === "") {
            dispatch(loadExpensesFromDb())
        }
    }, [searchQuery]);

    useFocusEffect(useCallback(
        () => {
            dispatch(loadBusinessNotificationDetails());
            dispatch(loadExpensesFromDb());

            return () => {
                dispatch(updateFilters({
                    fromDate: moment().format("YYYY-MM-DD"),
                    toDate: moment().format("YYYY-MM-DD"),
                    category: "All expenses",
                    range: "Today",
                    customRangeStartDate: "",
                    customRangeEndDate: ""
                }));
            }
        },
        [],
    )
)



    function renderItem(itemData) {
        return <PrimaryButton
            buttonStyle={styles.expensesCard}
            pressableStyle={styles.expensesCardPressable}
            onPress={() => {
                setUpdateIsVisible(true)
                dispatch(updateCurrentExpensesId(itemData.item.id));
                dispatch(updateCurrentExpense(
                    expenseItems.find((item) => item.id === itemData.item.id)
                ))


            }}
        >
        <View style={{width: '100%', paddingVertical: 16}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
                <Text style={[textTheme.titleSmall, {fontWeight: "400"}]}>
                    {itemData.item.expense_sub_category}
                </Text>
                <Text style={[textTheme.titleSmall]}>
                    ₹ {itemData.item.amount}
                </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
                <Text style={[textTheme.labelSmall, {color: Colors.grey500, fontSize: 13,}]}>
                    {itemData.item.date.split(",")[0]}
                </Text>
                <Text style={[textTheme.labelSmall, {color: Colors.grey500, fontSize: 13}]}>
                    {itemData.item.payment_mode === "CASH" ? "Cash" : itemData.item.payment_mode === "CARD" ? "Card" : "Digital"}
                </Text>
            </View>
        </View>
        </PrimaryButton>
    }



    return <View style={styles.expense}>

            <EntryModal
                isModalVisible={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false)
                }}
                query={searchQuery}
            />
        {
            isVisible &&
            <RecordExpenses
                isVisible={isVisible}
                closeModal={() => {
                    setIsVisible(false);
                }}
                type={"add"}
                setClientDetected={setClientDeleted}
                searchQuery={searchQuery}
                toastRef={toastRef}
            />
        }
        {
            updateIsVisible &&
            <RecordExpenses
                isVisible={updateIsVisible}
                closeModal={() => {
                    setUpdateIsVisible(false);
                }}
                type={"update"}
                setClientDetected={setClientDeleted}
                searchQuery={searchQuery}
                toastRef={toastRef}
            />
        }
        {
            advancedFiltersVisibility &&
            <ExpenseFilters
                isVisible={advancedFiltersVisibility}
                onClose={() => setAdvancedFiltersVisibility(false)}
                setLoading={setIsLoading}
                loading={isLoading}

            />
        }
        {
            !isExpensesExists ?
                <View style={styles.content}>
                    <Text style={[textTheme.titleMedium]}>
                        Time To Manage Your Expenses!
                    </Text>
                    <Text style={[textTheme.bodyMedium, {textAlign: 'center'}]}>Create and manage expenses that are part of your outlets’s
                        operating
                        costs.</Text>
                    <PrimaryButton
                        label={"Record Expense"}
                        buttonStyle={styles.buttonStyle}
                        onPress={() => setIsVisible(true)}
                    />
                </View> :
                <View>
                    <Toast ref={toastRef}/>
                    <View style={styles.searchBarContainer}>
                        <SearchBar
                            filter
                            onPressFilter={() => setAdvancedFiltersVisibility(true)}
                            searchContainerStyle={styles.searchBar}
                            placeholder={"Search expense"}
                            onChangeText={setSearchQuery}
                            filterIcon={{
                                backgroundColor: range === "Today" &&
                                                 category === "All expenses" &&
                                                 fromDate === moment().format("YYYY-MM-DD") &&
                                                 toDate === moment().format("YYYY-MM-DD") ?
                                                 null :
                                                 Colors.highlight100
                            }}
                        />

                    </View>

                    <View style={styles.countContainer}>
                        <View style={styles.countInnerContainer}>
                            <Image source={require("../assets/icons/menu.png")} style={styles.menuImage}/>
                            <Text style={[textTheme.titleSmall]}>
                                Total Count: <Text style={[textTheme.titleSmall, {color: Colors.highlight}]}>
                                {totalExpensesCount}
                            </Text>
                            </Text>
                        </View>
                        <Text style={[textTheme.titleSmall, {marginLeft: 63}]}>
                            Total Expense Amount:  <Text style={[textTheme.titleSmall, {color: Colors.highlight}]}>
                            ₹{totalExpensesAmount}
                        </Text>
                        </Text>
                    </View>
                    {
                        searchQuery === "" ?
                            <FlatList
                                data={expenseItems}
                                renderItem={renderItem}
                                ListEmptyComponent={() => (
                                    <View style={styles.noDataContainer}>
                                        <Text style={[textTheme.bodyLarge]}>No Data Found</Text>
                                    </View>
                                )}
                                contentContainerStyle={styles.flatList}
                            /> :
                            <FlatList
                                data={expenseItems}
                                renderItem={renderItem}
                                ListEmptyComponent={() => (
                                    <View style={styles.noDataContainer}>
                                        <Text style={[textTheme.titleMedium]}>No Data</Text>
                                    </View>
                                )}
                            />
                    }
                    <View style={styles.addButtonContainer}>
                        <PrimaryButton
                            buttonStyle={styles.addButton}
                            pressableStyle={styles.addButtonPressable}
                            onPress={() => setIsVisible(true)}
                        >
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                                {/*<Text style={[textTheme.titleMedium, {color: Colors.white}]}>Add</Text>*/}
                                <FontAwesome6 name="plus" size={24} color="white" />
                            </View>
                        </PrimaryButton>
                    </View>
                    {
                        totalExpensesCount > 10 && searchQuery === "" ?
                            <ExpensesPagination
                            setIsModalVisible={setIsModalVisible}
                            totalCount={totalExpensesCount}
                            clientDeleted={clientDeleted}
                            /> :
                            <></>
                    }


                </View>
        }
    </View>
}

const styles = StyleSheet.create({
    expense: {
        alignItems: "center",
        backgroundColor: Colors.white,
        flex: 1
    },
    content: {
        alignItems: "center",
        width: '90%',
        marginTop: 100
    },
    buttonStyle: {
        marginTop: 32
    },
    searchBar: {
        borderWidth: 0,
        paddingVertical: 6,
        paddingHorizontal: 8,
        flex: 1,
        marginRight: 8

    },
    searchBarContainer: {
        marginVertical: 32,
        width: '100%',
        paddingHorizontal: 8,
        flexDirection: 'row'
    },
    filterButton: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.grey250,

    },
    countContainer: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        paddingVertical: 16,
        rowGap: 12
    },
    menuImage: {
        width: 24,
        height: 24,
        marginLeft: 24
    },
    countInnerContainer: {
        flexDirection: 'row',
        gap: 16
    },
    expensesCard: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey250,
        rowGap: 6,
        backgroundColor: Colors.white,
        borderRadius: 0


    },
    expensesCardPressable: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        flex: 1,
        width: '100%'


    },
    addButtonContainer: {
        position:'absolute',
        right: "8%",
        bottom: "15%",

    },
    addButton: {
        backgroundColor: Colors.highlight,
        borderRadius: 12

    },
    addButtonPressable: {
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    noDataContainer: {
        alignItems: 'center',
        marginTop: 16,
        justifyContent: 'center',
        flex: 1
    },

})