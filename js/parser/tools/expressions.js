class ParserExpressions extends ParserBase {
	constructor() {
		super();
	}


	// Точка входа
	parseExpression() {}

	// Присваивание
	parseAssignment() {}

	// Тернарный оператор
	parseConditional() {}

	// Логические операторы
	parseOr() {}

	parseAnd() {}

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
			}
		}

		return this.parsePrimary();
	}

	// Первичные выражения
	parsePrimary() {
		const peek = this.peek();

		if (!peek) this.error('Неожиданный конец кода');

		//
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
