class InterpreterClasses extends InterpreterFlags {
	constructor() {
		super();
	}

	// Объявление класса
	visitClassDeclaration(node, env) {
		this.log('Объявление класса');

		const classDef = this.createClass(node, env);
		env.declare(node.id, {name: 'object'}, classDef, 'const');
		return classDef;
	}

	// Создание класса
	createClass(node, env) {
		this.log('Создание класса');

		let superClass = null;
		if (node.superClass !== 'null') {
			superClass = env.get(node.superClass);
		}

		const methods = {};
		const fields = {};
		let classInit = null;

		for (const member of node.body.body) {
			if (member.type === 'MethodDefinition') {
				if (member.key === 'init') {
					classInit = member;
				} else {
					methods[member.key] = member;
				}
			} else if (member.type === 'ClassProperty') {
				fields[member.key] = member;
			}
		}

		return {
			type: 'class',
			name: node.id,
			superClass,
			methods,
			fields,
			classInit,
			new: (args) => {
				const instance = {};

				if (superClass) {
					const parentInstance = superClass.new(args);
					Object.assign(instance, parentInstance);
				}

				for (const [key, field] of Object.entries(fields)) {
					if (!field.isStatic) {
						const value = field.value !== 'null' ? this.visit(field.value, env) : null;
						instance[key] = value;
					}
				}

				for (const [key, method] of Object.entries(methods)) {
					if (!method.isStatic) {
						instance[key] = this.createMethod(method, instance, env);
					}
				}

				if (classInit) {
					const initFn = this.createMethod(classInit, instance, env);
					initFn.call(instance, args);
				}

				return instance;
			}
		};
	}

	// Создание метода
	createMethod(method, instance, env) {
		this.log('Создание метода');

		const fn = {
			type: 'function',
			params: method.params || [],
			body: method.body,
			closure: env,
			call: (args, thisBinding = instance) => {
				const newEnv = this.createEnv(env);
				newEnv.thisBinding = thisBinding || env.get('this') || null;

				if (thisBinding.__proto__ && thisBinding.__proto__.superClass) {
					newEnv.declare('super', {
						call: (methodName, ...args) => {
							const parent = thisBinding.__proto__.superClass;

							if (parent && parent.methods[methodName]) {
								const parentMethod = this.createMethod(
									parent.methods[methodName],
									thisBinding,
									env
								);

								return parentMethod.call(args);
							}

							throw new Error(`Метод ${methodName} не найден в родителе`);
						}
					});
				}

				for (let i = 0; i < method.params.length; i++) {
					const param = method.params[i];
					
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
					return this.visit(method.body, newEnv);
				} catch (e) {
					/*if (e instanceof ReturnSignal) {
						return e.value;
					}*/

					throw e;
				}
			}
		};

		return fn.call.bind(fn);
	}

	// New
	visitNewExpression(node, env) {
		this.log('Вызов New');

		return env.get(node.name);
	}

	// This
	visitThisExpression(node, env) {
		this.log('Вызов This');

		if (env.thisBinding === null) {
			this.error(`"this" используется вне метода класса`, node);
		}

		return env.thisBinding;
	}

	// Super
	visitSuperExpression(node, env) {
		this.log('Вызов Super');

		if (!env.has('super')) {
			this.error(`"super" используется вне метода класса`, node);
		}

		return env.get('super');
	}
}
