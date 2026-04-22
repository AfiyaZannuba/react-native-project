import { colors, spacing } from '@/constants/theme';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    Text
} from 'react-native';

interface FormButtonProps extends PressableProps {
    title: string;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
}

export const FormButton = React.forwardRef<Pressable, FormButtonProps>(
    (
        {
            title,
            isLoading = false,
            variant = 'primary',
            disabled,
            onPress,
            ...props
        },
        ref
    ) => {
        const isPrimary = variant === 'primary';
        const isDisabled = disabled || isLoading;

        return (
            <Pressable
                ref={ref}
                onPress={isDisabled ? undefined : onPress}
                disabled={isDisabled}
                style={({ pressed }) => ({
                    backgroundColor: isPrimary ? colors.primary : 'transparent',
                    borderWidth: isPrimary ? 0 : 2,
                    borderColor: isPrimary ? 'transparent' : colors.primary,
                    paddingVertical: spacing[3],
                    paddingHorizontal: spacing[4],
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 48,
                    opacity: pressed && !isDisabled ? 0.9 : isDisabled ? 0.5 : 1,
                })}
                accessibilityRole="button" as AccessibilityRole
                accessibilityLabel={title}
                accessibilityHint={isLoading ? 'Loading...' : undefined}
                accessibilityState={{ disabled: isDisabled }}
                {...props}
            >
                {isLoading ? (
                    <ActivityIndicator
                        color={isPrimary ? colors.background : colors.primary}
                        size="small"
                    />
                ) : (
                    <Text
                        className={isPrimary ? 'font-sans-semibold text-background' : 'font-sans-semibold text-primary'}
                        style={{ fontSize: 16 }}
                    >
                        {title}
                    </Text>
                )}
            </Pressable>
        );
    }
);

FormButton.displayName = 'FormButton';
