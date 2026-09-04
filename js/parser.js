class Parser {
	mainParse(parent) {
		const peek = this.peek();
		const next = this.next();

		// Переменные
		if (['var', 'const'].includes(peek.type)) this.parseVar(parent);
	}

	parseLiteral(parent) {
		const literal = this.peek();

		if (literal.value === literal.type) return;

		this.pos++;

		const obj = {
			type: 'Literal',
			typeValue: literal.type,
			value: literal.value
		};

		parent.value.push(obj);
	}

	parseType() {
		const type = this.peek();

		this.pos++;

		const obj = {
			type: 'type',
			value: type.value
		};

		return obj;
	}

	parseVar(parent) {
		const keyword = this.peek();
		const row = this.peek().row;
		const obj = {
			type: keyword,
			typeVar: 'any',
			name: null,
			value: null
		};

		this.expectType('identifier');

		this.pos++;
		obj.name = this.peek().value;

		this.pos++;

		if (this.peek()?.type === ':') {
			if (this.next()?.type !== 'type') {
				throw new Error(`На строке ${row} для ${obj.name} ожидался тип, но был получен: ${this.next()?.value}`);
			}

			obj.type = this.next().value;

			this.pos += 2;
		}

		if (this.peek()?.type === '=') {
			this.pos++;
			//this.parseExpression(obj);
		}

		parent.value.push(obj);
	}
}

new Parser(code);
