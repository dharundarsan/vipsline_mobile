import PrimaryButton from "../../ui/PrimaryButton";
import {Text, View, StyleSheet} from "react-native";
import {AntDesign, FontAwesome6} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {
    incrementSearchClientPageNumber,
    decrementSearchPageNumber,
    loadSearchClientFiltersFromDb,
    resetSearchClientFilter, updateSearchClientMaxEntry,
} from "../../store/clientFilterSlice";
import {clientFilterNames} from "../../util/chooseFilter";
import {useDispatch, useSelector} from "react-redux";
import Colors from "../../constants/Colors";

export default function SearchClientPagination(props) {
    const dispatch = useDispatch();
    const maxEntry = useSelector(state => state.clientFilter.searchMaxEntry);

    const [upperCount, setUpperCount] = useState(10);
    const [lowerCount, setLowerCount] = useState(1);

    const totalCount = useSelector(state => state.clientFilter.totalSearchClients);


    useEffect(() => {
        dispatch(updateSearchClientMaxEntry(10))
        // console.log("inside the props max entry: " + maxEntry);
        dispatch(resetSearchClientFilter());
        console.log("1st");
        dispatch(loadSearchClientFiltersFromDb(10, clientFilterNames(props.filterPressed), props.query))
        // setTotalCount(totalCount);
        setLowerCount(1);
        setUpperCount(10 > totalCount ? totalCount : 10);

    }, [props.filterPressed,]);

    useEffect(() => {
        console.log("2st");
        dispatch(loadSearchClientFiltersFromDb(maxEntry, clientFilterNames(props.filterPressed), props.query));
        if(lowerCount === 1) {
            setIsBackwardButtonDisabled(true);
        }
        else {
            setIsBackwardButtonDisabled(false);
        }

        if(upperCount === totalCount) {
            // console.log(upperCount + "  " + totalCount);
            setIsForwardButtonDisabled(true);
        }
        else {
            setIsForwardButtonDisabled(false);
        }
    }, [lowerCount, upperCount]);

    useEffect(() => {
        setLowerCount(1);
        setUpperCount(maxEntry);
        dispatch(resetSearchClientFilter());
        console.log("3rt");
        dispatch(loadSearchClientFiltersFromDb(maxEntry, clientFilterNames(props.filterPressed), props.query));
    }, [maxEntry]);




    const [isBackwardButtonDisabled, setIsBackwardButtonDisabled]  = useState(false);
    const [isForwardButtonDisabled, setIsForwardButtonDisabled]  = useState(false);


    function forwardButtonHandler(){
        if(!isForwardButtonDisabled) {
            let lowerCountAfter = lowerCount + maxEntry;
            let upperCountAfter = upperCount + maxEntry;

            if(upperCountAfter > totalCount && lowerCountAfter < 0) {
                setLowerCount(totalCount - maxEntry);
                setUpperCount(totalCount);
                // console.log("both are out of bound");
            }
            else if(upperCountAfter <= totalCount && lowerCountAfter >= 0) {
                // console.log("both are good not out of bound");
                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter);
                dispatch(incrementSearchClientPageNumber());
            }
            else if(upperCountAfter > totalCount && upperCountAfter >= 0) {
                // console.log("upper bound is out of bound");
                dispatch(incrementSearchClientPageNumber());
                setUpperCount(totalCount);
                setLowerCount(lowerCountAfter)
            }
            else if(lowerCountAfter < 0 && upperCountAfter < totalCount) {
                // console.log("lower bound is out of bound");
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
                // console.log("lower bound ==== 1 and upper bound is under of bound while dec");
                setLowerCount(1);
                setUpperCount(maxEntry);
                dispatch(decrementSearchPageNumber());
            }
            else if(lowerCountAfter < 1 && upperCountAfter < maxEntry) {
                // console.log("lower bound is out of bound and upper bound is under of bound while dec");
                setLowerCount(1);
                setUpperCount(maxEntry);
                dispatch(decrementSearchPageNumber());
            }
            else if(upperCountAfter >= 1 && upperCountAfter >= maxEntry) {
                // console.log("bother are good not out of bound while decrement");
                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter);
                dispatch(decrementSearchPageNumber());
            }
        }
    }

    return(
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
                    {lowerCount < 0 ? 0 : lowerCount} - {upperCount} of {totalCount}
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