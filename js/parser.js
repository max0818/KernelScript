class Parser {
	constructor(code) {
		this.tokens = new Lexer(code).tokens;

		console.log(this.tokens);
	}
}

const code = `

var x =0

`;

new Parser(code);
