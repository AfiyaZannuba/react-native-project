import { HOME_SUBSCRIPTIONS } from '@/constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SubscriptionContextType {
    subscriptions: Subscription[];
    addSubscription: (subscription: Subscription) => void;
    isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);
const STORAGE_KEY = 'subscriptions';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);
    const [isLoading, setIsLoading] = useState(true);

    // Load subscriptions from storage on mount
    useEffect(() => {
        const loadSubscriptions = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved) {
                    setSubscriptions(JSON.parse(saved));
                }
            } catch (error) {
                console.error('Failed to load subscriptions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSubscriptions();
    }, []);

    // Save subscriptions to storage whenever they change
    useEffect(() => {
        if (!isLoading) {
            const saveSubscriptions = async () => {
                try {
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
                } catch (error) {
                    console.error('Failed to save subscriptions:', error);
                }
            };

            saveSubscriptions();
        }
    }, [subscriptions, isLoading]);

    const addSubscription = (subscription: Subscription) => {
        setSubscriptions([subscription, ...subscriptions]);
    };

    return (
        <SubscriptionContext.Provider value={{ subscriptions, addSubscription, isLoading }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscriptions() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscriptions must be used within SubscriptionProvider');
    }
    return context;
}

export { SubscriptionContext, type SubscriptionContextType };

