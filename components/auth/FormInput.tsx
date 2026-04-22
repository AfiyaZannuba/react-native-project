import { colors, spacing } from '@/constants/theme';
import React from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    View
} from 'react-native';

interface FormInputProps extends TextInputProps {
    label?: string;
    error?: string;
    isLoading?: boolean;
    accessibilityLabel?: string;
}

export const FormInput = React.forwardRef<TextInput, FormInputProps>(
    (
        {
            label,
            error,
            isLoading,
            accessibilityLabel,
            editable = true,
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
                    style={{
                        borderWidth: 1,
                        borderColor: error ? colors.destructive : colors.border,
                        borderRadius: 12,
                        paddingVertical: spacing[3],
                        paddingHorizontal: spacing[4],
                        fontSize: 16,
                        backgroundColor: colors.card,
                        color: colors.foreground,
                        fontFamily: 'sans-regular',
                        opacity: isLoading ? 0.6 : 1,
                    }}
                    accessibilityRole="text" as AccessibilityRole
                    accessibilityLabel={accessibilityLabel || label}
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

FormInput.displayName = 'FormInput';
