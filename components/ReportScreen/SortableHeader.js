import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import TextTheme from '../../constants/TextTheme';
import sortIcon from '../../assets/icons/reportIcons/sort.png';

const SortableHeader = ({
    dispatch,
    title,
    sortKey,
    currentSortKey,
    pageNo,
    maxEntry,
    fromDate,
    toDate,
    query,
    onSortChange,
    onChangeData,
    setGetSortOrderKey,
    sortOrderKey,
    onChangeFunction,
    filterData
}) => {
    // const [sortOrderKey, setSortOrderKey] = useState(1);
    const [sortComponentOrderKey, setComponentSortOrderKey] = useState(1);

    const handleSort = () => {
        if (sortKey !== "") {
            setComponentSortOrderKey(prev => {
                const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                const sortOrder = newOrderKey === 1 ? 'reset' : newOrderKey === 2 ? 'asc' : 'desc';
                if (newOrderKey === 1) {
                    onSortChange(null);
                } else {
                    onSortChange(sortKey);
                    dispatch(
                        onChangeFunction(
                            pageNo,
                            maxEntry,
                            fromDate,
                            toDate,
                            query,
                            sortKey,
                            sortOrder,
                            filterData
                        )
                    ).then((res) => {
                        onChangeData(res)
                    });
                }
                // setSortOrderKey(newOrderKey);
                setGetSortOrderKey(newOrderKey)
                return newOrderKey
            })

        }
    };

    return (
        <TouchableOpacity onPress={handleSort} style={styles.headerButton}>
            <View style={styles.headerContainer}>
                <Text
                    style={[
                        TextTheme.bodyMedium,
                        {
                            color: currentSortKey === sortKey ? sortComponentOrderKey !== 1 ? Colors.highlight : Colors.black : Colors.black,
                            textAlign: 'start',
                            flexWrap: 'wrap',
                        },
                    ]}
                    numberOfLines={1}
                >
                    {title}
                </Text>
                {
                    sortKey !== "" && (
                        currentSortKey === sortKey ? (
                            sortComponentOrderKey === 1 ? (
                                <Image source={sortIcon} style={styles.icon} />
                            ) : sortComponentOrderKey === 2 ? (
                                <FontAwesome name="sort-amount-asc" size={14} color="black" />
                            ) : (
                                <FontAwesome name="sort-amount-desc" size={14} color="black" />
                            )
                        ) : (
                            <Image source={sortIcon} style={styles.icon} />
                        )
                    )
                }

            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '100%',
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    icon: {
        width: 20,
        height: 20,
    },
});

export default SortableHeader;
