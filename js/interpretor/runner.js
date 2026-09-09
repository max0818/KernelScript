class Interpreter {
	constructor(code) {
		this.ast = new Parser(code).ast;

		this.init();
	}

	init() {
		InterpreterManager.init(true);

		const visitor = new InterpreterEvaluator();
		visitor.visit(this.ast, InterpreterManager.globalEnv);

		//console.log(JSON.stringify(this.ast, null, 2));
	}
}


const code = `

var x = 5

fn add(a: int) {
	if (a > 5) {
		x += a
	}

	fn m() {
		x += 5
	}

	m()
}

add(6)

`;

new Interpreter(code);
