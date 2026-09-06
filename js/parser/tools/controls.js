class ParserControls extends ParserBase {
	constructor() {
		super();
	}


	// Флаг
	parseFlagDeclaration() {
		this.expect('flag', 'flag');
		ParserPosManager.pos++;

		this.expectType('identifier');

		const name = this.peek()?.value;
		ParserPosManager.pos++;

		return {
			type: 'FlagDeclaration',
			name
		};
	}

	// if-else
	parseIfStatement() {
		this.expectType('if', 'elif');
		ParserPosManager.pos++;

		this.expect('(', '(');
		ParserPosManager.pos++;

		const test = new ParserExpressions().parseExpression();

		this.expect(')', ')');
		ParserPosManager.pos++;

		const consequent = new ParserStatements().parseBlock();

		let alternate = null;
		if (this.peek()?.type === 'elif') alternate = this.parseIfStatement();
		else if (this.peek()?.type === 'else') {
			ParserPosManager.pos++;
			alternate = new ParserStatements().parseBlock();
		}

		return {
			type: 'IfStatement',
			test,
			consequent,
			alternate
		};
	}

	// match-case
	parseMatchStatement() {}

	parseMatchCase() {}

	// Цикл while
	parseWhileStatement() {}
}
