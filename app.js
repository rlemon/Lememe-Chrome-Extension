(function() {
    var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
        font_family = document.getElementById('font-family'),
        font_color = document.getElementById('font-color'),
        outline_color = document.getElementById('outline-color'),
        text_size = document.getElementById('text-size'),
        outline_size = document.getElementById('outline-size'),
        padding_x = document.getElementById('padding-x'),
        padding_y = document.getElementById('padding-y'),
        api_key = document.getElementById('api-key'),
        input_top = document.getElementById('input_top'),
        input_bottom = document.getElementById('input_bottom'),
        btn_meme = document.getElementById('btn-meme'),
        btn_save = document.getElementById('btn-save'),
        btn_reset = document.getElementById('btn-reset');

	var width, height;

	
    /* Event Handlers */
    function range_input_onchange_handler() {
        this.setAttribute('data-value', this.value);
    }
	function input_onchange_handler() {
		draw();
	}
	/* Text Utility Functions */
	
	// assumes ctx is available.
	function fragmentText(text, maxWidth) {
		var words = text.split(' '),
			lines = [],
			line = "";
		if (ctx.measureText(text).width < maxWidth) {
			return [text];
		}
		while (words.length > 0) {
			while (ctx.measureText(words[0]).width >= maxWidth) {
				var tmp = words[0];
				words[0] = tmp.slice(0, -1);
				if (words.length > 1) {
					words[1] = tmp.slice(-1) + words[1];
				} else {
					words.push(tmp.slice(-1));
				}
			}
			if (ctx.measureText(line + words[0]).width < maxWidth) {
				line += words.shift() + " ";
			} else {
				lines.push(line);
				line = "";
			}
			if (words.length === 0) {
				lines.push(line);
			}
		}
		return lines;
	}
	
	/* Canvas Draw() Function */
	function draw() {
		var top_lines, bottom_lines;
		ctx.clearRect(0, 0, width, height);

		ctx.font = "bold " + text_size.value + "px " + "Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "#" + font_color.value;

		top_lines = fragmentText(input_top.value, width - text_size.value - padding_x.value);
		bottom_lines = (fragmentText(input_bottom.value, width - text_size.value - padding_x.value)).reverse(); // reverse it for bottom up!

		top_lines.forEach(function(line, i) {
			ctx.fillText(line, width / 2, padding_y.value + ((i + 1) * text_size.value));
		});
		bottom_lines.forEach(function(line, i) {
			ctx.fillText(line, width / 2, height - (padding_y.value + (i * text_size.value)));
		});

		if (outline_size.value > 0) {
			ctx.strokeStyle = outline_color.value;
			ctx.lineWidth = outline_size.value;

			top_lines.forEach(function(line, i) {
				ctx.strokeText(line, width / 2, padding_y.value + ((i + 1) * text_size.value));
			});
			bottom_lines.forEach(function(line, i) {
				ctx.strokeText(line, width / 2, height - (padding_y.value + (i * text_size.value)));
			});
		}
	}
	/* Register Events */
	function register_event_handlers() {
		[text_size, outline_size, padding_x, padding_y].forEach(function(input) {
			input.addEventListener('onchange', range_input_onchange_handler, false);
			input_onchange_handler.call(input);
		});
		[input_top, input_bottom].forEach(function(input) {
			input.addEventListener('onkeyup', draw, false);
		});
	}
	
	/* Init */
	function init() {
		width = canvas.width;
		height = canvas.height;
		register_event_handlers();
	}

	init();

}());