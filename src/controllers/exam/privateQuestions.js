const { EducationalService, SelectedQuestions, Question, } = require('../../models');
const { success, error, convExamQuestions } = require('../../utils');
const { sequelize, logger } = require('../../configs');


async function privateQuestions(req, res) {
	const { serviceId } = req.params;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });	

	if (service.service_type != '1')
		return res.status(303).json(error('See other services.', 303));

	if (service.user_id != req.userName)
		return res.status(403).json(error('Permission denied.', 403));

	const selectedQuestions = await SelectedQuestions.findAll({ where: { service_id: serviceId },
		include: [
			{
				model: Question,
				attributes: [
					'question_id', 'question_name', 'question_text', 'o1', 'o2', 'o3', 'o4',
					'right_answer', 'score', 'number_of_voters', 'visibility',
					'tag1', 'tag2', 'tag3', 'user_id',
				],
			},
		],
		order: [['sort_number', 'ASC']],
	});

	selectedQuestions.map((item) => ({
		sortNumber: item.sort_number,
		...item.Question.toJSON(),
	}));

	return res.status(200).json(success('questions', selectedQuestions));
}

async function addQuestion(req, res) {
	const { serviceId, questionId } = req.body;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });	

	if (service.service_type != '1')
		return res.status(303).json(error('See other services.', 303));

	if (service.user_id != req.userName)
		return res.status(403).json(error('Permission denied.', 403));

	let question = await Question.findOne({ where: { question_id: req.body.questionId } });

	if (question.user_id != req.userName && !question.visibility)
		return res.status(403).json(error('Question cannot be select.', 403));

	const isThere = await SelectedQuestions.findOne({ where: 
		{ service_id: serviceId, question_id: questionId } });

	if (isThere)
		return res.status(400).json(error('The question has already been selected.', 400));

	const questionCount = await SelectedQuestions.count({ where: { service_id: serviceId } });
	const newquestion = await SelectedQuestions.create(
		{ service_id: serviceId, question_id: questionId, sort_number: questionCount+1 });

	res.status(201).json(success('Question added.', { serviceId: newquestion.service_id, 
		questionId: newquestion.question_id, sortNumber: newquestion.sort_number}));
}

async function deleteQuestion(req, res) {
	const { serviceId, questionId, sortNumber } = req.body;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });

	if (service.service_type != '1')
		return res.status(303).json(error('See other services.', 303));

	if (service.user_id != req.userName)
		return res.status(403).json(error('Permission denied.', 403));

	const transaction = await sequelize.transaction();
	try{
		const deleted = await SelectedQuestions.destroy({
			where: { service_id: serviceId, question_id: questionId, sort_number: sortNumber },
		}, { transaction });

		if (!deleted){
			await transaction.commit();
			return res.status(404).json(error('Question not found in the selected list.', 404));
		}

		await SelectedQuestions.update(
			{ sort_number: sequelize.literal('sort_number - 1') },
			{
				where: {
					service_id: serviceId,
					sort_number: { [Op.gt]: sortNumber },
				},
			},
		{ transaction }); // should move transaction to where?
		await transaction.commit();

		res.status(200).json(success('Question deleted and sort numbers updated successfully.', 200));
	} catch (err) {
		await transaction.rollback(); // have bugs deleted question not backed. 

		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Error deleting question.', 500));
	}
}

async function reorderQuestions(req, res) {
	const { serviceId, reorderedQuestions } = req.body;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });	

	if (service.service_type != '1')
		return res.status(303).json(error('See other services.', 303));

	if (service.user_id != req.userName)
		return res.status(403).json(error('Permission denied.', 403));

	const currentQuestions = await SelectedQuestions.findAll({
		where: { service_id: serviceId }
	});

	// if check for also new sort number is good
	const currentQuestionIds = currentQuestions.map((q) => q.question_id);
	const inputQuestionIds = reorderedQuestions.map((q) => q.questionId);
	if (
		currentQuestionIds.length !== inputQuestionIds.length || // Check for missing/extra questions
		!currentQuestionIds.every((id) => inputQuestionIds.includes(id)) // Check for mismatched IDs
	)
		return res.status(400).json(error('The provided questions do not match the selected questions for the course.', 400));

	const transaction = await SelectedQuestions.sequelize.transaction();
	try {
		await Promise.all(
			reorderedQuestions.map((q) =>
				SelectedQuestions.update(
					{ sort_number: q.sortNumber },
					{
						where: { service_id: serviceId, question_id: q.questionId },
						transaction,
					}
				)
			)
		);
		await transaction.commit();
		res.status(204).json(success('Selected questions reordered successfully.'));

	} catch (err) {
		await transaction.rollback();
		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Failed to reorder selected questions.', 500));
	}
}


module.exports = { privateQuestions, addQuestion, deleteQuestion, reorderQuestions, };
