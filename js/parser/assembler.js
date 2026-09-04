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

		const maxSteps = 1;
		let step = 0;

		while (!this.isEnd() && step < maxSteps) {
			++step;
		}

		console.log(this.ast.value);
	}
}

const code = `

var x: string = 'Просто строка, без матов'

`;

new Parser(code);
