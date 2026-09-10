class InterpreterEvaluator extends InterpreterVisitor {
	constructor() {
		super();
	}

	// --- Бинарные операции ---

	// Общий метод бинарных операций
	visitBinaryExpression(node, env) {
		this.log('Вызов Binary');

		const left = this.visit(node.left, env);
		const right = this.visit(node.right, env);
		return this.applyOperator(left, right, node.operator);
	}

	// Метод применения оператора бинарной операции
	applyOperator(left, right, operator) {
		this.log(`Вызов applyOperator: ${left} ${operator} ${right}`);

		if (right === 0 && ['/', '%'].includes(operator)) {
			throw new Error('На ноль делить нельзя');
		}

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

	// --- Переменные ---

	// Объявление переменной
	visitVariableDeclaration(node, env) {
		this.log('Объявление переменной');

		if (node.init === 'null' && node.kind === 'const') {
			throw new Error(`Константа "${node.id}" должна иметь значение`);
		}

		const value = node.init !== 'null' ? this.visit(node.init, env) : null;

		env.declare(node.id, node.typeAnnotation, value, node.kind);

		return value;
	}

	// Присвоение значения
	visitAssignmentExpression(node, env) {
		this.log('Вызов Assignment');

		const right = this.visit(node.right, env);

		if (['+=', '-=', '*=', '/=', '%=', '**='].includes(node.operator)) {
			const left = this.visit(node.left, env);
			const tempOperator = node.operator.slice(0, -1);
			const newValue = this.applyOperator(left, right, tempOperator);

			env.set(node.left.name, newValue);

			return newValue;
		}

		if (node.left.type === 'Identifier') {
			env.set(node.left.name, right);
			return right;
		}

		this.error(`Можно присвоить значение только значению с типом identifier`, node);
	}

	// --- Условные операторы ---

	// if-else
	visitIfStatement(node, env) {
		this.log('Объявление if-else');

		const test = this.visit(node.test, env);

		if (test) {
			return this.visit(node.consequent, env);
		} else {
			return this.visit(node.alternate, env);
		}
	}

	// match-case
	visitMatchStatement(node, env) {
		this.log('Объявление Match');

		const test = this.visit(node.test, env);

		for (const caseNode of node.cases) {
			if (caseNode.pattern.type === 'Wildcard') {
				return this.visit(caseNode.body, env);
			}

			const patternValue = this.visit(caseNode.pattern, env);

			if (patternValue === test) {
				return this.visit(caseNode.body, env);
			}
		}

		return null;
	}

	// --- Циклы ---

	// While
	visitWhileStatement(node, env) {
		this.log('Объявление While');

		while (this.visit(node.test, env)) {
			try {
				this.visit(node.body, env);
			} catch (e) {
				if (e instanceof BreakSignal) break;
				if (e instanceof ContinueSignal) continue;
				throw e;
			}
		}

		return null;
	}

	// Break
	visitBreakStatement() {
		// WIP
	}

	// Continue
	visitContinueStatement() {
		// WIP
	}

	// --- Функции ---

	// Объявление функции
	visitFunctionDeclaration(node, env) {
		this.log('Объявление функции');

		const fn = this.createFunction(node, env);
		env.declare(node.id, {name: 'function'}, fn, 'const');
		return fn;
	}

	// Создание функции
	createFunction(node, env) {
		this.log('Создание функции');

		return {
			type: 'function',
			params: node.params,
			body: node.body,
			returnType: node.returnType,
			closure: env,
			call: (args, thisBinding = null) => {
				const newEnv = this.createEnv(env);
				newEnv.thisBinding = thisBinding || env.get('this') || null;

				for (let i = 0; i < node.params.length; i++) {
					const param = node.params[i];

					if (param.isRest) {
						const rest = args.slice(i);
						newEnv.declare(param.name, param.typeAnnotation, rest);
					} else {
						let defaultValue = 'null';

						if (param.defaultValue !== 'null') {
							defaultValue = this.visit(param.defaultValue, env);

							if (!this.expectType(this.typeOf(defaultValue), param.typeAnnotation.name) && this.typeOf(defaultValue) !== 'any') {
								throw new Error(`Тип переменной не соответствует типу значения: ${param.typeAnnotation.name} ≠ ${this.typeOf(defaultValue)}`);
							}
						}

						newEnv.declare(param.name, param.typeAnnotation, args[i] ?? defaultValue);
					}
				}

				try {
					return this.visit(node.body, newEnv);
				} catch (e) {
					if (e instanceof ReturnSignal) {
						return e.value;
					}

					throw e;
				}
			}
		};
	}

	// Вызов функции
	visitCallExpression(node, env) {
		this.log('Вызов функции');

		const callee = this.visit(node.callee, env);
		const args = node.arguments.map(arg => this.visit(arg, env));

		if (typeof callee === 'function' && !callee.type) {
			return callee(...args);
		}

		if (callee?.type === 'function') {
			return callee.call(args);
		}

		const classDef = env.get(node.callee.name);

		if (classDef || classDef?.type === 'class') {
			return classDef.new(args);
		}

		this.error('Вызываемый объект не является функцией', node);
	}

	// Return
	visitReturnStatement(node, env) {
		this.log('Вызов Return');

		const value = node.argument && node.argument !== 'null' ? this.visit(node.argument, env) : null;

		throw new ReturnSignal(value);
	}
}
