class InterpreterManager {
	// --- Инициализация ---

	// Запуск
	static init(debugMode = false) {
		this.clean();
		this.setDebugMode(debugMode);
	}

	// Очистка
	static clean() {
		this.errors = [];
		this.warnings = [];
		this.debugMode = false;
		this.autoTypingEnabled = true;
		this.flags = [];
		this.globalEnv = new InterpreterEnvironment();
	}

	// --- Ошибки и предупреждения ---

	// Ошибка
	static error(message, node = null) {
		const row = node?.row || '?';
		const fullMessage = `[${row}] ${message}`;
		this.errors.push(fullMessage);
		throw new Error(fullMessage);
	}

	// Предупреждение
	static warn(message, node = null) {
		const row = node?.row || '?';
		this.warnings.push(`[${row}] ${message}`);

		if (this.debugMode) console.warn(`[WARN] [${row}] ${message}`);
	}

	// --- Логирование ---

	// Вывод сообщения
	static log(message) {
		if (this.debugMode) console.log(`[Interpreter] ${message}`);
	}

	// Включение и отключение отладки
	static setDebugMode(isEnabled = false) {
		this.debugMode = isEnabled;
	}
}

class InterpreterBase {
	constructor() {
		this.currentClass = null;
		this.currentFunction = null;
	}

	// Встроенные базовые методы

	hasFlag(flag) {
		return InterpreterManager.flags.includes(flag);
	}

	createEnv(parent) {
		return new InterpreterEnvironment(parent || InterpreterManager.globalEnv);
	}

	getZeroValue(type) {
		switch (type) {
			case 'any': return 'null';
			case 'bool': return false;
			case 'int': return 0;
			case 'float': return 0.0;
			case 'string': return "";
			case 'array': return [];
			case 'object': return {};
			default: return 'null';
		}
	}

	typeOf(value) {
		if (value === 'null') return 'any';

		if (typeof value === 'boolean') return 'bool';
		if (typeof value === 'number') {
			if (Number.isInteger(value)) return 'int';
			return 'float';
		}

		if (typeof value === 'string') return 'string';
		if (Array.isArray(value)) return 'array';
		if (typeof value === 'object') return 'object';

		return 'any';
	}

	expectType(actualType, expectedType) {
		if (expectedType === 'any') return true;

		if (expectedType === 'float' && actualType === 'int') return true;

		return expectedType === actualType;
	}

	compTypeOf(value) {
		// WIP
	}

	expectCompType(value) {
		// WIP
	}

	// Методы от InterpreterManager

	error(message, node) {InterpreterManager.error(message, node)}
	warn(message, node) {InterpreterManager.warn(message, node)}

	log(message) {InterpreterManager.log(message)}
	setDebugMode(isEnabled) {InterpreterManager.setDebugMode(isEnabled)}
}
