class Lexer {
	static stringSymbols = ['"', "'", '`'];
	static arithmeticSymbols = ['+', '-', '*', '/', '%'];
	static comparisonSymbols = ['=', '!', '<', '>'];
	static bitWorkSymbols = ['&', '|', '^', '~'];
	static parenthesesSymbols = ['(', ')', '[', ']', '{', '}'];
	static singleOperators = ['.', ',', ':', '?'];
	static valueWords = [
		// Логика
		'true',
		'false',

		// Типы
		'any',
		'int',
		'float',
		'string',
		'array',
		'object',
		'function',

		// Неопределённые значения
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
		'new',

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

	// Инициализация лексера
	init() {
		let maxSteps = 1000;
		let step = 0;
		while (!this.isEnd() && step < maxSteps) {
			this.mainChecker();
			step++;
		}
	}

	// Главный метод
	mainChecker() {
		const peek = this.peek();
		const next = this.next();

		// Пропуск пробела
		if (
			peek === ' ' ||
			peek === ';' ||
			peek === '\t'
		) this.pos++;

		// Следующая строка
		else if (peek === '\n') this.nextRow();

		// Однострочные комментарии
		else if (peek === '#') this.commentLineChecker();

		// Многострочные комментарии
		else if (peek === '/' && next === '*') this.commentLinesChecker();

		// Числа иной системы счисления
		else if (
			peek === '0' &&
			(next === 'b' || next === 'o' || next === 'x')
		) this.differentNumberChecker();

		// Числа
		else if (peek.match(/[0-9]+/)) this.numberChecker();

		// Идентификатор
		else if (peek.match(/[A-Za-z]+/)) this.wordChecker();

		// Строки
		else if (Lexer.stringSymbols.includes(peek)) this.stringChecker();

		// Арифметика
		else if (Lexer.arithmeticSymbols.includes(peek)) this.arithmeticSymbolsChecker();

		// Битовые операции
		else if (Lexer.bitWorkSymbols.includes(peek)) this.bitWorkChecker();

		// Сравнение
		else if (Lexer.comparisonSymbols.includes(peek)) this.comparisonChecker();

		// Одиночные символы
		else if (
			Lexer.parenthesesSymbols.includes(peek) ||
			Lexer.singleOperators.includes(peek)
		) this.singleSymbolsChecker();
	}

	// Вспомогательные методы

	peek() {
		return this.code[this.pos];
	}

	next() {
		return this.code[this.pos + 1];
	}

	isEnd() {
		return this.pos >= this.code.length;
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

	// Комментарии

	commentLineChecker() {
		while (!this.isEnd() && this.peek() !== '\n') {
			this.pos++;
		}
	}

	commentLinesChecker() {
		this.pos += 2;

		while (!this.isEnd() && !(this.peek() === '*' && this.next() === '/')) {
			this.pos++;
		}

		this.pos += 2;
	}

	// Числа

	differentNumberChecker() {
		const next = this.next();
		let number = this.peek() + this.next();
		let type = 'number';

		this.pos += 2;

		while (!this.isEnd() && this.peek().match(this.differentNumberCheckerComp(next))) {
			number += this.peek();
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
		let number = this.peek();
		let type = 'int';

		this.pos++;

		while (!this.isEnd() && this.peek().match(/[0-9]+/)) {
			number += this.peek();
			this.pos++;
		}

		if (this.peek() === '.') {
			number += '.';
			type = 'float';
			this.pos++;

			while (!this.isEnd() && this.peek().match(/[0-9]+/)) {
				number += this.peek();
				this.pos++;
			}
		}

		number = eval(number);

		this.addToken(number, type, this.row);
	}

	// Ключевые слова и идентификаторы

	wordChecker() {
		let word = '';
		let type = 'identifier';

		while (!this.isEnd() && this.peek().match(/[A-Za-z0-9]+/)) {
			word += this.peek();
			this.pos++;
		}

		if (
			Lexer.valueWords.includes(word) ||
			Lexer.keyWords.includes(word)
		) type = word;

		this.addToken(word, type, this.row);
	}

	// Строка

	stringChecker() {
		const symbol = this.peek();
		let string = symbol;
		let type = 'string';

		this.pos++;

		while (!this.isEnd() && this.peek() !== symbol) {
			string += this.peek();
			this.pos++;
		}

		this.pos++;
		string += symbol;

		//if (symbol === '`') type = 'nestString';

		this.addToken(string, type, this.row);
	}

	// Операторы

	arithmeticSymbolsChecker() {
		let operator = this.peek();

		this.pos++;

		if (['+', '-', '*'].includes(this.peek()) && this.peek() === operator) {
			operator += this.peek();

			if (this.peek() === '*' && this.next() === '=') {
				operator += this.next();
				this.pos += 2;
			}

			this.pos++;
		} else if (this.peek() === '=') {
			operator += this.peek();
			this.pos++;
		}

		this.addToken(operator, operator, this.row);
	}

	bitWorkChecker() {
		let operator = this.peek();
		this.pos++;
		this.addToken(operator, operator, this.row);
	}

	comparisonChecker() {
		let operator = this.peek();

		this.pos++;

		if (operator === '=' && this.peek() === '=') {
			operator += '=';
			this.pos++;
		} else if (operator !== '=') {
			if (this.peek() === '=') {
				operator += '=';
				this.pos++;
			} else if (
				['<', '>'].includes(operator) &&
				operator === this.peek()
			) {
				operator += this.peek();
				this.pos++;
			}
		}

		this.addToken(operator, operator, this.row);
	}

	// Скобки и иные одиночные символы

	singleSymbolsChecker() {
		let symbol = this.peek();

		this.pos++;

		if (symbol === '.' && this.peek() === '.' && this.next() === '.') {
			symbol += '..';
			this.pos += 2;
		}

		this.addToken(symbol, symbol, this.row);
	}
}
