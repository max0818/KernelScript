class Parser extends ParserBase {
	ast = {
		value: []
	}

	constructor(code) {
		super();
		ParserPosManager.init(new Lexer(code).tokens);

		this.init();
	}

	init() {
		const maxSteps = 1;
		let step = 0;

		while (!this.isEnd() && step < maxSteps) {
			++step;
		}

		console.log(this.ast.value);
	}
}

const code = `

var x: string = 'hui sosi'

`;

new Parser(code);
