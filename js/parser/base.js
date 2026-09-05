class ParserPosManager {
	static pos = 0;
	static tokens = [];

	// Работа с позицией

	static back() {
		return this.tokens[this.pos - 1];
	}

	static peek() {
		return this.tokens[this.pos];
	}

	static next() {
		return this.tokens[this.pos + 1];
	}

	static isEnd() {
		return this.pos >= this.tokens.length;
	}

	// Заглядывание вперёд

	static expect(type, value) {
		return this.expectType(type) && this.expectValue(value);
	}

	static expectType(type) {
		const temp = this.next()?.type === type;

		if (!temp) this.error(`В строке ${this.peek()?.row} ожидался тип ${type}, но был получен: ${this.next()?.type}`);

		return temp;
	}

	static expectValue(value) {
		const temp = this.next()?.value === value;

		if (!temp) this.error(`В строке ${this.peek()?.row} ожидалось ${value}, но был получен: ${this.next()?.value}`);

		return temp;
	}

	// Логирование

	static error(message) {
		throw new Error(message);
	}

	// Разное

	static init(tokens) {
		this.clean();
		this.tokens = tokens;
	}

	static clean() {
		this.pos = 0;
		this.tokens = [];
	}
}

class ParserBase {
	back() {return ParserPosManager.back()}
	peek() {return ParserPosManager.peek()}
	next() {return ParserPosManager.next()}
	isEnd() {return ParserPosManager.isEnd()}

	expect(type, value) {
		return ParserPosManager.expect(type, value);
	}
	expectType(type) {
		return ParserPosManager.expectType(type);
	}
	expectValue(value) {
		return ParserPosManager.expectValue(value);
	}

	error(message) {
		return ParserPosManager.error(message);
	}

	errorString(e) {
		return this.error(`В строке ${this.back()?.row} ожидался "${e}", но был получен: ${this.peek()?.value} (${this.peek()?.type})`);
	}
}
