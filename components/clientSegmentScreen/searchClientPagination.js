import PrimaryButton from "../../ui/PrimaryButton";
import {Text, View, StyleSheet} from "react-native";
import {AntDesign, FontAwesome6} from "@expo/vector-icons";
import {useEffect, useMemo, useState} from "react";
import {
    incrementSearchClientPageNumber,
    decrementSearchPageNumber,
    loadSearchClientFiltersFromDb,
    resetSearchClientFilter, updateSearchClientMaxEntry,
} from "../../store/clientFilterSlice";
import {clientFilterNames} from "../../util/chooseFilter";
import {useDispatch, useSelector} from "react-redux";
import Colors from "../../constants/Colors";

/**
 * SearchClientPagination Component
 *
 * Manages pagination controls for search results, allowing users to navigate through pages of search results and set the number of entries per page.
 *
 * @component
 * @example
 * return (
 *   <SearchClientPagination
 *     filterPressed="active"
 *     query="search query"
 *     setIsModalVisible={setIsModalVisible}
 *     setSearchClientTotalCount={setSearchClientTotalCount}
 *   />
 * );
 *
 * @param {Object} props - Component properties.
 * @param {string} props.filterPressed - The current filter applied, affecting the count of search results.
 * @param {string} props.query - The current search query used to filter results.
 * @param {Function} props.setIsModalVisible - Function to toggle the visibility of the modal for selecting entries per page.
 * @param {Function} props.setSearchClientTotalCount - Function to update the total count of search results.
 *
 * @returns {JSX.Element} The rendered component.
 */



