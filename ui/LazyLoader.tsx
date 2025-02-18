import React from "react";
import {
    ActivityIndicator,
    FlatList,
    FlatListProps,
    NativeScrollEvent,
    View,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from "react-native";

interface LazyLoaderProps<T> extends FlatListProps<T> {
    /**
     * Indicates if the component is loading data.
     * Default: `false`
     */
    isLoading?: boolean;

    /**
     * The threshold (in pixels) from the bottom of the list to trigger `onFetchTrigger`.
     * Default: `100`
     */
    triggerThreshold?: number;

    /**
     * Function to be called when the user scrolls near the bottom of the list.
     * **Required**
     */
    onFetchTrigger: () => void;

    /**
     * Total number of items available in the data source.
     * Default: `0`
     */
    totalLength?: number;

    /**
     * Custom fallback text when no data is present.
     * Default: `"No data available."`
     */
    fallbackTextOnEmptyData?: string;

    /**
     * Custom loader component for loading state.
     * Default: `<ActivityIndicator size="large" />`
     */
    customLoader?: React.ReactNode;

    /**
     * Style for the container of fallback text when no data is present.
     * Default:
     * ```javascript
     * {
     *   flex: 1,
     *   justifyContent: "center",
     *   alignItems: "center",
     *   height: 200,
     * }
     * ```
     */
    fallbackTextContainerStyle?: ViewStyle;

    /**
     * Style for the fallback text when no data is present.
     * Default:
     * ```javascript
     * {
     *   textAlign: "center",
     *   color: "#888",
     * }
     * ```
     */
    fallbackTextStyle?: TextStyle;

    /**
     * Message to display when the user reaches the end of the list.
     * Default: `"Page End Reached"`
     */
    endOfListMessage?: string;

    /**
     * Style for the end-of-list message text.
     * Default:
     * ```javascript
     * {
     *   textAlign: "center",
     *   color: "#888",
     *   padding: 10,
     * }
     * ```
     */
    endOfListMessageStyle?: TextStyle;
}

const isCloseToBottom = (
    {layoutMeasurement, contentOffset, contentSize}: NativeScrollEvent,
    triggerThreshold: number = 0
) => {
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - triggerThreshold
    );
};

const LazyLoader = <T,>({
                            data,
                            isLoading = false,
                            triggerThreshold = 100,
                            onFetchTrigger,
                            totalLength = 0,
                            fallbackTextOnEmptyData = "No data available.",
                            customLoader = <ActivityIndicator size="large" />,
                            fallbackTextContainerStyle = {},
                            fallbackTextStyle = {},
                            endOfListMessage = "Page End Reached",
                            endOfListMessageStyle = {},
                            ...restFlatListProps
                        }: LazyLoaderProps<T>) => {
    return (
        <FlatList
            data={data}
            {...restFlatListProps}
            ListFooterComponent={() => {
                if (isLoading) {
                    return customLoader;
                }
                if (totalLength === data?.length) {
                    return (
                        <Text style={[styles.endOfListText, endOfListMessageStyle]}>
                            {endOfListMessage}
                        </Text>
                    );
                }
                if (!data || data.length === 0) {
                    return (
                        <View
                            style={[styles.fallbackContainer, fallbackTextContainerStyle]}
                        >
                            <Text style={[styles.fallbackText, fallbackTextStyle]}>
                                {fallbackTextOnEmptyData}
                            </Text>
                        </View>
                    );
                }
                return null;
            }}
            onScroll={({nativeEvent}) => {
                if (
                    isCloseToBottom(nativeEvent, triggerThreshold) &&
                    !isLoading &&
                    totalLength !== data?.length
                ) {
                    onFetchTrigger();
                }
            }}
        />
    );
};

const styles = StyleSheet.create({
    fallbackContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 200,
    },
    fallbackText: {
        textAlign: "center",
        color: "#888",
    },
    endOfListText: {
        textAlign: "center",
        color: "#888",
        padding: 10,
    },
});

export default LazyLoader;
