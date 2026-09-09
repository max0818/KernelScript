class InterpreterEvaluator extends InterpreterVisitor {
	constructor() {
		super();
	}

	// --- Бинарные операции ---
	visitBinaryExpression(node, env) {
		const left = this.visit(node.left, env);
		const right = this.visit(node.right, env);
		return this.applyOperator(left, right, node.operator);
	}

	applyOperator(left, right, operator) {
		switch (operator) {
			case '+': return left + right;
			case '-': return left - right;
			case '*': return left * right;
			case '/': return left / right;
			case '%': return left % right;
			case '**': return left ** right;
			case '==': return left === right;
			case '!=': return left !== right;
			case '<': return left < right;
			case '>': return left > right;
			case '<=': return left < right;
			case '>=': return left > right;
			case 'and': return left && right;
			case 'or': return left || right;
			default: this.error(`Неизвестный оператор: ${operator}`, node);
		}
	}
}
