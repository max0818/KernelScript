class InterpreterEnvironment extends InterpreterBase {
	constructor(parent = null) {
		super();

		this.parent = parent;
		this.variables = {};
		this.thisBinding = null;
	}

	// Объявление новой переменной
	declare(name, type, value, kind = 'var') {
		this.log(`Объявление переменной: ${kind} ${name}: ${type.name}${type.subName ? '<' + type.subName + '>' : ''} = ${value}`);

		if (name in this.variables) {
			throw new Error(`Переменная "${name}" уже объявлена`);
		}

		if (!this.expectType(this.typeOf(value), type.name) && this.typeOf(value) !== 'any') {
			throw new Error(`Тип переменной не соответствует типу значения: ${type.name} ≠ ${this.typeOf(value)}`);
		}

		let init = value;
		if (init === 'null') init = this.getZeroValue(type.name);

		this.variables[name] = {
			type: type.name === 'any' ? this.typeOf(init) : type.name,
			constant: kind === 'const',
			value: init
		};
	}

	// Получить значение переменной
	get(name) {
		this.log(`Получение значения переменной "${name}"`);

		if (name in this.variables) return this.variables[name].value;
		if (this.parent) return this.parent.get(name);
		throw new Error(`Переменная "${name}" не найдена`);
	}

	// Дать значение переменной
	set(name, value) {
		this.log(`Присвоение нового значения: ${name} = ${value}`);

		if (this.variables[name]?.constant) {
			throw new Error(`Переменную "${name}" изменить нельзя, так как она является константой`);
		}

		if (name in this.variables) {
			if (!this.expectType(this.typeOf(value), this.variables[name].type)) {
				throw new Error(`В переменную "${name}" с типом ${this.variables[name].type} нельзя присвоить значение "${value}" с типом ${this.typeOf(value)}`);
			}

			this.variables[name].value = value;
			return this.variables[name].value;
		}

		if (this.parent) {
			return this.parent.set(name, value);
		}

		throw new Error(`Переменная "${name}" не найдена`);
	}

	// Существует ли переменная
	has(name) {
		this.log(`Проверка на существование переменной "${name}"`);

		if (name in this.variables) return true;
		if (this.parent) return this.parent.has(name);
		return false;
	}
}
