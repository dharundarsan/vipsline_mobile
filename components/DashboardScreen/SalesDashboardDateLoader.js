import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContentLoader from 'react-native-easy-content-loader'

const SalesDashboardDateLoader = ({ isDateDataLoading = false }) => {
    return (
        <>
            <View >
                {isDateDataLoading === false ?
                    <View style={[styles.dateContainer, { columnGap: 0, width: "50%" }]}>
                        <ContentLoader
                            pRows={1}
                            pHeight={[45]}
                            pWidth={["100%"]}
                            active
                            title={false}

                        />
                        <ContentLoader
                            pRows={1}
                            pHeight={[45]}
                            pWidth={["100%"]}
                            active
                            title={false}
                        />
                    </View>
                    : null}
                <View style={{ marginTop: isDateDataLoading === false ? "7%" : 0, flexDirection: "row", paddingHorizontal: 10 }}>
                    <ContentLoader
                        pRows={1}
                        pHeight={[85]}
                        pWidth={["100%"]}
                        active
                        title={false}
                        containerStyles={{ width: '50%' }}

                    />
                    <ContentLoader
                        pRows={1}
                        pHeight={[85]}
                        pWidth={["100%"]}
                        active
                        title={false}
                        containerStyles={{ width: "50%" }}

                    />
                </View>
                <View style={{ marginTop: "5%", flexDirection: "row", paddingHorizontal: 10 ,marginBottom:'5%'}}>
                    <ContentLoader
                        pRows={1}
                        pHeight={[85]}
                        pWidth={["100%"]}
                        active
                        title={false}
                        containerStyles={{ width: '50%' }}

                    />
                    <ContentLoader
                        pRows={1}
                        pHeight={[85]}
                        pWidth={["100%"]}
                        active
                        title={false}
                        containerStyles={{ width: "50%" }}

                    />
                </View>
            </View >
            <View style={{ marginVertical: "0%", paddingHorizontal: 10, rowGap: 10 }}>
                <ContentLoader
                    pRows={1}
                    pHeight={[35]}
                    pWidth={["100%"]}
                    active
                    title={false}

                />
                <ContentLoader
                    pRows={1}
                    pHeight={[35]}
                    pWidth={["100%"]}
                    active
                    title={false}

                />
                <ContentLoader
                    pRows={1}
                    pHeight={[35]}
                    pWidth={["100%"]}
                    active
                    title={false}

                />
                <ContentLoader
                    pRows={1}
                    pHeight={[35]}
                    pWidth={["100%"]}
                    active
                    title={false}

                />
                <ContentLoader
                    pRows={1}
                    pHeight={[35]}
                    pWidth={["100%"]}
                    active
                    title={false}

                />
            </View>
            <View style={{ marginVertical: "5%", flexDirection: "row", paddingHorizontal: 10 }}>
                <ContentLoader
                    pRows={1}
                    pHeight={[300]}
                    pWidth={["100%"]}
                    active
                    title={false}
                />
            </View>
        </>
    )
}

export default SalesDashboardDateLoader

const styles = StyleSheet.create({
    dateContainer: {
        flexDirection: "row",
        columnGap: 5,
        // rowGap: 5,
    },
})