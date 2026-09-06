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
	parseClassMethod() {
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

		this.expect('(', '(');
		ParserPosManager.pos++;

		const params = new ParserFunctions().parseFunctionParams();

		this.expect(')', ')');
		ParserPosManager.pos++;

		let returnType = 'any';
		if (this.peek()?.type === ':') {
			ParserPosManager.pos++;
			returnType = new ParserExpressions().parseTypeAnnotation();
		}

		const body = new ParserStatements().parseBlock();

		return {
			type: 'MethodDefinition',
			key,
			params,
			returnType,
			body,
			isPrivate,
			isStatic
		};
	}

	// Наследование
	parseClassExtends() {}
}
