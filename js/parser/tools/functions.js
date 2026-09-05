class ParserFunctions extends ParserBase {
	constructor() {
		super();
	}


	// Обычное объявление функции
	parseFunctionDeclaration() {
		this.expect('fn', 'fn');
		ParserPosManager.pos++;

		this.expectType('identifier');
		const id = this.peek().value;
		ParserPosManager.pos++;

		this.expect('(', '(');
		ParserPosManager.pos++;

		const params = this.parseFunctionParams();

		this.expect(')', ')');
		ParserPosManager.pos++;

		let returnType = 'any';
		if (this.peek()?.type === ':') {
			ParserPosManager.pos++;
			returnType = new ParserExpressions().parseTypeAnnotation();
		}

		const body = new ParserStatements().parseBlock();

		return {
			type: 'FunctionDeclaration',
			id,
			params,
			returnType,
			body
		};
	}

	// Параметры функции
	parseFunctionParams() {
		const params = [];

		if (this.peek()?.type === ')') return params;

		while (!this.isEnd() && this.peek()?.type !== ')') {
			let isRest = false;
			if (this.peek()?.type === '...') {
				isRest = true;
				ParserPosManager.pos++;
			}

			this.expectType('identifier');
			const name = this.peek().value;
			ParserPosManager.pos++;

			let typeAnnotation = 'any';
			if (this.peek()?.type === ':') {
				ParserPosManager.pos++;
				typeAnnotation = new ParserExpressions().parseTypeAnnotation();
			}

			let defaultValue = null;
			if (this.peek()?.type === '=') {
				ParserPosManager.pos++;
				defaultValue = new ParserExpressions().parseExpression();

				if (isRest) {
					this.error(`В строке ${this.peek()?.row} rest-параметр не может иметь значение по-умолчанию`);
				}
			}

			if (isRest && this.peek()?.type === ',') {
				this.error(`В строке ${this.peek()?.row} rest-параметр ${name} должен быть последним`);
			}

			params.push({
				type: 'Param',
				name,
				typeAnnotation,
				isRest
			});

			if (this.peek()?.type === ',') {
				ParserPosManager.pos++;
				continue;
			}

			this.expect(')', ')');

			break;
		}

		return params;
	}

	// Функция как выражение
	parseFunctionExpression() {}

	// Является ли выражение функцией
	isFunctionExpression() {
		return this.peek()?.type === 'fn';
	}
}
