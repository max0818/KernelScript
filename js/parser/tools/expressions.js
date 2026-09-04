class ParserExpressions extends ParserBase {
	constructor() {
		super();
	}


	// Точка входа
	parseExpression() {
		return this.parseAssignment();
	}

	// Присваивание
	parseAssignment() {
		const left = this.parseConditional();

		if (!this.isEnd() && ['=', '+=', '-=', '*=', '/=', '%=', '**='].includes(this.peek().type)) {
			const operator = this.peek().value;
			ParserPosManager.pos++;

			const right = this.parseAssignment();

			return {
				type: 'AssignmentExpression',
				operator,
				left,
				right
			};
		}

		return left;
	}

	// Тернарный оператор
	parseConditional() {
		const condition = this.parseOr();

		if (this.peek()?.type === '?') {
			ParserPosManager.pos++;
			const consequent = this.parseConditional();
			if (this.peek()?.type !== ':') this.error(`В строке ${this.peek()?.row} ожидался ":", но был получен: ${this.peek()?.value}`);
			ParserPosManager.pos++;
			const alternate = this.parseConditional();
			return {
				type: 'TernaryExpression',
				condition,
				consequent,
				alternate
			};
		}

		return condition;
	}

	// Логические операторы
	parseOr() {
		let left = this.parseAnd();

		while (!this.isEnd() && this.peek().type === 'or') {
			const operator = this.peek().value;
			ParserPosManager.pos++;

			const right = this.parseAnd();

			left = {
				type: 'BinaryExpression',
				operator,
				left,
				right
			};
		}

		return left;
	}

	parseAnd() {
		let left = this.parseEquality();

		while (!this.isEnd() && this.peek().type === 'and') {
			const operator = this.peek().value;
			ParserPosManager.pos++;

			const right = this.parseEquality();

			left = {
				type: 'BinaryExpression',
				operator,
				left,
				right
			};
		}

		return left;
	}

	// Сравнение
	parseEquality() {
		let left = this.parseComparison();

		while (!this.isEnd() && ['==', '!='].includes(this.peek().type)) {
			const operator = this.peek()?.value;
			ParserPosManager.pos++;

			const right = this.parseComparison();

			left = {
				type: 'BinaryExpression',
				operator,
				left,
				right
			};
		}

		return left;
	}

	parseComparison() {
		let left = this.parseAdditive();

		while (!this.isEnd() && ['<', '>', '<=', '>='].includes(this.peek().type)) {
			const operator = this.peek()?.value;
			ParserPosManager.pos++;

			const right = this.parseAdditive();

			left = {
				type: 'BinaryExpression',
				operator,
				left,
				right
			};
		}

		return left;
	}

	// Арифметика
	parseAdditive() {
		let left = this.parseMultiplicative();

		while (!this.isEnd() && ['+', '-'].includes(this.peek().type)) {
			const operator = this.peek().value;
			ParserPosManager.pos++;

			const right = this.parseMultiplicative();

			left = {
				type: 'BinaryExpression',
				operator,
				left,
				right
			};
		}

		return left;
	}

	parseMultiplicative() {
		let left = this.parseExponentiation();

		while (!this.isEnd() && ['*', '/', '%'].includes(this.peek().type)) {
			const operator = this.peek().value;
			ParserPosManager.pos++;

			const right = this.parseExponentiation();

			left = {
				type: 'BinaryExpression',
				operator,
				left,
				right
			};
		}

		return left;
	}

	// Возведение в степень
	parseExponentiation() {
		let left = this.parseUnary();

		while (!this.isEnd() && this.peek().type === '**') {
			const operator = this.peek().value;
			ParserPosManager.pos++;

			const right = this.parseExponentiation();

			return {
				type: 'BinaryExpression',
				operator,
				left,
				right
			};
		}

		return left;
	}

	// Унарные операторы
	parseUnary() {
		if (!this.isEnd() && ['not', '-', '++', '--', '~'].includes(this.peek().type)) {
			const operator = this.peek().value;
			ParserPosManager.pos++;

			const argument = this.parseUnary();

			return {
				type: 'UnaryExpression',
				operator,
				argument,
				prefix: true
			};
		}

		return this.parsePrimary();
	}

	// Первичные выражения
	parsePrimary() {
		const peek = this.peek();

		if (!peek) this.error('Неожиданный конец кода в строке ' + this.back()?.row);

		// Булевы, числа, строки и иные значения
		if (
			['bool', 'int', 'float', 'string'].includes(peek.type) ||
			['null', 'NaN', 'Infinity'].includes(peek.type)
		) {
			ParserPosManager.pos++;
			return {
				type: 'Literal',
				value: peek.value
			};
		}

		// Идентификатор
		if (peek.type === 'identifier') {
			const name = peek.value;

			ParserPosManager.pos++;

			const expr = {type: 'Identifier', name};

			return this.parseCall(expr);
		}

		// This
		if (peek.type === 'this') {
			ParserPosManager.pos++;
			return {type: 'ThisExpression'}
		}

		// Super
		if (peek.type === 'super') {
			ParserPosManager.pos++;
			return {type: 'SuperExpression'}
		}

		// Группа
		if (peek.type === '(') {
			ParserPosManager.pos++;

			const expr = this.parseExpression();
			if (this.peek()?.type !== ')') this.error('Ожидалось ) на строке ' + this.peek().row);

			ParserPosManager.pos++;

			return expr;
		}

		// Массив
		if (peek.type === '[') {
			return this.parseArray();
		}

		// Объект
		if (peek.type === '{') {
			return this.parseObject();
		}

		this.error(`Неожиданный токен на строке ${peek.row}: ${peek.value} (${peek.type})`);
	}


	// Вспомогательные методы

	// Вызов функции
	parseCall(expr) {
		while (!this.isEnd()) {
			const peek = this.peek();

			// Вызова функции
			if (peek.type === '(') {
				ParserPosManager.pos++;

				const args = [];
				if (this.peek()?.type !== ')') {
					while (!this.isEnd()) {
						args.push(this.parseExponentiation());

						if (this.peek()?.type === ',') {
							ParserPosManager.pos++;
							continue;
						}

						break;
					}
				}

				if (this.peek()?.type !== ')') {
					this.error(`В строке ${this.peek()?.row} ожидалось ")", но был получен: ${this.peek()?.value}`);
				}
				ParserPosManager.pos++;

				expr = {
					type: 'CallExpression',
					callee: expr,
					arguments: args
				};
				continue;
			}

			// Обращение к полям объектов
			if (peek.type === '.') {
				ParserPosManager.pos++;

				const prop = this.peek();
				if (prop.type !== 'identifier') {
					this.error(`В строке ${prop?.row} ожидалось имя свойства, но был получен: ${prop?.value}`);
				}
				ParserPosManager.pos++;

				expr = {
					type: 'MemberExpression',
					object: expr,
					property: {
						type: 'Identifier',
						name: prop.value
					},
					computed: false
				};
				continue;
			}

			// Обращение по индексу к массивам
			if (peek.type === '[') {
				ParserPosManager.pos++;

				const index = this.parseExpression();
				if (this.peek()?.type !== ']') {
					this.error(`В строке ${this.peek()?.row} ожидалось "]", но был получен: ${this.peek()?.value}`);
				}
				ParserPosManager.pos++;

				expr = {
					type: 'MemberExpression',
					object: expr,
					property: index,
					computed: true
				};
				continue;
			}

			break;
		}

		return expr;
	}

	// Обращение к полю, или значению по индексу
	parseMember() {}

	// Массив
	parseArray() {}

	// Объект
	parseObject() {}

	// Скобки
	parseGroup() {}
}
