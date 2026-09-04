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
		return this.exceptType(type) && this.exceptValue(value);
	}

	exceptType(type) {
		const temp = this.next()?.type === type;

		if (!temp) throw new Error(`В строке ${this.next()?.row} ожидался тип ${type}, но был получен: ${this.next()?.type}`);

		return temp;
	}

	exceptValue(value) {
		const temp = this.next()?.value === value;

		if (!temp) throw new Error(`В строке ${this.next()?.row} ожидалось ${value}, но был получен: ${this.next()?.value}`);

		return temp;
	}

	init() {
		const maxSteps = 100;
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

		// Переменные
		if (['var', 'const'].includes(peek.type)) this.parseVar(parent);
	}

	parse() {}

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

		this.exceptType('identifier');

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
			this.mainParse(obj);
		}

		parent.value.push(obj);
	}
}

const code = `

var x: string = 'hui sosi'

`;

new Parser(code);
