const article = require('./article');
const privateArticle = require('./privateArticlePage');

module.exports = {
	...article,
	...privateArticle,
}
