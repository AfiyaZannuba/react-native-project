import { colors, spacing } from '@/constants/theme';
import React from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    View
} from 'react-native';

interface VerificationCodeInputProps extends TextInputProps {
    label?: string;
    error?: string;
    isLoading?: boolean;
    accessibilityLabel?: string;
}

export const VerificationCodeInput = React.forwardRef<
    TextInput,
    VerificationCodeInputProps
>(
    (
        {
            label,
            error,
            isLoading,
            accessibilityLabel,
            editable = true,
            maxLength = 6,
            ...props
        },
        ref
    ) => {
        return (
            <View style={{ gap: spacing[2] }}>
                {label && (
                    <Text
                        className="font-sans-semibold text-foreground"
                        style={{ fontSize: 14 }}
                    >
                        {label}
                    </Text>
                )}
                <TextInput
                    ref={ref}
                    editable={editable && !isLoading}
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    keyboardType="number-pad"
                    maxLength={maxLength}
                    style={{
                        borderWidth: 2,
                        borderColor: error ? colors.destructive : colors.accent,
                        borderRadius: 12,
                        paddingVertical: spacing[4],
                        paddingHorizontal: spacing[4],
                        fontSize: 24,
                        backgroundColor: colors.card,
                        color: colors.foreground,
                        fontFamily: 'sans-bold',
                        letterSpacing: 4,
                        textAlign: 'center',
                        opacity: isLoading ? 0.6 : 1,
                    }}
                    accessibilityRole="text" as AccessibilityRole
                    accessibilityLabel={accessibilityLabel || 'Verification code input'}
                    {...props}
                />
                {error && (
                    <Text
                        className="font-sans-regular"
                        style={{
                            fontSize: 13,
                            color: colors.destructive,
                            marginTop: -spacing[1],
                        }}
                    >
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

VerificationCodeInput.displayName = 'VerificationCodeInput';
