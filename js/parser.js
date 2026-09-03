class Parser {
	pos = 0;

	ast = {
		value: []
	}

	constructor(code) {
		this.tokens = new Lexer(code).tokens;

		console.log(this.tokens);
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

	predictValue(value) {
		if (this.tokens[this.pos].value !== value) {
			console.error(`В строке ${this.tokens[this.pos].row} ожидалось ${value}, но был получен: ${this.tokens[this.pos].value}`);
			return false;
		}

		return true;
	}

	predictType(type) {
		if (this.tokens[this.pos].type !== type) {
			console.error(`В строке ${this.tokens[this.pos].row} ожидалось ${type}, но был получен: ${this.tokens[this.pos].type}`);
			return false;
		}

		return true;
	}

	mainParse() {}
}

const code = `

1+1

`;

new Parser(code);
