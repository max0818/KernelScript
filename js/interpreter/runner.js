class Interpreter {
	constructor(code) {
		this.ast = new Parser(code).ast;

		this.init();
	}

	init() {
		InterpreterManager.init(true);

		const visitor = new InterpreterClasses();
		visitor.visit(this.ast, InterpreterManager.globalEnv);

		//console.log(JSON.stringify(this.ast, null, 2));
	}
}


const code = `

flag Console

class x {
	init(a) {
		print(a)
	}
}

new x()

`;

new Interpreter(code);
