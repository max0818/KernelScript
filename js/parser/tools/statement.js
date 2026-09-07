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
			if (this.isObject()) {
				const expr = new ParserExpressions().parseObject();

				return {
					type: 'ExpressionStatement',
					expression: expr
				};
			} else return this.parseBlock();
		}

		// Условный оператор if-else
		if (peek === 'if') {
			return new ParserControls().parseIfStatement();
		}

		// Условный оператор match-case
		if (peek === 'match') {
			return new ParserControls().parseMatchStatement();
		}

		// Цикл while
		if (peek === 'while') {
			return new ParserControls().parseWhileStatement();
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
			return new ParserFunctions().parseFunctionDeclaration();
		}

		// Инструкция return
		if (peek === 'return') {
			return this.parseReturnStatement();
		}

		if (peek === 'class') {
			return new ParserClasses().parseClassDeclaration();
		}

		// Флаг
		if (peek === 'flag') {
			return new ParserControls().parseFlagDeclaration();
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

		if (this.peek()?.type !== 'identifier') this.errorString('имя переменной');
		const id = this.peek().value;
		ParserPosManager.pos++;

		let typeAnnotation = {
			type: 'TypeAnnotation',
			name: 'any',
			subNames: []
		};

		if (this.peek()?.type === ':') {
			ParserPosManager.pos++;
			typeAnnotation = new ParserExpressions().parseTypeAnnotation();
		}

		let init = 'null';
		if (this.peek()?.type === '=') {
			ParserPosManager.pos++;
			init = new ParserExpressions().parseExpression();
		}

		return {
			type: 'VariableDeclaration',
			kind,
			id,
			typeAnnotation,
			init
		};
	}

	// Является ли блок кода объектом
	isObject() {
		this.expect('{', '{');

		const peek = this.next();

		if (peek.type === '}') return true;

		if (peek.type === 'identifier' || peek.type === 'string') {
			ParserPosManager.pos++;

			const next = this.next();
			ParserPosManager.pos--;

			return next?.type === ':';
		}

		return false;
	}

	// Блок кода
	parseBlock() {
		this.expect('{', '{');

		ParserPosManager.pos++;

		const body = [];

		while (!this.isEnd() && this.peek()?.type !== '}') {
			while (this.peek()?.type === ';') ParserPosManager.pos++;

			if (this.peek()?.type === '}') break;

			const stmt = this.parseStatement();
			body.push(stmt);
		}

		this.expect('}', '}');

		ParserPosManager.pos++;

		return {
			type: 'BlockStatement',
			body
		};
	}

	// Continue
	parseContinueStatement() {
		this.expectType('continue');

		ParserPosManager.pos++;

		if (this.peek()?.type === ';') ParserPosManager.pos++;

		return {type: 'ContinueStatement'};
	}

	// Break
	parseBreakStatement() {
		this.expectType('break');

		ParserPosManager.pos++;

		if (this.peek()?.type === ';') ParserPosManager.pos++;

		return {type: 'BreakStatement'};
	}

	// Возврат функции или метода
	parseReturnStatement() {
		this.expectType('return');

		ParserPosManager.pos++;

		let argument = 'null';
		if ([';', '}'].includes(this.peek()?.type)) {
			argument = new ParserExpressions().parseExpression();
		}

		if (this.peek()?.type === ';') ParserPosManager.pos++;

		return {
			type: 'ReturnStatement',
			argument
		};
	}
}
