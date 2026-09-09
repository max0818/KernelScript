class Parser extends ParserBase {
	ast = {
		type: 'Program',
		value: []
	}

	constructor(code) {
		super();

		ParserPosManager.init(new Lexer(code).tokens);

		this.init();
	}

	init() {
		this.statements = new ParserStatements();

		while (!this.isEnd()) {
			this.parse(this.ast);
		}
	}

	parse(parent) {
		parent.value.push(this.statements.parseStatement());
	}
}
