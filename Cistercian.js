class Cistercian {
	constructor(canvas) {
		let options = {
			symbols: {
				'root': [[0,-2,0,2]],
				"1": [[0,-2,1,-2]],
				"2": [[0,-1,1,-1]],
				"3": [[0,-2,1,-1]],
				"4": [[0,-1,1,-2]],
				"5": ["4","1"],
				"6": [[1,-2,1,-1]],
				"7": ["6","1"],
				"8": ["6","2"],
				"9": ["8","1"]
			},
			parser: (word) => {
				return ( "0000" + word ).substr(-4);
			},
			renderBase: (wr, word) => {
				wr.renderSymbol("root");
			},
			renderChar: (wr, char, pos) => {
				if ( pos == 3 ) {
					wr.renderSymbol(char); // units
				} else if ( pos == 2 ) {
					wr.mirrorX();
					wr.renderSymbol(char); // tens
				} else if ( pos == 1 ) {
					wr.mirrorY();
					wr.renderSymbol(char); // hundreds
				} else if ( pos == 0 ) {
					wr.mirrorX();
					wr.mirrorY();
					wr.renderSymbol(char); // thousands
				}
				wr.mirrorReset();
			},
			transform: {x:0.9,y:0.9},
			size: {x:2,y:4}
		};
		let wr = new Wordrender(canvas, options);
		wr.render();
	}
}