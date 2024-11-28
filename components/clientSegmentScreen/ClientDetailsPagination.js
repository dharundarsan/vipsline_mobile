import PrimaryButton from "../../ui/PrimaryButton";
import {Text, View, StyleSheet} from "react-native";
import {AntDesign, FontAwesome6} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Colors from "../../constants/Colors";
import {decrementPageNumber, incrementPageNumber, loadAnalyticsClientDetailsFromDb} from "../../store/clientInfoSlice";
import {checkNullUndefined} from "../../util/Helpers";

/**
 * Pagination Component
 *
 * Handles pagination controls and the display of page ranges for a data list.
 * Allows users to navigate through pages and select the number of entries per page.
 *
 * @component
 * @example
 * return (
 *   <Pagination
 *     filterPressed="active"
 *     setIsModalVisible={setIsModalVisible}
 *   />
 * );
 *
 * @param {Object} props - Component properties.
 * @param {string} props.filterPressed - The current filter applied, affecting the client count.
 * @param {Function} props.setIsModalVisible - Function to toggle the visibility of the modal for selecting entries per page.
 *
 * @returns {JSX.Element} The rendered component.
 */


export default function ClientDetailsPagination(props) {
    const dispatch = useDispatch();


    const totalCountFromStore = useSelector(state => state.clientInfo.totalSales);
    const maxEntry = useSelector(state => state.clientInfo.maxEntry);

    // const uc = checkNullUndefined(props.uc) ? 0 : props.uc.length;
    const uc = 10;


    let currentClientCount = props.totalCount;


    const [totalCount, setTotalCount] = useState(totalCountFromStore);
    const [upperCount, setUpperCount] = useState(10);
    const [lowerCount, setLowerCount] = useState(1);


    useEffect(() => {
        dispatch(loadAnalyticsClientDetailsFromDb(props.clientId));

        if(lowerCount === 1) {
            setIsBackwardButtonDisabled(true);
        }
        else {
            setIsBackwardButtonDisabled(false);
        }

        if(upperCount === totalCount) {
            setIsForwardButtonDisabled(true);
        }
        else {
            setIsForwardButtonDisabled(false);
        }
    }, [lowerCount, upperCount]);

    useEffect(() => {
        setLowerCount(1);
        if(maxEntry > currentClientCount) {

            setUpperCount(currentClientCount);
        }
        else {
            setUpperCount(maxEntry);
        }

        dispatch(loadAnalyticsClientDetailsFromDb(props.clientId))


    }, [maxEntry]);


    const [isBackwardButtonDisabled, setIsBackwardButtonDisabled]  = useState(false);
    const [isForwardButtonDisabled, setIsForwardButtonDisabled]  = useState(false);


    function forwardButtonHandler(){
        if(!isForwardButtonDisabled) {
            let lowerCountAfter = lowerCount + maxEntry;
            let upperCountAfter = upperCount + maxEntry;

            if(upperCountAfter > props.totalCount && lowerCountAfter < 0) {
                setLowerCount(props.totalCount - maxEntry);
                setUpperCount(props.totalCount);
            }
            else if(upperCountAfter <= props.totalCount && lowerCountAfter >= 0) {
                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter);
                dispatch(incrementPageNumber());
            }
            else if(upperCountAfter > props.totalCount && upperCountAfter >= 0) {
                dispatch(incrementPageNumber());
                setUpperCount(props.totalCount);
                setLowerCount(lowerCountAfter)
            }
            else if(lowerCountAfter < 0 && upperCountAfter < props.totalCount) {
                dispatch(incrementPageNumber());
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
                dispatch(decrementPageNumber());
            }
            else if(lowerCountAfter < 1 && upperCountAfter < maxEntry) {
                setLowerCount(1);
                setUpperCount(maxEntry);
                dispatch(decrementPageNumber());
            }
            else if(upperCountAfter >= 1 && upperCountAfter >= maxEntry) {
                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter);
                dispatch(decrementPageNumber());
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
                    {lowerCount < 0 ? 0 : lowerCount} - {upperCount} of {props.totalCount}
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
        width: '100%',
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