export default function SearchClientPagination(props) {
    const dispatch = useDispatch();
    const maxEntry = useSelector(state => state.clientFilter.searchMaxEntry);

    const [upperCount, setUpperCount] = useState(10);
    const [lowerCount, setLowerCount] = useState(1);

    let getTotalCount = useSelector(state => state.clientFilter.totalSearchClients);

    // let totalCount = 0;

    const [totalCount, setTotalCount] = useState(0);



    useEffect(() => {
        dispatch(updateSearchClientMaxEntry(10))
        dispatch(resetSearchClientFilter());
        if(getTotalCount > 10) {
            dispatch(loadSearchClientFiltersFromDb(10, clientFilterNames(props.filterPressed), props.query))
        }
        // setTotalCount(totalCount);
        setLowerCount(1);
        setUpperCount(10 > getTotalCount ? getTotalCount : 10);
        props.setSearchClientTotalCount(getTotalCount);

    }, [props.filterPressed]);


    useEffect(() => {
        if(getTotalCount > 10) {
            dispatch(loadSearchClientFiltersFromDb(maxEntry, clientFilterNames(props.filterPressed), props.query));
        }
        if(lowerCount === 1) {
            setIsBackwardButtonDisabled(true);
        }
        else {
            setIsBackwardButtonDisabled(false);
        }

        if(upperCount === getTotalCount) {
                        setIsForwardButtonDisabled(true);
        }
        else {
            setIsForwardButtonDisabled(false);
        }
    }, [lowerCount, upperCount]);


    useEffect(()=> {
        props.setSearchClientTotalCount(getTotalCount);
    },[getTotalCount])


    useEffect(() => {

        if(getTotalCount > 10 ) {

            dispatch(loadSearchClientFiltersFromDb(maxEntry, clientFilterNames(props.filterPressed), props.query));
        }

        let upper_count = 0;
                if(maxEntry > getTotalCount) {
            upper_count = getTotalCount;
        }
        else {
            upper_count = maxEntry;
        }
        setLowerCount(1);
        setUpperCount(upper_count);
    }, [maxEntry, getTotalCount, props.query]);


    const [isBackwardButtonDisabled, setIsBackwardButtonDisabled]  = useState(false);
    const [isForwardButtonDisabled, setIsForwardButtonDisabled]  = useState(false);


    function forwardButtonHandler(){
        if(!isForwardButtonDisabled) {
            let lowerCountAfter = lowerCount + maxEntry;
            let upperCountAfter = upperCount + maxEntry;

            if(upperCountAfter > getTotalCount && lowerCountAfter < 0) {
                setLowerCount(getTotalCount - maxEntry);
                setUpperCount(getTotalCount);
                            }
            else if(upperCountAfter <= getTotalCount && lowerCountAfter >= 0) {
                                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter);
                dispatch(incrementSearchClientPageNumber());
            }
            else if(upperCountAfter > getTotalCount && upperCountAfter >= 0) {
                                dispatch(incrementSearchClientPageNumber());
                setUpperCount(getTotalCount);
                setLowerCount(lowerCountAfter)
            }
            else if(lowerCountAfter < 0 && upperCountAfter < getTotalCount) {
                                dispatch(incrementSearchClientPageNumber());
                setUpperCount(upperCountAfter)
                setLowerCount(0)
            }
        }
    }

    function backwardButtonHandler(){
        if(!isBackwardButtonDisabled) {
            let lowerCountAfter = lowerCount - maxEntry;
            let upperCountAfter = upperCount - maxEntry;

            if (lowerCountAfter === 1 && upperCountAfter < maxEntry) {
                                setLowerCount(1);
                setUpperCount(maxEntry);
                dispatch(decrementSearchPageNumber());
            }
            else if(lowerCountAfter < 1 && upperCountAfter < maxEntry) {
                                setLowerCount(1);
                setUpperCount(maxEntry);
                dispatch(decrementSearchPageNumber());
            }
            else if(upperCountAfter >= 1 && upperCountAfter >= maxEntry) {
                                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter - lowerCountAfter === maxEntry ? upperCountAfter : lowerCountAfter + maxEntry - 1);
                dispatch(decrementSearchPageNumber());
            }
        }
    }

    return(
        <>
        {
            getTotalCount < 10 ?
                null:
                <View style={styles.pagination}>
                    <PrimaryButton
                        pressableStyle={styles.entryButton}
                        buttonStyle={styles.entryButtonContainer}
                        onPress={() => props.setIsModalVisible(true)}
                    >
                        <View style={styles.buttonInnerContainer}>
                            <Text style={styles.entryText}>
                                {maxEntry}
                            </Text>
                            <AntDesign name="caretdown" size={14} color="black" style={{marginLeft: 16}}/>
                        </View>
                    </PrimaryButton>

                    <View style={styles.paginationInnerContainer}>
                        <Text style={styles.pagingText}>
                            {lowerCount < 0 ? 0 : lowerCount} - {upperCount} of {getTotalCount}
                        </Text>
                        <PrimaryButton
                            buttonStyle={[isBackwardButtonDisabled ? [styles.pageBackwardButton, styles.disabled] : [styles.pageBackwardButton]]}
                            onPress={backwardButtonHandler}
                        >
                            <FontAwesome6 name="angle-left" size={24} color="black" />
                        </PrimaryButton>
                        <PrimaryButton
                            buttonStyle={[isForwardButtonDisabled ? [styles.pageForwardButton, styles.disabled] : [styles.pageForwardButton]]}
                            onPress={forwardButtonHandler}
                        >
                            <FontAwesome6 name="angle-right" size={24} color="black" />
                        </PrimaryButton>

                    </View>

                </View>
        }

        </>
    );
}

const styles = StyleSheet.create({
    pagination: {
        height: 90,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
    },
    disabled: {
        opacity: 0.4,
    },
    entryText: {
    },
    entryButton: {

    },
    entryButtonContainer: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginLeft: 16,
        backgroundColor: Colors.white,
    },
    paginationInnerContainer: {
        flexDirection: 'row',
        marginRight: 16,
        alignItems: "center",
    },
    pageForwardButton: {
        backgroundColor :Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    pageBackwardButton: {
        backgroundColor :Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginHorizontal: 16
    },
    buttonInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    pagingText: {},
})