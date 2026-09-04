class Parser extends ParserBase {
	ast = {
		type: 'program',
		value: []
	}

	constructor(code) {
		super();

		const temp = new Lexer(code).tokens;

		ParserPosManager.init(temp);

		console.log(temp);

		this.init();
	}

	initAllComps() {
		this.expressions = new ParserExpressions();
	}

	init() {
		this.initAllComps();

		const maxSteps = 100;
		let step = 0;

		while (!this.isEnd() && step < maxSteps) {
			this.parse(this.ast);
			++step;
		}

		console.log(this.ast.value);
	}

	parse(parent) {
		console.log(JSON.stringify(this.expressions.parseExpression(), null, 2));
	}
}

const code = `



`;

new Parser(code);
