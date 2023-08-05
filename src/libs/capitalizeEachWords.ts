export function capitalizeWords(str: string) {
    // Split the string into an array of words
    const words = str.split(" ");

    // Capitalize the first letter of each word
    const capitalizedWords = words.map((word) => {
        // Handle empty strings and single characters
        if (word.length <= 1) {
            return word.toUpperCase();
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    });

    // Join the capitalized words back into a single string
    return capitalizedWords.join(" ");
}
