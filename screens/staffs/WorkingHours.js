import * as React from 'react';
import {View, useWindowDimensions, Pressable, Text, StyleSheet, Animated} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Team from "../../components/staffManagementScreen/Team";
import Week from "../../components/staffManagementScreen/Week";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";

const renderScene = SceneMap({
    first: Team,
    second: Week,
});

const routes = [
    {key: 'first', title: 'Teams'},
    {key: 'second', title: 'Week'},
];


export default function TabViewExample() {

    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [tabBarWidth, setTabBarWidth] = React.useState(0);
    const translateX = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(translateX, {
            toValue: (index * tabBarWidth) / routes.length,
            useNativeDriver: true,
        }).start();
    }, [index, tabBarWidth]);
    const handleTabPress = (i) => {
        setIndex(i);
    };

    const styles = StyleSheet.create({
        tabBar: {
            backgroundColor: 'white',
            flexDirection: 'row',
            elevation: 4,
            position: 'relative',
        },
        tabItem: {
            flex: 1,
            paddingVertical: 12,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 3,
            borderBottomColor: 'transparent',
        },
        activeTab: {
            // backgroundColor: '#e6f0ff', // Light background on active tab
        },
        tabText: {

            color: Colors.grey500, // Default text color
        },
        activeTabText: {
            color: Colors.highlight,
        },
        tabIndicator: {
            position: 'absolute',
            bottom: 0,
            left: index === 0 ? 0 : "50%",
            height: 3,
            backgroundColor: Colors.highlight, // Color for the active tab indicator
            width: '50%'
        },
    });

    return (
        <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width: layout.width}}
            renderTabBar={(props) => (
                <View
                    style={styles.tabBar}
                    onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)} // Calculate width
                >
                    {props.navigationState.routes.map((route, i) => (
                        <Pressable
                            key={route.key}
                            style={[
                                styles.tabItem,
                                index === i && styles.activeTab, // Active tab style
                            ]}
                            onPress={() => handleTabPress(i)}
                        >
                            <Text
                                style={[
                                    textTheme.titleMedium,
                                    styles.tabText,
                                    index === i && styles.activeTabText, // Active tab text color
                                ]}
                            >
                                {route.title}
                            </Text>
                        </Pressable>
                    ))}
                    {/* Animated indicator for active tab */}
                    <View
                        style={[
                            styles.tabIndicator,
                        ]}
                    />
                </View>
            )}
        />
    );


}

