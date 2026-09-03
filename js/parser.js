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

	mainParse() {}
}

const code = `

1+1

`;

new Parser(code);
