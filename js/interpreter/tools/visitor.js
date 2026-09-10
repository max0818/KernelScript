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
		this.log('Инициализация программы');

		let result = null;

		for (const stmt of node.value) {
			result = this.visit(stmt, env);
		}

		return result;
	}

	// Общий метод выражений
	visitExpressionStatement(node, env) {
		this.log('Обработка выражения');

		return this.visit(node.expression, env);
	}

	// --- Значения ---

	// Литерал
	visitLiteral(node) {
		this.log('Обработка литерала');

		if (['"', "'", '`'].includes(node.value[0])) {
			return node.value.slice(1, -1);
		}

		return node.value;
	}

	// Идентификатор
	visitIdentifier(node, env) {
		this.log('Обработка идентификатора');

		return env.get(node.name);
	}

	// Null
	visitNullExpression(node) {
		this.log('Обработка Null');

		return node.name;
	}

	// --- Малые структуры ---

	// Массив
	visitArrayExpression(node, env) {
		this.log('Новый массив');

		const array = [];

		for (const item of node.elements) {
			array.push(this.visit(item, env));
		}

		return array;
	}

	// Объект
	visitObjectExpression(node, env) {
		this.log('Новый объект');

		const object = {};

		for (const item of node.properties) {
			object[item.key] = this.visit(item.value, env);
		}

		return object;
	}

	// Блок
	visitBlockStatement(node, env) {
		this.log('Создание блока');

		const childEnv = this.createEnv(env);

		let result = null;

		for (const stmt of node.body) {
			result = this.visit(stmt, childEnv);
		}

		return result;
	}
}
