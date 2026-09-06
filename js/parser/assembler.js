class Parser extends ParserBase {
	ast = {
		type: 'program',
		value: []
	}

	constructor(code) {
		super();

		ParserPosManager.init(new Lexer(code).tokens);

		this.init();
	}

	init() {
		this.statements = new ParserStatements();

		const maxSteps = 500;
		let step = 0;

		while (!this.isEnd() && step < maxSteps) {
			this.parse(this.ast);
			++step;
		}

		console.log(JSON.stringify(this.ast.value, null, 2));
	}

	parse(parent) {
		parent.value.push(this.statements.parseStatement());
	}
}

const code = `

fn add(): int {}

`;

new Parser(code);
