class Wordrender { 
	constructor(canvas, options) {
		this.canvas = canvas;
		this.word = this.canvas.dataset.word;
		this.canvas.wordrender = this; // rename to some general purpose name
		this.ctx = canvas.getContext("2d");
		this.scale = 1;
		this.offset = { x:1, y:2 };
		this.transformDefault = { x:1.0, y:1.0 };

        this.symbols = {};
        
        this.setOptions(options);
	}

    setOptions = (options) => {
        let defaults = {
			symbols: {},
			parser: (word) => { return word; },
			renderBase: (wr, word) => {},
			renderChar: (wr, char, pos) => {},
            transform: {x:1,y:1},
            size: {x:4,y:4},
            color: "#000"
        };
        
        this.options = {...defaults, ...options};

        this.setTransform(this.options.transform);
        this.setSize(this.options.size)

        this.symbols = {};
        this.addSymbols(this.options.symbols);
    };

	setTransform = (newtransform) => {
		this.options.transform.x = newtransform.x;
		this.options.transform.y = newtransform.y;	
		this.transformDefault.x = newtransform.x;
		this.transformDefault.y = newtransform.y;
	};

    setSize = (size) => {
        this.options.size = size;
        this.offset = {x: size.x/2, y: size.y/2};
    }

	calcScale = () => {
        let w = this.canvas.clientWidth;
        let h = this.canvas.clientHeight;

        if ( this.options.size.x > this.options.size.y ) {
            this.scale = h / this.options.size.y;
        } else {
            this.scale = w / this.options.size.x;
        }

        this.canvas.width = this.scale * this.options.size.x;
        this.canvas.height = this.scale * this.options.size.y;
	}

	setWord = (word) => { // public, allows changing the word
		this.word = word;
		this.render(this.ctx);
	};

	getWord = () => {
		return this.options.parser(this.word);
	};

	mirrorX = () => {
		this.options.transform.x = this.options.transform.x * -1;
	};

	mirrorY = () => {
		this.options.transform.y = this.options.transform.y * -1;
	};

	mirrorReset = () => {
		this.setTransform( this.transformDefault );
	}

	clear = () => {
		let ctx = this.ctx;
		let scale = this.scale;
		ctx.clearRect(0, 0, 2 * scale, 4 * scale);
	}

	line = (p1,p2) => {
		this.ctx.beginPath();
		this.ctx.moveTo(p1.x, p1.y);
		this.ctx.lineTo(p2.x, p2.y);
		this.ctx.stroke();
		this.ctx.moveTo(0, 0);
	}

	scaledCoord = ( x, y ) => {
		return {
			x: ( this.offset.x + x * this.options.transform.x ) * this.scale,
			y: ( this.offset.y + y * this.options.transform.y ) * this.scale
		};
	};

    addSymbols = (symbols) => {
        for ( let key in symbols ) {
            this.addSymbol( key, symbols[key] );
        }
    }

	addSymbol = (ref, makeup) => {
		this.symbols[ref] = makeup;
	}

	renderSymbol = (ref) => {
		if ( this.symbols.hasOwnProperty( ref ) ) {
			let makeup = this.symbols[ref];

			for ( let instruction of makeup ) {
				if ( typeof instruction == "string" ) { // reference to another symbol
					this.renderSymbol(instruction);
				} else { // lines!
					let x1 = instruction[0];
					let y1 = instruction[1];
					let x2 = instruction[2];
					let y2 = instruction[3];

					let p1 = this.scaledCoord( x1, y1 );
					let p2 = this.scaledCoord( x2, y2 );
					this.line(p1, p2);
				}
			}
		}
	};

	render = () => {
		this.calcScale();
		this.clear();
        this.ctx.strokeStyle = this.options.color;
		let word = this.getWord();

		this.options.renderBase(this, word);
		for ( let i=0; i != word.length; i++ ) {
			this.options.renderChar(this, word[i], i);
		}
	};
}