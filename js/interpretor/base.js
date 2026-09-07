class InterpreterBase {
	constructor() {
		this.errors = [];
		this.warnings = [];
		this.debugMode = false;
	}

	// Ошибка
	error(message, node = null) {
		const row = node?.row || '?';
		const fullMessage = `[${row}] ${message}`;
		this.errors.push(fullMessage);
		throw new Error(fullMessage);
	}

	// Предупреждение
	warn(message, node = null) {
		const row = node?.row || '?';
		this.warnings.push(`[${row}] ${message}`);

		if (this.debugMode) console.warn(`[WARN] [${row}] ${message}`);
	}

	// Проверка массива ошибок
	hasErrors() {
		return this.errors.length > 0;
	}

	// Получение массивов

	// Получить массив ошибок
	getErrors() {
		return this.errors;
	}

	// Получить массив предупреждений
	getWarnings() {
		return this.warnings;
	}

	// Логирование

	// Вывод сообщения
	log(message) {
		if (this.debugMode) console.debug(`[Interpreter] ${message}`);
	}

	// Включение и отключение отладки
	setDebugMode(isEnabled = false) {
		this.debugMode = isEnabled;
	}

	// Вспомогательные методы

	// Проверка значения на истинность в логическом контексте
	isTruthy(value) {
		if (
			value === false ||
			value === null ||
			value === 0 ||
			value === '' ||
			value === 'null'
		) return false;
		return true;
	}

	// Проверка значения на ложность в логическом контексте
	isFalsy(value) {
		return !this.isTruthy(value);
	}

	// Проверка актуального типа на ожидаемый тип
	assertType(value, expectedType, message, node = null) {
		const actualType = typeof value;

		if (actualType !== expectedType) {
			this.error(`Ожидался тип ${expectedType}, получен ${actualType}: ${message}`, node);
		}
	}

	// Проверка числа
	assertNumber(value, message, node = null) {
		if (typeof value !== 'number' || value === 'NaN') {
			this.error(`Ожидалось число: ${message}`, node);
		}
	}

	// Проверка строки
	assertString(value, message, node = null) {
		if (typeof value !== 'string') {
			this.error(`Ожидалась строка: ${message}`, node);
		}
	}

	// Проверка массива
	assertArray(value, message, node = null) {
		if (!Array.isArray(value)) {
			this.error(`Ожидался массив: ${message}`, node);
		}
	}

	// Утилиты для работы с AST

	// Получить глобальные константы
	getGlobalConstants() {
		return {
			'null': 'null',
			'true': true,
			'false': false
		};
	}

	// Проверка глобальной константы
	isGlobalConstant(name) {
		return ['null', true, false].includes(name);
	}

	getGlobalConstant(name) {
		const constants = this.getGlobalConstants();

		if (name in constants) {
			return constants[name]
		}

		return undefined;
	}
}
