class ParserClasses extends ParserBase {
	constructor() {
		super();
	}


	// Класс
	parseClassDeclaration() {}

	// Тело
	parseClassBody() {}

	// Конструктор
	parseClassConstructor() {
		this.expect('init', 'init');
		ParserPosManager.pos++;

		this.expect('(', '(');
		ParserPosManager.pos++;

		const params = new ParserFunctions().parseFunctionParams();

		this.expect(')', ')');
		ParserPosManager.pos++;

		if (this.peek()?.type === ':') {
			this.error(`В строке ${this.peek()?.row} конструктор не может иметь тип возврата`);
		}

		const body = new ParserStatements().parseBlock();

		return {
			type: 'MethodDefinition',
			key: 'init',
			params,
			returnType: 'any',
			body,
			isPrivate: false,
			isStatic: false
		};
	}

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
