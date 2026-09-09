class InterpreterEvaluator extends InterpreterVisitor {
	constructor() {
		super();
	}

	visitExpressionStatement(node, env) {
		return this.visit(node.expression, env);
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
			case '&': return left & right;
			case '|': return left | right;
			case '^': return left ^ right;
			case '<<': return left << right;
			case '>>': return left >> right;
			default: this.error(`Неизвестный оператор: ${operator}`, node);
		}
	}

	visitVariableDeclaration(node, env) {
		if (node.value === 'null' && node.kind === 'const') {
			throw new Error(``);
		}

		const value = node.init !== 'null' ? this.visit(node.init, env) : null;

	}
}
