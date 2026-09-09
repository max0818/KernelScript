class InterpreterEnvironment extends InterpreterBase {
	constructor(parent = null) {
		super();

		this.parent = parent;
		this.variables = {};
		this.constants = [];
		this.thisBinding = null;
	}

	// Объявление новой переменной
	declare(name, value, kind = 'var') {
		if (name in this.variables) {
			throw new Error(`Переменная "${name}" уже объявлена`);
		}

		this.variables[name] = value;

		if (kind === 'const') this.constants.push(name);
	}

	// Получить значение переменной
	get(name) {
		if (name in this.variables) return this.variables[name];

		if (this.parent) return this.parent.get(name);

		throw new Error(`Переменная "${name}" не найдена`);
	}

	// Дать значение переменной
	set(name, value) {
		if (this.constants.includes(name)) {
			throw new Error(`Переменную "${name}" изменить нельзя, так как она является константой`);
		}

		if (name in this.variables) {
			this.variables[name] = value;
			return true;
		}

		if (this.parent) {
			return this.parent.set(name, value);
		}

		throw new Error(`Переменная "${name}" не найдена`);
	}

	// Существует ли переменная
	has(name) {
		if (name in this.variables) return true;
		if (this.parent) return this.parent.has(name);
		return false;
	}

	// Создать дочернее окружение
	child() {
		return new InterpreterEnvironment(this);
	}
}
