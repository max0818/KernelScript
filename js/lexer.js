class Lexer {
	static stringSymbols = ['"', "'", '`'];
	static arithmeticSymbols = ['+', '-', '*', '/', '%'];
	static comparisonSymbols = ['=', '!', '<', '>'];
	static bitWorkSymbols = ['&', '|', '^', '~'];
	static parenthesesSymbols = ['(', ')', '[', ']', '{', '}'];
	static unaryOperators = ['.', ',', ':'];
	static doubleOperators = [
		// Сравнение
		'==', '!=', '<=', '>=',

		// Присвоение
		'+=', '-=', '*=', '/=', '%=', '++', '--',

		// Битовые
		'<<', '>>'
	];
	static valueWords = [
		'null',
		'NaN',
		'Infinity'
	];
	static keyWords = [
		// Логика
		'and',
		'or',
		'not',

		// Переменные
		'var',
		'const',

		// Условные операторы
		'if',
		'elif',
		'else',

		'match',
		'case',

		// Циклы
		'while',
		'break',

		// Функции
		'fn',
		'return',

		// Классы
		'class',
		'private',
		'static',
		'init',
		'extends',
		'super',

		// Флаги
		'flag'
	];

	pos = 0;
	row = 1;

	tokens = [];

	constructor(code) {
		this.code = code || '';

		this.init();
	}

	current() {
		return this.code[this.pos];
	}

	next() {
		return this.code[this.pos + 1];
	}

	isEnd() {
		if (this.pos >= this.code.length) return true;
	}

	nextRow() {
		this.row++;
		this.pos++;
	}

	addToken(value, type, row) {
		this.tokens.push({
			value: value,
			type: type,
			row: row
		});
	}

	init() {
		let maxSteps = 100;
		let step = 0;
		while (!this.isEnd() && step < maxSteps) {
			this.mainChecker();
			step++;
		}

		console.log(this.tokens);
	}

	mainChecker() {
		const current = this.current();
		const next = this.next();

		// Пропуск пробела
		if (
			current === ' ' ||
			current === ';' ||
			current === '\t'
		) this.pos++;

		// Следующая строка
		else if (current === '\n') this.nextRow();

		// Двоичные числа
		else if (
			current === '0' &&
			next === 'b' ||
			next === 'o' ||
			next === 'x'
		) this.differentNumberChecker();

		// Числа
		else if (current.match(/[0-9]+/)) this.numberChecker();

		// Идентификатор
		else if (current.match(/[A-Za-z]+/)) this.wordChecker();

		// Строки
		else if (Lexer.stringSymbols.includes(current)) this.stringChecker();

		// Арифметика
		else if (Lexer.arithmeticSymbols.includes(current)) this.arithmeticSymbolsChecker();
	}

	differentNumberChecker() {
		const next = this.next();
		let number = this.current() + this.next();
		let type = 'number';

		this.pos += 2;

		while (!this.isEnd() && this.current().match(this.differentNumberCheckerComp(next))) {
			number += this.current();
			this.pos++;
		}

		number = eval(number);

		this.addToken(number, type, this.row);
	}

	differentNumberCheckerComp(next) {
		if (next === 'b') return /[0-1]+/;
		if (next === 'o') return /[0-7]+/;
		if (next === 'x') return /[0-9A-Fa-f]+/;
	}

	numberChecker() {
		let number = this.current();
		let type = 'int';

		this.pos++;

		while (!this.isEnd() && this.current().match(/[0-9]+/)) {
			number += this.current();
			this.pos++;
		}

		if (this.current() === '.') {
			number += '.';
			type = 'float';
			this.pos++;

			while (!this.isEnd() && this.current().match(/[0-9]+/)) {
				number += this.current();
				this.pos++;
			}
		}

		number = eval(number);

		this.addToken(number, type, this.row);
	}

	wordChecker() {
		let word = '';
		let type = 'identifier';

		while (!this.isEnd() && this.current().match(/\w+/)) {
			word += this.current();
			this.pos++;
		}

		if (
			Lexer.valueWords.includes(word) ||
			Lexer.keyWords.includes(word)
		) type = word;

		this.addToken(word, type, this.row);
	}

	stringChecker() {
		const symbol = this.current();
		let string = symbol;
		let type = 'String';

		this.pos++;

		while (!this.isEnd() && this.current() !== symbol) {
			string += this.current();
			this.pos++;
		}

		this.pos++;
		string += symbol;

		if (symbol === '`') type = 'NestString';

		this.addToken(string, type, this.row);
	}

	arithmeticSymbolsChecker() {
		let operator = this.current();
		let type;
		let doubleType;

		this.pos++;

		if (operator === '+') {
			type = 'add';
			doubleType = 'increment';
		} else if (operator === '-') {
			type = 'sub';
			doubleType = 'decrement';
		} else if (operator === '*') {
			type = 'mult';
			doubleType = 'exponent';
		} else if (operator === '/') type = 'div';
		else if (operator === '%') type = 'mod';

		if (['+', '-', '*'].includes(this.current()) && this.current() === operator) {
			operator += this.current();
			type = doubleType + 'Operator';
		} else if (this.current() === '=') {
			operator += this.current();
			type += 'AssignOperator';
		} else type += 'Operator';

		this.pos++;

		this.addToken(operator, type, this.row);
	}
}

const code = `

x ** 5;

`;

new Lexer(code);
