
function randomPassword() {
	let ans = Math.random().toString(36).slice(2) +
			Math.random().toString(36)
			.toUpperCase().slice(2);
	return ans;
}

module.exports = { randomPassword };
