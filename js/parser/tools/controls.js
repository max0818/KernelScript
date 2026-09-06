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
	parseMatchStatement() {
		this.expect('match', 'match');
		ParserPosManager.pos++;

		this.expect('(', '(');
		ParserPosManager.pos++;

		const test = new ParserExpressions().parseExpression();

		this.expect(')', ')');
		ParserPosManager.pos++;

		this.expect('{', '{');
		ParserPosManager.pos++;

		const cases = [];
		let hasWildcard = false;

		while (!this.isEnd() && this.peek()?.type !== '}') {
			const caseNode = this.parseMatchCase();
			cases.push(caseNode);

			if (caseNode.pattern.type === '_') {
				if (hasWildcard) {
					this.error(`В строке ${0} "_" уже был использован до этого`);
				}

				hasWildcard = true;
			} else if (hasWildcard) {
				this.error(`В строке ${0} case с "_" должен быть последним, после которого больше ничего не идёт`);
			}
		}

		this.expect('}', '}');
		ParserPosManager.pos++;

		return {
			type: 'MatchStatement',
			test,
			cases
		};
	}

	parseMatchCase() {
		this.expect('case', 'case');
	}

	// Цикл while
	parseWhileStatement() {}
}
