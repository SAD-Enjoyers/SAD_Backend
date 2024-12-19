const { User, Transaction } = require('../../models');
const { success, error, convTransaction } = require('../../utils');

async function cardNumber(req, res){
	let user = await User.findOne({ where: { user_id: req.userName } });
	if(!user)
		return res.status(404).json(error("User not found.", 404));

	user.card_number = req.body.cardNumber;
	await user.save();
	res.status(200).json(success("Cardnumber added.", user.card_number));
};

async function wallet(req, res) {
	let user = await User.findOne({ where: { user_id: req.userName } });
	if(!user)
		return res.status(404).json(error("User not found.", 404));

	res.status(200).json(success("Wallet", { userId: req.userName, 
		balance: user.balance, cardNumber: user.card_number }));
}

async function transactions(req, res) {
	let user = await User.findOne({ where: { user_id: req.userName } });
	if(!user)
		return res.status(404).json(error("User not found.", 404));

	let transaction = await Transaction.findAll({ where: { user_id: req.userName } });
	transaction = transaction.map((trans) => convTransaction(trans));
	res.status(200).json(success("transactions", transaction));
}

async function deposit(req, res) {
	let user = await User.findOne({ where: { user_id: req.userName } });
	if(!user)
		return res.status(404).json(error("User not found.", 404));
	else if (!user.card_number)
		return res.status(403).json(error("CardNumber should be set first.", 403));

	if (user.balance != null)
		user.balance = parseFloat(user.balance) + req.body.amount;
	else
		user.balance = req.body.amount;
	const t = await Transaction.create({ user_id: req.userName, t_time: new Date(), t_type: '1', t_volume: req.body.amount });
	await user.save();
	res.status(200).json(success("Deposit was successful.", { balance: user.balance } ));
}

async function withdraw(req, res) {
	let user = await User.findOne({ where: { user_id: req.userName } });
	if(!user)
		return res.status(404).json(error("User not found.", 404));
	else if (!user.card_number)
		return res.status(403).json(error("CardNumber should be set first.", 403));

	if (req.body.amount >= parseFloat(user.balance))
		return res.status(403).json(error("Permission denied.", 403));

	user.balance = parseFloat(user.balance) - req.body.amount;
	const t = await Transaction.create({ user_id: req.userName, t_time: new Date(), t_type: '2', t_volume: req.body.amount });
	await user.save();
	res.status(200).json(success("Withdraw was successful.", { balance: user.balance } ));
}


module.exports = { withdraw, deposit, transactions, wallet, cardNumber };
