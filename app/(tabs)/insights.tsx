import { useSubscriptions } from "@/contexts/SubscriptionContext";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* =========================
   ✅ UPDATED BAR CHART
========================= */
const BarChart = ({ data }: { data: number[] }) => {
    const maxValue = Math.max(...data, 1);

    const MAX_BAR_HEIGHT = 100; // actual bar height
    const CONTAINER_HEIGHT = 120; // total height (creates top padding)

    return (
        <StyledView className="flex-row items-end justify-between h-40 bg-white rounded-lg p-4 gap-2">
            {data.map((value, index) => (
                <StyledView
                    key={index}
                    className="flex-1 flex-col items-center gap-2"
                >
                    {/* Bar container (adds top spacing) */}
                    <StyledView
                        style={{ height: CONTAINER_HEIGHT }}
                        className="justify-end w-full"
                    >
                        <StyledView
                            className="w-full bg-blue-500 rounded-t"
                            style={{
                                height: (value / maxValue) * MAX_BAR_HEIGHT,
                            }}
                        />
                    </StyledView>

                    {/* Label */}
                    <StyledText className="text-xs font-semibold text-gray-600">
                        {DAYS_OF_WEEK[index]}
                    </StyledText>
                </StyledView>
            ))}
        </StyledView>
    );
};

/* =========================
   Subscription Item
========================= */
const SubscriptionHistoryItem = ({
    subscription,
}: {
    subscription: Subscription;
}) => {
    return (
        <StyledView className="flex-row items-center justify-between bg-white rounded-lg p-4 mb-3">
            <StyledView className="flex-row items-center flex-1 gap-3">
                {subscription.icon && (
                    <Image
                        source={
                            typeof subscription.icon === "string"
                                ? { uri: subscription.icon }
                                : subscription.icon
                        }
                        className="w-10 h-10 rounded"
                    />
                )}

                <StyledView className="flex-1">
                    <StyledText className="font-semibold text-gray-900">
                        {subscription.name}
                    </StyledText>
                    <StyledText className="text-sm text-gray-500">
                        {subscription.billing}
                    </StyledText>
                </StyledView>
            </StyledView>

            <StyledText className="font-bold text-gray-900">
                ${subscription.price.toFixed(2)}
            </StyledText>
        </StyledView>
    );
};

/* =========================
   MAIN SCREEN
========================= */
const Insights = () => {
    const { subscriptions } = useSubscriptions();

    const { dailyData, monthlyTotal } = useMemo(() => {
        const weeklyData: number[] = [0, 0, 0, 0, 0, 0, 0];
        let total = 0;

        subscriptions.forEach((sub: Subscription) => {
            if (sub.startDate) {
                const adjustedDay = (dayjs(sub.startDate).day() + 6) % 7;
                weeklyData[adjustedDay] += sub.price;
            }

            // (optional) restrict to current month
            if (dayjs(sub.startDate).isSame(dayjs(), "month")) {
                total += sub.price;
            }
        });

        return { dailyData: weeklyData, monthlyTotal: total };
    }, [subscriptions]) as {
        dailyData: number[];
        monthlyTotal: number;
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1 p-5"
                showsVerticalScrollIndicator={false}
            >
                {/* Heading */}
                <StyledText className="text-2xl font-bold text-gray-900 mb-6">
                    Monthly Insights
                </StyledText>

                {/* Chart */}
                <BarChart data={dailyData} />

                {/* Monthly Expense */}
                <StyledView className="bg-white rounded-lg p-5 mt-6 mb-8">
                    <StyledText className="text-gray-600 text-sm font-medium mb-2">
                        Monthly Expense
                    </StyledText>
                    <StyledText className="text-4xl font-bold text-gray-900">
                        ${monthlyTotal.toFixed(2)}
                    </StyledText>
                </StyledView>

                {/* History */}
                <StyledView className="mb-4">
                    <StyledView className="flex-row justify-between items-center mb-4">
                        <StyledText className="text-xl font-bold text-gray-900">
                            History
                        </StyledText>

                        <StyledPressable className="px-3 py-1">
                            <StyledText className="text-blue-500 font-semibold text-sm">
                                View All
                            </StyledText>
                        </StyledPressable>
                    </StyledView>

                    {/* List */}
                    {subscriptions.length > 0 ? (
                        subscriptions.slice(0, 5).map((subscription) => (
                            <SubscriptionHistoryItem
                                key={subscription.id}
                                subscription={subscription}
                            />
                        ))
                    ) : (
                        <StyledView className="bg-white rounded-lg p-8 items-center justify-center">
                            <StyledText className="text-gray-500 text-center">
                                No subscriptions yet. Start by adding one!
                            </StyledText>
                        </StyledView>
                    )}
                </StyledView>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Insights;