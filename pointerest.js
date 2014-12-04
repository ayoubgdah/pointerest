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
			animationSpeed: 300,
			radius: 10,
			color: "#333",
			lineHeight: 2,
			direction: null,
			margin: {
				top: 0,
				right: 20,
				bottom: 0,
				left: 20
			}
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
			// as a class
			else if( node.element.hasClass("left") ) {
				return "left";
			}
			else if( node.element.hasClass("right") ) {
				return "right";
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
			var width = 0;

			switch( node.direction ) {
				case "left":
					width = node.x + this.options.margin.left;
					break;
				case "right":
					width = this.wrapperWidth - node.x - this.options.radius * 2 + this.options.margin.right;
					break;
			}

			return width;
		},
		getContentPosition: function(node) {

			var x = 0;

			switch( node.direction ) {
				case "left":
					x = - this.getLineLength(node) - node.content.outerWidth();
					break;
				case "right":
					x = this.getLineLength(node) + this.options.margin.right;
					break;
			}

			return {
					'margin-top': - node.content.outerHeight() / 2,
					'left': x
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
					'height': _this.options.lineHeight,
					'margin-top': - _this.options.lineHeight / 2,
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
					node.line.stop().animate({
						'width': lineWidth,
					}, _this.options.animationSpeed, function(){
						node.content.stop().fadeIn(_this.options.animationSpeed);
					});

				}).on("mouseleave", function(){
					
					// Hide the content first and then the line
					node.content.stop().fadeOut(_this.options.animationSpeed / 2, function(){
						node.line.stop().animate({
							'width': 0
						}, _this.options.animationSpeed / 2, function(){
							// Set the default z-index back
							node.element.css({
								'z-index': ''
							});
						});
					});
				});

			});

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