class ParserClasses extends ParserBase {
	constructor() {
		super();
	}


	// Класс
	parseClassDeclaration() {}

	// Тело
	parseClassBody() {}

	// Конструктор
	parseClassConstructor() {}

	// Поле
	parseClassField() {
		let isPrivate = false;
		let isStatic = false;

		if (this.peek()?.type === 'private') {
			isPrivate = true;
			ParserPosManager.pos++;
		}

		if (this.peek()?.type === 'static') {
			isStatic = true;
			ParserPosManager.pos++;
		}

		this.expectType('identifier');
		const key = this.peek().value;
		ParserPosManager.pos++;

		let value = null;
		if (this.peek()?.type === '=') {
			ParserPosManager.pos++;
			value = new ParserExpressions().parseExpression();
		}

		if (this.peek()?.type === ';') ParserPosManager.pos++;

		return {
			type: 'ClassProperty',
			key,
			value,
			isPrivate,
			isStatic
		};
	}

	// Метод
	parseClassMethod() {}

	// Наследование
	parseClassExtends() {}
}
