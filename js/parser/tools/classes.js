class ParserClasses extends ParserBase {
	constructor() {
		super();
	}


	// Класс
	parseClassDeclaration() {
		this.expect('class', 'class');
		ParserPosManager.pos++;

		this.expectType('identifier');
		const id = this.peek().value;
		ParserPosManager.pos++;

		let superClass = null;
		if (this.peek()?.type === 'extends') {
			ParserPosManager.pos++;

			this.expectType('identifier');
			superClass = this.peek().value;

			ParserPosManager.pos++;
		}

		const body = this.parseClassBody();

		return {
			type: 'ClassDeclaration',
			id,
			superClass,
			body
		};
	}

	// Тело
	parseClassBody() {
		this.expect('{', '{');
		ParserPosManager.pos++;

		const body = [];

		while (!this.isEnd() && this.peek()?.type !== '}') {
			const peek = this.peek();

			if (peek.type === 'init') {
				body.push(this.parseClassConstructor());
				continue;
			}

			if (['private', 'static'].includes(peek.type)) {
				const savePos = ParserPosManager.pos++;
				ParserPosManager.pos++;

				if (this.back()?.type === 'private' && this.peek()?.type === 'static') {
					ParserPosManager.pos++;
				} else if ((this.back()?.type === 'private' && this.peek()?.type === 'private')) {
					this.error(`В строке ${this.back()?.row} повторно использован модификатор private`);
				} else if ((this.back()?.type === 'static' && this.peek()?.type === 'static')) {
					this.error(`В строке ${this.back()?.row} повторно использован модификатор static`);
				}

				if (this.peek()?.type === 'init') {
					this.error(`В строке ${peek.row} конструктор не может иметь модификаторы`);
				}
				const isMethod = this.peek()?.type === 'identifier' && this.next()?.type === '(';
				ParserPosManager.pos = savePos;

				if (isMethod) {
					body.push(this.parseClassMethod());
				} else {
					body.push(this.parseClassField());
				}
				continue;
			}

			if (peek.type === 'identifier') {
				if (this.next()?.type === '(') {
					body.push(this.parseClassMethod());
				} else {
					body.push(this.parseClassField());
				}
				continue;
			}

			this.error(`Неожиданный токен в теле класса: ${peek.value} (${peek.type}) на строке ${peek.row}`);

			this.expect('}', '}');
			ParserPosManager.pos++;

			return {
				type: 'ClassBody',
				body
			};
		}
	}

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
}
