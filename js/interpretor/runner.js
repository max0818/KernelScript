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

var x: float = 5
x = 6.5

if (5 == 5) {
	var y = 5

	y += 6
} else {
	x -= 6
}

#y -= 5

`;

new Interpreter(code);
