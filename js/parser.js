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
		const temp = this.next()?.type === type;

		if (!temp) throw new Error(`В строке ${this.next()?.row} ожидался тип ${type}, но был получен: ${this.next()?.type}`);

		return temp;
	}

	predictValue(value) {
		const temp = this.next()?.value === value;

		if (!temp) throw new Error(`В строке ${this.next()?.row} ожидалось ${value}, но был получен: ${this.next()?.value}`);

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

		// Указатель типа
		if (['var', 'const'].includes(peek.type)) this.parseVar();
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

		if (type.type !== type.value) return;

		this.pos++;

		const obj = {
			type: 'type',
			value: type.value
		};

		return obj;
	}

	parseVar() {
		const keyword = this.peek();
		const obj = {
			type: keyword,
			typeVar: 'any',
			name: null,
			value: 'null'
		};

		if (!this.predictType('identifier')) return;

		this.pos++;
	}
}

const code = `

var x

`;

new Parser(code);
