class Tally {
	constructor(canvas) {
		let options = {
			symbols: {
				"1": [[-1.5,-1,-1.5,1]],
				"2": ["1",[-0.5,-1,-0.5,1]],
				"3": ["2",[0.5,-1,0.5,1]],
				"4": ["3",[1.5,-1,1.5,1]],
				"5": ["4",[-2,-0.5,2,0.5]],
			},
			renderBase: (wr, word) => {
				wr.renderSymbol(word);
			},
            size: {x:4,y:2}
		};
        let wr = new Wordrender(canvas, options);
		wr.render();
	}
}