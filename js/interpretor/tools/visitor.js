class InterpreterVisitor extends InterpreterBase {
	constructor() {
		super();
	}

	visit(node, env) {
		this.log(`Вызов visit`);

		if (!node) return null;

		const methodName = `visit${node.type}`;
		const method = this[methodName];

		if (method) {
			return method.call(this, node, env);
		}

		console.log(node);
		this.error(`Неизвестный тип узла: ${node.type}`, node);
	}

	visitProgram(node, env) {
		this.log(`Вызов visitProgram`);

		let result = null;

		for (const stmt of node.value) {
			result = this.visit(stmt, env);
		}

		return result;
	}
}
