class InterpreterFlags extends InterpreterEvaluator {
	constructor() {
		super();
	}

	visitFlagDeclaration(node, env) {
		const flagName = node.name;
		InterpreterManager.flags.push(flagName);

		this.activateFlag(flagName);

		return true;
	}

	activateFlag(name) {
		switch(name) {
			case 'Typing':
				this.activateTypingMethods();
				break;
			case 'Console':
				this.activateConsoleMethods();
				break;
			case 'Time':
				this.activateTimeMethods();
				break;
		}
	}

	addFlagMethods(obj) {
		for (const [name, fn] of Object.entries(obj)) {
			if (!InterpreterManager.globalEnv.has(name)) {
				InterpreterManager.globalEnv.declare(name, {name: 'function'}, fn);
			}
		}
	}

	// --- Методы флагов ---

	// Typing
	activateTypingMethods() {
		this.log('Добавлен флаг Typing');

		const obj = {
			disableAutoTyping: () => {
				console.error('disableAutoTyping: WIP');
			},
			typeOf: (value) => {
				return this.typeOf(value);
			},
			expectType: (value, type) => {
				return this.typeOf(value) === type
			}
		};

		this.addFlagMethods(obj);
	}

	// Console
	activateConsoleMethods() {
		this.log('Добавлен флаг Console');

		const obj = {
			print: (...args) => {
				if (args.length > 0) {
					console.log(...args);
					return true;
				} else return false;
			},
			input: (message = '') => {
				return prompt(message) || '';
			},
			clear: () => {
				console.clear();
				return true;
			}
		};

		this.addFlagMethods(obj);
	}

	// Time
	activateTimeMethods() {
		const obj = {
			sleep: (seconds = 0) => {
				// WIP
			},
			timeout: (func, seconds = 1) => {
				return setTimeout(func, seconds * 1000);
			},
			interval: (func, seconds = 1, maxSteps = Infinity) => {
				const max = maxSteps;
				let i = 0;

				return setInterval(() => {
					if (i >= max) return;
					func();
					++i;
				}, seconds * 1000);
			},
			stopTimeout: (timeout) => {
				return clearTimeout(timeout);
			},
			stopInterval: (interval) => {
				return clearInterval(interval);
			}
		};

		this.addFlagMethods(obj);
	}
}
