import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscriptions } from '@/contexts/SubscriptionContext';
import { styled } from "nativewind";
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const StyledTextInput = styled(TextInput);

const Subscriptions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { subscriptions, isLoading } = useSubscriptions();

    if (isLoading) return null;

    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter(sub =>
            sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.plan?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, subscriptions]);

    const toggleExpanded = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-5 pt-5 pb-5" showsVerticalScrollIndicator={false}>
                <View className="mb-5">
                    <Text className="text-lg font-bold text-foreground mb-3">Subscriptions</Text>
                    <StyledTextInput
                        className="bg-card text-foreground rounded-lg px-4 py-3 border border-border"
                        placeholder="Search subscriptions..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {filteredSubscriptions.length > 0 ? (
                    <View className="gap-3">
                        {filteredSubscriptions.map((subscription) => (
                            <SubscriptionCard
                                key={subscription.id}
                                {...subscription}
                                expanded={expandedId === subscription.id}
                                onPress={() => toggleExpanded(subscription.id)}
                            />
                        ))}
                    </View>
                ) : (
                    <View className="items-center justify-center py-10">
                        <Text className="text-foreground text-center">
                            No subscriptions found
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Subscriptions;