export const formatNumber = (number: number) => {
    return new Intl.NumberFormat().format(number)
}

export const truncateStringToWords = (input: string, wordLimit: number = 5) => {
    if (!input || typeof input !== "string") {
        return ""
    }

    const words = input.split(/\s+/)
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "..."
    }

    return input
}
