class InterpreterEvaluator extends InterpreterVisitor {
	constructor() {
		super();
	}

	visitExpressionStatement(node, env) {
		this.log('Вызов visitExpressionStatement');

		return this.visit(node.expression, env);
	}

	visitLiteral(node) {
		if (['"', "'", '`'].includes(node.value[0])) {
			return node.value.slice(1, -1);
		}

		return node.value;
	}

	// --- Бинарные операции ---
	visitBinaryExpression(node, env) {
		this.log('Вызов visitBinaryExpression');

		const left = this.visit(node.left, env);
		const right = this.visit(node.right, env);
		return this.applyOperator(left, right, node.operator);
	}

	applyOperator(left, right, operator) {
		this.log(`Вызов applyOperator: ${left} ${operator} ${right}`);

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
		this.log('Вызов visitVariableDeclaration');

		if (node.init === 'null' && node.kind === 'const') {
			throw new Error(`Константа "${node.id}" должна иметь значение`);
		}

		const value = node.init !== 'null' ? this.visit(node.init, env) : null;

	}
}
