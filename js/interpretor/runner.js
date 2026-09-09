class Interpreter {
	constructor(code) {
		this.ast = new Parser(code).ast;

		this.init();
	}

	init() {
		InterpreterManager.init(true);

		const visitor = new InterpreterEvaluator();

		visitor.visit(this.ast, InterpreterManager.globalEnv);

		console.log(JSON.stringify(this.ast, null, 2));
	}
}


const code = `

const x: int = 6

`;

new Interpreter(code);
