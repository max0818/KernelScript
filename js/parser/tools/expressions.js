class ParserExpressions extends ParserBase {
	static COMPOUND_TYPES = ['array', 'object'];
	static FUNCTION_TYPES = ['function'];
	static SIMPLE_TYPES = ['any', 'bool', 'int', 'float', 'string'];

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
			this.expect(':', ':');
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
			const operator = this.peek();
			ParserPosManager.pos++;

			const argument = this.parseUnary();

			if (
				argument?.type === 'UnaryExpression' &&
				['++', '--'].includes(operator?.type)
			) {
				this.error(`В строке ${operator?.row} нельзя применять префиксный оператор ${operator?.value}`);
			}

			return {
				type: 'UnaryExpression',
				operator: operator.value,
				argument,
				prefix: true
			};
		}

		return this.parsePrimary();
	}

	// Первичные выражения
	parsePrimary() {
		const peek = this.peek();

		if (!peek) {
			this.error('Неожиданный конец кода в строке ' + this.back()?.row);
		}

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
			ParserPosManager.pos++;
			const expr = {type: 'Identifier', name: peek.value};
			return this.parseCall(expr);
		}

		// This
		if (peek.type === 'this') {
			ParserPosManager.pos++;
			return this.parseCall({type: 'ThisExpression'});
		}

		// Super
		if (peek.type === 'super') {
			ParserPosManager.pos++;
			return this.parseCall({type: 'SuperExpression'});
		}

		// Группа
		if (peek.type === '(') {
			const expr = this.parseGroup();
			return this.parseCall(expr);
		}

		// Массив
		if (peek.type === '[') {
			const expr = this.parseArray();
			return this.parseCall(expr);
		}

		// Объект
		if (peek.type === '{') {
			const expr = this.parseObject();
			return this.parseCall(expr);
		}

		// Создание экземпляра класса
		if (peek.type === 'new') {
			return this.parseNew();
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
						args.push(this.parseExpression());

						if (this.peek()?.type === ',') {
							ParserPosManager.pos++;
							continue;
						}

						break;
					}
				}

				this.expect(')', ')');
				ParserPosManager.pos++;

				expr = {
					type: 'CallExpression',
					callee: expr,
					arguments: args
				};

				continue;
			}

			// Обращение к свойству или элементу
			if (['.', '['].includes(peek.type)) {
				expr = this.parseMember(expr);
				continue;
			}

			if (['++', '--'].includes(peek.type)) {
				if (expr.type === 'UnaryExpression' && ['++', '--'].includes(expr.type)) {
					this.error(`В строке ${peek.row} нельзя применить постфиксный оператор ${peek.value}`);
				}

				if (!['Identifier', 'MemberExpression', 'ThisExpression'].includes(expr.type)) {
					this.error(`В строке ${peek.row} постфиксный оператор ${peek.value} можно применить лишь к переменным или свойствам`);
				}

				const operator = peek.value;
				ParserPosManager.pos++;

				return {
					type: 'UnaryExpression',
					operator,
					arguments: expr,
					prefix: false
				};
			}

			break;
		}

		return expr;
	}

	// Обращение к свойству или элементу
	parseMember(expr) {
		const peek = this.peek();

		// Поля и объекты
		if (peek.type === '.') {
			ParserPosManager.pos++;

			const prop = this.peek();
			this.expectType('identifier');
			ParserPosManager.pos++;

			return {
				type: 'MemberExpression',
				object: expr,
				property: {
					type: 'Identifier',
					name: prop.value
				},
				computed: false
			};
		}

		// Значения и массивы
		if (peek.type === '[') {
			ParserPosManager.pos++;

			const index = this.parseExpression();
			this.expect(']', ']');
			ParserPosManager.pos++;

			return {
				type: 'MemberExpression',
				object: expr,
				property: index,
				computed: true
			};
		}

		this.expect(']', ']');
	}

	// Массив
	parseArray() {
		this.expect('[', '[');

		ParserPosManager.pos++;

		const elements = [];

		if (this.peek()?.type !== ']') {
			while (!this.isEnd()) {
				if (this.peek()?.type === ']') break;

				const element = this.parseExpression();
				elements.push(element);

				if (this.peek()?.type === ',') {
					ParserPosManager.pos++;
					continue;
				}

				break;
			}
		}

		this.expect(']', ']');

		ParserPosManager.pos++;

		return {type: 'ArrayExpression', elements};
	}

	// Объект
	parseObject() {
		this.expect('{', '{');

		ParserPosManager.pos++;

		const properties = [];

		if (this.peek()?.type !== '}') {
			while (!this.isEnd()) {
				if (this.peek()?.type === '}') break;

				const peek = this.peek();
				this.expectType('identifier', 'string');

				const key = peek.value;
				ParserPosManager.pos++;

				this.expect(':', ':');
				ParserPosManager.pos++;

				const value = this.parseExpression();

				properties.push({
					type: 'ObjectProperty',
					key,
					value
				});

				if (this.peek()?.type === ',') {
					ParserPosManager.pos++;
					continue;
				}

				break;
			}
		}

		this.expect('}', '}');

		ParserPosManager.pos++;

		return {
			type: 'ObjectExpression',
			properties
		};
	}

	// Скобки
	parseGroup() {
		this.expect('(', '(');
		ParserPosManager.pos++;

		const expr = this.parseExpression();
		this.expect(')', ')');

		ParserPosManager.pos++;

		return this.parseCall(expr);
	}

	// Создание экземпляров классов
	parseNew() {
		this.expect('new', 'new');
		ParserPosManager.pos++;

		const callee = {type: 'NewExpression', name: this.peek()?.value};

		ParserPosManager.pos++;

		this.expect('(', '(');

		return this.parseCall(callee);
	}

	// Работа с типами
	parseTypeAnnotation() {
		const peek = this.peek();

		this.expectType('type');

		const name = peek.value;
		ParserPosManager.pos++;

		const subNames = [];

		if (this.peek()?.type === '<') {
			if (
				!ParserExpressions.COMPOUND_TYPES.includes(name) &&
				!ParserExpressions.FUNCTION_TYPES.includes(name)
			) {
				this.error(`В строке ${this.peek()?.row} тип ${name} не может быть составным`);
			}

			ParserPosManager.pos++;

			while (!this.isEnd() && this.peek()?.type !== '>') {
				const token = this.peek();

				this.expectType('type');

				subNames.push(token.value);
				ParserPosManager.pos++;

				if (this.peek()?.type === ',') {
					ParserPosManager.pos++;
					continue;
				}

				this.expect('>', '>');

				break;
			}

			this.expect('>', '>');

			if (ParserExpressions.FUNCTION_TYPES.includes(name) && subNames.length > 1) {
				this.error(`В строке ${this.peek()?.row} тип ${name} может иметь лишь 1 вложенный тип`);
			}

			ParserPosManager.pos++;
		}

		return {
			type: 'TypeAnnotation',
			name,
			subNames
		}
	}
}
