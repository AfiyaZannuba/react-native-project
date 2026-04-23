import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);

const CATEGORIES = [
    "Entertainment",
    "AI Tools",
    "Developer Tools",
    "Design",
    "Productivity",
    "Cloud",
    "Music",
    "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
    "AI Tools": "#b8d4e3",
    Design: "#f5c542",
    "Developer Tools": "#e8def8",
    Entertainment: "#b8e8d0",
    Productivity: "#ffd1a3",
    Cloud: "#d4c9ff",
    Music: "#ffb3d9",
    Other: "#d3d3d3",
};

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onCreateSubscription: (subscription: Subscription) => void;
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
    visible,
    onClose,
    onCreateSubscription,
}) => {
    const posthog = usePostHog();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
    const [category, setCategory] = useState("Entertainment");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!price.trim()) {
            newErrors.price = "Price is required";
        } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            newErrors.price = "Price must be a positive number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const now = dayjs();
        const renewalDate =
            frequency === "Monthly" ? now.add(1, "month") : now.add(1, "year");

        const newSubscription: Subscription = {
            id: `subscription-${Date.now()}`,
            name: name.trim(),
            price: parseFloat(price),
            currency: "USD",
            icon: icons.plus,
            category: category,
            billing: frequency,
            plan: category,
            status: "active",
            startDate: now.toISOString(),
            renewalDate: renewalDate.toISOString(),
            color: CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"],
        };

        posthog.capture('subscription_created', {
            subscription_name: name.trim(),
            subscription_price: parseFloat(price),
            subscription_frequency: frequency,
            subscription_category: category,
        });

        onCreateSubscription(newSubscription);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory("Entertainment");
        setErrors({});
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <StyledPressable
                    className="modal-overlay"
                    onPress={onClose}
                />

                <View className="modal-container">
                    <View className="modal-header">
                        <Text className="modal-title">New Subscription</Text>
                        <StyledPressable className="modal-close" onPress={onClose}>
                            <Text className="modal-close-text">×</Text>
                        </StyledPressable>
                    </View>

                    <ScrollView
                        className="modal-body"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Name Field */}
                        <View className="auth-field">
                            <Text className="auth-label">Subscription Name</Text>
                            <StyledTextInput
                                className={clsx(
                                    "auth-input",
                                    errors.name && "auth-input-error"
                                )}
                                placeholder="e.g., Netflix"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                            />
                            {errors.name && <Text className="auth-error">{errors.name}</Text>}
                        </View>

                        {/* Price Field */}
                        <View className="auth-field">
                            <Text className="auth-label">Price</Text>
                            <StyledTextInput
                                className={clsx(
                                    "auth-input",
                                    errors.price && "auth-input-error"
                                )}
                                placeholder="9.99"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="decimal-pad"
                                placeholderTextColor="rgba(0, 0, 0, 0.4)"
                            />
                            {errors.price && (
                                <Text className="auth-error">{errors.price}</Text>
                            )}
                        </View>

                        {/* Frequency Toggle */}
                        <View className="auth-field">
                            <Text className="auth-label">Billing Frequency</Text>
                            <View className="picker-row">
                                {(["Monthly", "Yearly"] as const).map((freq) => (
                                    <StyledPressable
                                        key={freq}
                                        className={clsx(
                                            "picker-option",
                                            frequency === freq && "picker-option-active"
                                        )}
                                        onPress={() => setFrequency(freq)}
                                    >
                                        <Text
                                            className={clsx(
                                                "picker-option-text",
                                                frequency === freq && "picker-option-text-active"
                                            )}
                                        >
                                            {freq}
                                        </Text>
                                    </StyledPressable>
                                ))}
                            </View>
                        </View>

                        {/* Category Chips */}
                        <View className="auth-field">
                            <Text className="auth-label">Category</Text>
                            <View className="category-scroll">
                                {CATEGORIES.map((cat) => (
                                    <StyledPressable
                                        key={cat}
                                        className={clsx(
                                            "category-chip",
                                            category === cat && "category-chip-active"
                                        )}
                                        onPress={() => setCategory(cat)}
                                    >
                                        <Text
                                            className={clsx(
                                                "category-chip-text",
                                                category === cat && "category-chip-text-active"
                                            )}
                                        >
                                            {cat}
                                        </Text>
                                    </StyledPressable>
                                ))}
                            </View>
                        </View>

                        {/* Submit Button */}
                        <StyledPressable
                            className={clsx(
                                "auth-button",
                                !name.trim() || !price.trim() ? "auth-button-disabled" : ""
                            )}
                            onPress={handleSubmit}
                            disabled={!name.trim() || !price.trim()}
                        >
                            <Text className="auth-button-text">Create Subscription</Text>
                        </StyledPressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CreateSubscriptionModal;
