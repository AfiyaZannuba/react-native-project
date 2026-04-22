import { colors, spacing } from '@/constants/theme';
import '@/global.css';
import { useAuth, useClerk, useUser } from '@clerk/expo';
import { router } from 'expo-router';
import { styled } from 'nativewind';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledSafeAreaView = styled(SafeAreaView);

const SettingsScreen = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const { isSignedIn } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    onPress: async () => {
                        setIsLoggingOut(true);
                        try {
                            await signOut();
                            // ClerkProvider will automatically redirect to auth screen
                            router.replace('/(auth)/signin');
                        } catch (err) {
                            Alert.alert('Error', 'Failed to sign out. Please try again.');
                            setIsLoggingOut(false);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    if (!isSignedIn || !user) {
        return (
            <StyledSafeAreaView className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator color={colors.primary} size="large" />
            </StyledSafeAreaView>
        );
    }

    return (
        <StyledSafeAreaView className="flex-1 bg-background">
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: spacing[4],
                    paddingTop: spacing[4],
                    paddingBottom: spacing[8],
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ gap: spacing[6] }}>
                    {/* Header */}
                    <View style={{ gap: spacing[2] }}>
                        <Text
                            className="font-sans-bold text-foreground"
                            style={{ fontSize: 32 }}
                        >
                            Settings
                        </Text>
                    </View>

                    {/* Account Section */}
                    <View style={{ gap: spacing[3] }}>
                        <Text
                            className="font-sans-semibold text-foreground"
                            style={{ fontSize: 16, textTransform: 'uppercase' }}
                        >
                            Account
                        </Text>

                        {/* User Info Card */}
                        <SettingCard>
                            <View style={{ gap: spacing[2] }}>
                                <Text
                                    className="font-sans-regular text-muted-foreground"
                                    style={{ fontSize: 12 }}
                                >
                                    Email Address
                                </Text>
                                <Text
                                    className="font-sans-semibold text-foreground"
                                    style={{ fontSize: 16 }}
                                >
                                    {user.emailAddresses[0]?.emailAddress || 'Not available'}
                                </Text>
                            </View>
                        </SettingCard>

                        {/* Account Created */}
                        {user.createdAt && (
                            <SettingCard>
                                <View style={{ gap: spacing[2] }}>
                                    <Text
                                        className="font-sans-regular text-muted-foreground"
                                        style={{ fontSize: 12 }}
                                    >
                                        Account Created
                                    </Text>
                                    <Text
                                        className="font-sans-semibold text-foreground"
                                        style={{ fontSize: 16 }}
                                    >
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </Text>
                                </View>
                            </SettingCard>
                        )}
                    </View>

                    {/* Logout Section */}
                    <View style={{ gap: spacing[3] }}>

                        {/* Logout Button */}
                        <Pressable
                            onPress={handleLogout}
                            disabled={isLoggingOut}
                            style={({ pressed }) => [
                                {
                                    backgroundColor: colors.destructive,
                                    borderRadius: 12,
                                    paddingVertical: spacing[3],
                                    paddingHorizontal: spacing[4],
                                    opacity: pressed ? 0.9 : isLoggingOut ? 0.6 : 1,
                                    minHeight: 48,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                            ]}
                        >
                            {isLoggingOut ? (
                                <ActivityIndicator color={colors.background} />
                            ) : (
                                <Text
                                    className="font-sans-semibold text-background"
                                    style={{ fontSize: 16 }}
                                >
                                    Sign Out
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </StyledSafeAreaView>
    );
};

/**
 * Reusable SettingCard component
 */
const SettingCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <View
            style={[
                {
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    paddingVertical: spacing[4],
                    paddingHorizontal: spacing[4],
                    borderWidth: 1,
                    borderColor: colors.border,
                },
            ]}
        >
            {children}
        </View>
    );
};

export default SettingsScreen;