(function( $ ) {

	var Pointerest = function(wrapper, arg1, arg2) {
		this.wrapper = wrapper;
		this.wrapperWidth = 0;
		this.wrapperHeight = 0;
		this.pointNodes = [];
		this.userNodes = [];

		var arg1Type = Object.prototype.toString.call( arg1 ),
			arg2Type = Object.prototype.toString.call( arg2 );

		// first argument are options
		if( arg1Type === "[object Object]" ) {
			jQuery.extend(this.options, arg1);
		}
		// first argument are user nodes
		else if( arg1Type === "[object Array]" ) {
			this.userNodes = arg1;

			// second option could be options
			jQuery.extend(this.options, arg2);
		}

		// initialize elements
		this.init();
	};

	Pointerest.prototype = {
		options: {
			radius: 10,
			color: "#333",
			lineThikness: 2,
			direction: null,
			margin: {
				top: 10,
				right: 10,
				bottom: 10,
				left: 10
			},
			animationSpeed: 300
		},
		init: function() {
			this.setupWrapper();
			this.setupNodes();
		},
		setupWrapper: function() {

			this.wrapper.addClass("pointerest");

			this.wrapper.css({
				'position': 'relative'
			});
			this.wrapperWidth = this.wrapper.innerWidth();
			this.wrapperHeight = this.wrapper.innerHeight();
		},
		setupNodes: function() {
			var _this = this;

			// user has given the points as array
			if( this.userNodes.length ) {
				this.createNodes();
			}

			this.wrapper.find('.point').each(function(node){

				var element = $(this),
					x = element.data("x") ? element.data("x") : 0,
					y = element.data("y") ? element.data("y") : 0,
					color = element.data("color") ? element.data("color") : _this.options.color,
					radius = element.data("radius") ? element.data("radius") * 2 : _this.options.radius * 2,
					direction = element.data("direction");

				var node = {
					element: element,
					x: x,
					y: y,
					radius: radius,
					color: color,
					direction: direction
				};

				node.direction = _this.getDirection(node);

				_this.pointNodes.push(node);

			});

			this.positionNodes();
			this.createChildrenElements();
			this.bindEvents();

		},
		positionNodes: function() {

			this.pointNodes.forEach(function(node, index){

				node.element.addClass(node.direction)
				node.element.css({
					'background': node.color,
					'width': node.radius,
					'height': node.radius,
					'top': node.y,
					'left': node.x,
				});

			});

		},
		getDirection: function(node) {

			// as an option linked to the node
			if( node.direction ) {
				return node.direction;
			}
			// as an global option
			else if( this.options.direction ) {
				return this.options.direction;
			}
			// base it on the closest side
			else {
				return (node.x <= this.wrapperWidth / 2) ? 'left' : 'right';
			}
		},
		getLineLength: function(node) {

			// TODO: in case it is %
			var length = 0;

			switch( node.direction ) {
				case "left":
					length = node.x + this.options.margin.left;
					break;
				case "right":
					length = this.wrapperWidth - node.x - this.options.radius * 2 + this.options.margin.right;
					break;
				case "top":
					length =  node.y + this.options.margin.top;
					break;
				case "bottom":
					length = this.wrapperHeight - node.y - this.options.radius * 2 + this.options.margin.bottom;
					break;
			}

			return length;
		},
		getContentPosition: function(node) {

			var x = y = 0;

			switch( node.direction ) {
				case "left":
					x = - this.getLineLength(node) - node.content.outerWidth();
					y = - node.content.outerHeight() / 2 + this.options.radius;
					break;
				case "right":
					x = this.getLineLength(node) + this.options.radius * 2;
					y = - node.content.outerHeight() / 2 + this.options.radius;
					break;
				case "top":
					y = - this.getLineLength(node) - node.content.outerHeight();
					x = - node.content.outerWidth() / 2 + this.options.radius;
				break;
				case "bottom":
					y = this.getLineLength(node) + this.options.radius * 2;
					x = - node.content.outerWidth() / 2 + this.options.radius;
				break;
			}

			return {
					'left': x,
					'top': y
				};
		},
		createNodes: function() {
			this.userNodes.forEach(function(node){

				var htmlElement = $("<span>", {"class": "point"});
				
				htmlElement.data("x", node.x);
				htmlElement.data("y", node.y);
				htmlElement.data("content", node.content);
				htmlElement.data("color", node.color);
				htmlElement.data("radius", node.radius);
				htmlElement.data("direction", node.direction);

				this.wrapper.append(htmlElement);

			}.bind(this));
		},
		createChildrenElements: function() {

			var _this = this;

			this.pointNodes.forEach(function(node, index){

				var line = $("<span>", {"class": "line"}),
					content = $("<span>", {"class": "content"});

				// Create the line for the point
				node.element.append( line );
				node.line = line;
				line.css({
					'background': node.color
				});

				// Create the content for the node
				node.element.append( content );
				node.content = content;
				content.html( node.element.data("content") );

				// The content takes the point's color
				content.css({
					'background-color': node.color
				});

				// positioning of the content
				content.css( _this.getContentPosition(node) );

			});

		},
		bindEvents: function() {

			var _this = this;

			this.pointNodes.forEach(function(node){

				var lineWidth = _this.getLineLength(node);

				node.element.on("mouseenter", function(){

					// Avoid being under another point
					node.element.css({
						'z-index': _this.pointNodes.length + 1,
					});

					// Show the line and after that the content
					_this.animateLine(node, true);
					node.content.stop().fadeIn(_this.options.animationSpeed);

				}).on("mouseleave", function(){
					
					_this.animateLine(node, false);
					node.element.css({
						'z-index': ''
					});

					// Hide the content first and then the line
					node.content.stop().fadeOut();
				});

			});

		},
		animateLine: function (node, expand) {
			var _this = this,
				length = 0,
				animation = null;

			if( expand ) {
				length = _this.getLineLength(node);
			}

			switch(node.direction) {
				case "left":
				case "right":

					node.line.css({
						'height': _this.options.lineThikness,
						'width': 0,
						'margin-top': - _this.options.lineThikness / 2
					});
					animation = { 'width': length };
					break;

				case "top":
				case "bottom":

					node.line.css({
						'width': _this.options.lineThikness,
						'height': 0,
						'margin-left': - _this.options.lineThikness / 2
					});
					animation = { 'height': length };
					break;
			}

			node.line.stop().animate(animation);

		},
		destroy: function() {
			// TODO: better removal of elements
			this.wrapper.find(".point").remove();
			this.wrapper.css({
				'position': ''
			});
			this.wrapper.removeClass("pointerest");
		}
	};

	// Register plugin for jQuery
	$.fn.Pointerest = function(arg1, arg2) {
		return new Pointerest(this, arg1, arg2);
	};

}( jQuery ));