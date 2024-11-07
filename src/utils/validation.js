
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function isStrongPassword(password) {
	return password.length >= 8; // Add more complex checks as needed
}

module.exports = { isValidEmail, isStrongPassword };
