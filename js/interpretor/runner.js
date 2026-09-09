class Interpreter {
	constructor(code) {
		this.ast = new Parser(code).ast;

		this.init();
	}

	init() {
		InterpreterManager.init();

		const visitor = new InterpreterFlags();
		visitor.visit(this.ast, InterpreterManager.globalEnv);

		//console.log(JSON.stringify(this.ast, null, 2));
	}
}


const code = `

flag Console
flag Typing

var x = 20 * 9 ** 0.5 + 7

print('Aura:', x)

`;

new Interpreter(code);
