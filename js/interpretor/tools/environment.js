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
}
