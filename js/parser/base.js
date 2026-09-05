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
		const temp = this.peek()?.type === type && this.peek()?.value === value;

		if (!temp) {
			this.error(`В строке ${this.back()?.row} ожидалось ${value} (${type}), но был получен: ${this.peek()?.value} (${this.peek()?.type})`);
		}
	}

	static expectType(...type) {
		const temp = type.includes(this.peek()?.type);

		if (!temp) {
			this.error(`В строке ${this.back()?.row} ожидались типы (${type}), но был получен: ${this.peek()?.type}`);
		}
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

	expect(type, value) {return ParserPosManager.expect(type, value)}
	expectType(...type) {return ParserPosManager.expectType(type)}

	error(message) {return ParserPosManager.error(message)}

	errorString(e) {
		return this.error(`В строке ${this.back()?.row} ожидался "${e}", но был получен: ${this.peek()?.value} (${this.peek()?.type})`);
	}
}
