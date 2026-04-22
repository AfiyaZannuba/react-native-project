import { colors, spacing } from '@/constants/theme';
import React from 'react';
import { Text, View } from 'react-native';

interface ErrorMessageProps {
    message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <View
            style={{
                backgroundColor: colors.destructive,
                borderRadius: 8,
                paddingVertical: spacing[2],
                paddingHorizontal: spacing[3],
                marginVertical: spacing[2],
            }}
        >
            <Text
                className="font-sans-regular text-background"
                style={{ fontSize: 14 }}
            >
                {message}
            </Text>
        </View>
    );
};
