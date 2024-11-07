// Capitalize the first letter of a string
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate a random ID
function generateId(length = 8) {
	return Math.random().toString(36).substring(2, length + 2);
}

module.exports = { capitalize, generateId };
