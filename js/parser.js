class Parser {
	pos = 0;

	ast = {
		value: []
	}

	constructor(code) {
		this.tokens = new Lexer(code).tokens;

		this.init();
	}

	peek() {
		return this.tokens[this.pos];
	}

	next() {
		return this.tokens[this.pos + 1];
	}

	isEnd() {
		return this.pos >= this.tokens.length;
	}

	except(type, value) {
		return this.predictType(type) && this.predictValue(value);
	}

	predictType(type) {
		const temp = this.tokens[this.pos].type !== type;

		if (!temp) console.error(`В строке ${this.tokens[this.pos].row} ожидался тип ${type}, но был получен: ${this.tokens[this.pos].type}`);

		return temp;
	}

	predictValue(value) {
		const temp = this.tokens[this.pos].value === value;

		if (!temp) console.error(`В строке ${this.tokens[this.pos].row} ожидалось ${value}, но был получен: ${this.tokens[this.pos].value}`);

		return temp;
	}

	init() {
		const maxSteps = 50;
		let step = 0;

		while (!this.isEnd() && step < maxSteps) {
			this.mainParse(this.ast);
			++step;
		}

		console.log(this.ast.value);
	}

	mainParse(parent) {
		const peek = this.peek();
		const next = this.next();

		if (['any', 'bool', 'int', 'float', 'string'] peek.type === ) this.parseLiteral(parent);
	}

	parseLiteral(parent) {
		const literal = this.peek();

		if (literal.value === literal.type) {
			this.parseType(parent);
			return;
		}

		this.pos++;

		const obj = {
			type: 'Literal',
			value: literal.value
		};

		parent.value.push(obj);
	}

	parseType(parent) {
		const type = this.peek();

		this.pos++;

		const obj = {
			type: 'type',
			value: type.value
		};

		parent.value.push(obj);
	}
}

const code = `

int

`;

new Parser(code);
