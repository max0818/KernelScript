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
		const stmt = this.statements.parseStatement();

		if (stmt) parent.value.push(stmt);
	}
}
