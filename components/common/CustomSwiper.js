import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import Colors from "../../constants/Colors";

const { width } = Dimensions.get('window');

const CustomSwiper = ({
                          children,
                          activeTabTextStyle,
                          tabTextStyle,
                          underlineStyle,
                          containerStyle,
                          tabContainerStyle,
                          tabButtonContainerStyle,
                      }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const [textWidth, setTextWidth] = useState(0);

    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setTextWidth(width); // Capture the width of the Text element
    };

    const handleTabPress = (index) => {
        setCurrentIndex(index);
        flatListRef.current.scrollToIndex({ index, animated: true });
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const tabs = React.Children.map(children, (child) => child.props.tabLabel);

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Top Navigation Tabs */}
            <View style={[styles.tabContainer, tabContainerStyle]}>
                {tabs.map((label, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleTabPress(index)}
                        style={[
                            styles.tabButton,
                            tabButtonContainerStyle,
                            currentIndex === index && styles.activeTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                tabTextStyle,
                                currentIndex === index && [styles.activeTabText, activeTabTextStyle],
                            ]}
                            onLayout={handleLayout}
                        >
                            {label}
                        </Text>
                        {currentIndex === index && (
                            <View
                                style={[styles.underline, { width: textWidth + 18 }, underlineStyle]}
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Screens */}
            <FlatList
                ref={flatListRef}
                data={React.Children.toArray(children)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.screen}>
                        {item}
                    </View>
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
        </View>
    );
};

export default CustomSwiper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
    },
    tabButton: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTab: {},
    tabText: {},
    activeTabText: {
        color: Colors.highlight,
    },
    screen: {
        width,
    },
    underline: {
        position: 'absolute',
        height: 2,
        width: 50,
        backgroundColor: Colors.highlight,
        borderRadius: 2,
        bottom: 4,
    },
});
