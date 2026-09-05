class ParserStatements extends ParserBase {
	constructor() {
		super();
	}


	// Точка входа
	parseStatement() {
		while (this.peek()?.type === ';') {
			ParserPosManager.pos++;
		}

		const peek = this.peek()?.type;

		// Переменная или константа
		if (peek === 'var' || peek === 'const') {
			return this.parseVarDeclaration();
		}

		// Блок
		if (peek === '{') {
			return this.parseBlock();
		}

		// Условный оператор if-else
		if (peek === 'if') {
			return this.parseIfStatement();
		}

		// Условный оператор match-case
		if (peek === 'match') {
			return this.parseMatchStatement();
		}

		// Цикл while
		if (peek === 'while') {
			return this.parseWhileStatement();
		}

		// Инструкция continue
		if (peek === 'continue') {
			return this.parseContinueStatement();
		}

		// Инструкция break
		if (peek === 'break') {
			return this.parseBreakStatement();
		}

		// Функция
		if (peek === 'fn') {
			return this.parseFunctionStatement();
		}

		// Инструкция return
		if (peek === 'return') {
			return this.parseReturnStatement();
		}

		// Флаг
		if (peek === 'flag') {
			return this.parseFlagDeclaration();
		}

		const expr = new ParserExpressions().parseExpression();

		if (this.peek()?.type === ';') {
			ParserPosManager.pos++;
		}

		return {
			type: 'ExpressionStatement',
			expression: expr
		};
	}

	// Переменная или константа
	parseVarDeclaration() {
		const kind = this.peek().type;
		ParserPosManager.pos++;

		if (this.peek()?.type !== 'identifier') {
			this.error(`В строке`)
		}
	}
}
