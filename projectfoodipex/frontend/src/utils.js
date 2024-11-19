// src/utils.js

// Function to format dates into a simple string format (e.g., "YYYY-MM-DD")
export const formatSimpleDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-CA', options); // Change locale as needed
};

// Function to filter data for tick moyenne
export const filteredDatatickMoyenTo = (data, condition) => {
    return data.filter(item => item.someProperty === condition); // Adjust logic based on your data structure
};

// Function to filter top guests
export const filteredTopGuestsTo = (data, limit) => {
    return data.sort((a, b) => b.guestCount - a.guestCount).slice(0, limit);
};

// Function to filter general data
export const filteredDataTo = (data, filterCriteria) => {
    return data.filter(item => item.category === filterCriteria); // Adjust logic based on your data structure
};

// Function to filter second set of data
export const filteredDataTo2 = (data, filterCriteria) => {
    return data.filter(item => item.anotherProperty === filterCriteria); // Adjust logic as needed
};

