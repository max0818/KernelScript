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
			this.pos++;

			const right = this.parseAssignment();

			return {
				type: 'Assignment',
				operator: operator,
				left: left,
				right: right
			};
		}

		return left;
	}

	// Тернарный оператор
	parseConditional() {
		const condition = this.parseOr();

		if (this.peek()?.type === '?') {
			this.pos++;
			const consequent = this.parseConditional();
			if (this.peek()?.type !== ':') this.error(`В строке ${this.peek()?.row} ожидался ":", но был получен: ${this.peek()?.value}`);
			this.pos++;
			const alternate = this.parseConditional();
			return {
				type: 'Ternary',
				condition: condition,
				consequent: consequent,
				alternate: alternate
			};
		}

		return condition;
	}

	// Логические операторы
	parseOr() {
		let left = this.parseAnd();

		while (!this.isEnd() && this.peek().type === 'or') {
			const operator = this.peek().value;
			this.pos++;

			const right = this.parseAnd();

			left = {
				type: 'Binary',
				operator: operator,
				left: left,
				right: right
			};
		}

		return left;
	}

	parseAnd() {
		let left = this.parseEquality();

		while (!this.isEnd() && this.peek().type === 'and') {
			const operator = this.peek().value;
			this.pos++;

			const right = this.parseEquality();

			left = {
				type: 'Binary',
				operator: operator,
				left: left,
				right: right
			};
		}

		return left;
	}

	// Сравнение
	parseEquality() {}

	parseComparison() {}

	// Арифметика
	parseAdditive() {}

	parseMultiplicative() {}

	// Возведение в степень
	parseExponentiation() {}

	// Унарные операторы
	parseUnary() {
		if (!this.isEnd() && ['not', '-', '++', '--', '~'].includes(this.peek().type)) {
			const operator = this.peek().value;
			this.pos++;

			const argument = this.parseUnary();

			return {
				type: 'Unary',
				operator: operator,
				argument: argument,
				prefix: true
			};
		}

		return this.parsePrimary();
	}

	// Первичные выражения
	parsePrimary() {
		const peek = this.peek();

		if (!peek) this.error('Неожиданный конец кода в строке ' + this.back().row);

		// Булевы, числа, строки и иные значения
		if (
			['bool', 'int', 'float', 'string'].includes(peek.type) ||
			['null', 'NaN', 'Infinity'].includes(peek.type)
		) {
			this.pos++;
			return {
				type: 'Literal',
				value: peek.value
			};
		}

		// Идентификатор
		if (peek.type === 'identifier') {
			this.pos++;
			return {
				type: 'Identifier',
				name: peek.value
			}
		}

		// This
		if (peek.type === 'this') {
			this.pos++;
			return {type: 'This'}
		}

		// Super
		if (peek.type === 'super') {
			this.pos++;
			return {type: 'Super'}
		}

		// Группа
		if (peek.type === '(') {
			this.pos++;

			const expr = this.parseExpression();
			if (this.peek()?.type !== ')') this.error('Ожидалось ) на строке ' + this.peek().row);

			this.pos++;

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
	parseCall() {}

	// Обращение к полю, или значению по индексу
	parseMember() {}

	// Массив
	parseArray() {}

	// Объект
	parseObject() {}

	// Скобки
	parseGroup() {}
}
