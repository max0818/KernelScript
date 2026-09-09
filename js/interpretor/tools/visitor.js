class InterpreterVisitor extends InterpreterBase {
	constructor() {
		super();
	}

	// --- Основные методы ---

	// Общий метод и входная точка
	visit(node, env) {
		if (!node) return null;

		const methodName = `visit${node.type}`;
		const method = this[methodName];

		if (method) {
			return method.call(this, node, env);
		}

		console.log(node);
		this.error(`Неизвестный тип узла: ${node.type}`, node);
	}

	// Инициализация программы
	visitProgram(node, env) {
		this.log('Вызов visitProgram');

		let result = null;

		for (const stmt of node.value) {
			result = this.visit(stmt, env);
		}

		return result;
	}

	// Общий метод выражений
	visitExpressionStatement(node, env) {
		this.log('Вызов visitExpressionStatement');

		return this.visit(node.expression, env);
	}

	// --- Значения ---

	// Литерал
	visitLiteral(node) {
		this.log('Вызов visitLiteral');

		if (['"', "'", '`'].includes(node.value[0])) {
			return node.value.slice(1, -1);
		}

		return node.value;
	}

	// Идентификатор
	visitIdentifier(node, env) {
		this.log('Вызов visitIdentifier');

		return env.get(node.name);
	}

	// Null
	visitNullExpression(node) {
		this.log('Вызов visitNullExpression');

		return node.name;
	}

	// --- Малые структуры ---

	// Массив
	visitArrayExpression(node, env) {
		this.log('Вызов visitArrayExpression');

		const array = [];

		for (const item of node.elements) {
			array.push(this.visit(item, env));
		}

		return array;
	}

	// Объект
	visitObjectExpression(node, env) {
		this.log('Вызов visitObjectExpression');

		const object = {};

		for (const item of node.properties) {
			object[item.key] = this.visit(item.value, env);
		}

		return object;
	}

	// Блок
	visitBlockStatement(node, env) {
		const childEnv = env.child()

		let result = null;

		for (const stmt of node.body) {
			result = this.visit(stmt, childEnv);
		}

		return result;
	}
}
