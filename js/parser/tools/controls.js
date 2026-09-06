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
		this.expect('if', 'if');
		ParserPosManager.pos++;

		this.expect('(', '(');
		ParserPosManager.pos++;

		const test = new ParserExpressions().parseExpression();

		this.expect(')', ')');
		ParserPosManager.pos++;

		const consequent = new ParserStatements().parseBlock();
	}

	// match-case
	parseMatchStatement() {}

	parseMatchCase() {}

	// Цикл while
	parseWhileStatement() {}
}
