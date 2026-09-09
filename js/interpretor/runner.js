class Interpreter {
	constructor(code) {
		this.ast = new Parser(code).ast;

		this.init();
	}

	init() {
		InterpreterManager.init();

		const visitor = new InterpreterVisitor();

		visitor.visit(this.ast, InterpreterManager.globalEnv);

		console.log(JSON.stringify(this.ast, null, 2));
	}
}


const code = `

6 + 5

`;

new Interpreter(code);
