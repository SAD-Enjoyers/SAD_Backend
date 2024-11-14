
async function clearRecoveryCode (user) {
	user.recovery_code = null;
	// user.generated_time = null; // stay for safty(backend fail) and statistics
	return user.save();
}

module.exports = { clearRecoveryCode };