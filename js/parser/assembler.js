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

		console.log(JSON.stringify(this.ast.value, null, 2));
	}

	parse(parent) {
		parent.value.push(this.expressions.parseExpression());
	}
}

const code = `

abdfb();

`;

new Parser(code);
