export function formatCurrency(value: number | string | null | undefined, currency: string = "AED"): string {
    const num = Number(value);

    if (!Number.isFinite(num)) {
        return `${currency} 0.00`;
    }

    try {
        return new Intl.NumberFormat("en-AE", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    } catch (error) {
        return `${currency} ${num.toFixed(2)}`;
    }
}