class ParserFunctions extends ParserBase {
	constructor() {
		super();
	}


	// Обычное объявление функции
	parseFunctionDeclaration() {}

	// Параметры функции
	parseFunctionParams() {}

	// Функция как выражение
	parseFunctionExpression() {}

	// Является ли выражение функцией
	isFunctionExpression() {
		return this.peek()?.type === 'fn';
	}
}
