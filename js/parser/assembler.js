class Parser {
	ast = {
		value: []
	}

	constructor(code) {
		ParserPosManager.init(new Lexer(code).tokens);

		this.init();
	}
}
