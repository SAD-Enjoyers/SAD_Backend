const article = require('./article');
const privateArticle = require('./privateArticlePage');
const publicArticle = require('./publicArticlePage');

module.exports = {
	...exam,
	...privateExam,
	...publicExam,
}