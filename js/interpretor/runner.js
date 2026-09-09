class Interpreter {
	constructor(code) {
		this.ast = new Parser(code).ast;

		this.init();
	}

	init() {
		console.log(JSON.stringify(this.ast, null, 2));
		console.log(this.ast);
	}
}


const code = `

(x + 5 - 5) * 5

`;

new Interpreter(code);
