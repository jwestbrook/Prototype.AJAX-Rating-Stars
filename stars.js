/**
 * Dynamic Rating stars
 * @copyright 2006 Beau D. Scott http://beauscott.com
 * @
 */
/**
 * http://github.com/jwestbrook/Prototype.AJAX-Rating-Stars
 */

var Stars = Class.create({
	/**
	 * Mouse X position
	 * @var {Number} options
	 */
	_x: 0,
	/**
	 * Mouse X position
	 * @var {Number} options
	 */
	_y: 0,
	/**
	 * Constructor
	 * @param {Object} options
	 */
	initialize: function(options)
	{

		/**
		 * Initialized?
		 * @var (Boolean)
		 */
		this._initialized = false;

		/**
		 * Base option values
		 * @var (Object)
		 */
		this.options = {
			bindField: null,			// Form Field to bind the value to
			maxRating: 5,				// Maximum rating, determines number of stars
			container: null,			// Container of stars
			imagePath: 'images/',		// Path to star images
			callback: null,				// Callback function, fires when the stars are clicked
			actionURL: null,			// URL to call when clicked. The rating will be appended to the end of the URL (eg: /rate.php?id=5&rating=)
			value: 0,					// Initial Value
			locked: false
		};
		Object.extend(this.options, options);
		this.locked = this.options.locked ? true : false;

		this._star_xoffsets = {
			empty: 27,
			full: 0,
			half: 54
		};

		/**
		 * Image sources for hover and user-set state ratings
		 */
		this._starSrc = this.options.imagePath+'starsprite-ps.png';
		/**
		 * Preload images
		 */
			var y = new Image();
			y.src = this._starSrc;

		/**
		 * Images to show for pre-set values, changes when hovered, if not locked.
		 */
		this._setStarSrc = this.options.imagePath+'starsprite.png';

		/**
		 * Preload images
		 */
		 	var y = new Image();
		 	y.src = this._setStarSrc;

		this.value = -1;
		this.stars = [];
		this._clicked = false;


		if(this.options.container)
		{
			this._container = $(this.options.container);
			this.id = this._container.id;
		}
		else
		{
			this.id = 'starsContainer.' + Math.random(0, 100000);
			this._container = new Element('span',{'id':this.id});
			$(this.options.bindField).insert({after:this._container});
		}
		this._display();
		this.setValue(this.options.value);
		this._initialized = true;
	},
	_display: function()
	{
		for(var i = 0; i < this.options.maxRating; i++)
		{
			var star = new Element('img',{
				src : this.options.imagePath+'spacer.png',
				style : 'cursor:pointer;height:30px;width:27px;',
				title : 'Rate as '+(i+1)
			});
			star.setStyle({backgroundImage: 'url('+(this.locked ? this._starSrc : this._setStarSrc)+')' ,backgroundPosition :this._star_xoffsets.empty+'px 0'});
//			star.setStyle({background :'url('+(this.locked ? this._starSrc : this._setStarSrc)+') '+this._star_xoffsets.empty+' 0'});


			!this.locked && star.observe('mouseover',this._starHover.bind(this));
			!this.locked && star.observe('click',this._starClick.bind(this));
			!this.locked && star.observe('mouseout',this._starClear.bind(this));
			this.stars.push(star);
			this._container.insert(star);
		}
	},
	_starHover: function(e)
	{
		if(this.locked) return;
		if(!e) e = window.event;
		var star = e.findElement();

		var greater = false;
		this.stars.each(function(s){
			s.setStyle({backgroundPosition : (greater ? this._star_xoffsets.empty : this._star_xoffsets.full)+'px 0' });
			if(s == star) greater = true;
		},this);
	},
	_starClick: function(e)
	{
		if(this.locked) return;
		if(!e) e = window.event;
		var star = e.findElement();
		this._clicked = true;
		this.stars.each(function(s,index){
			if(s == star)
			{
				this.setValue(index+1);
				throw $break;
			}
		},this);
	},
	_starClear: function(e)
	{
		if(this.locked && this._initialized) return;
		var greater = false;
		this.stars.each(function(s,index){
			if(index > this.value) greater = true;
			console.log('greater='+greater+',value='+this.value+',index='+index);
			console.log((this.value + .5) == index);
			console.log((greater ? (((this.value + .5) == index) ? this._star_xoffsets.half : this._star_xoffsets.empty) : this._star_xoffsets.full));
			s.setStyle({backgroundPosition : (greater ? (((this.value + .5) == index) ? this._star_xoffsets.half : this._star_xoffsets.empty) : this._star_xoffsets.full)+ 'px 0' });
			console.log(s);
		},this);
	},
	/**
	 * Sets the value of the star object, redraws the UI
	 * @param {Number} value to set
	 * @param {Boolean} optional, do the callback function, default true
	 */
	setValue: function(val)
	{
		var doCallBack = arguments.length > 1 ? !!arguments[1] : true;
		if(this.locked && this._initialized) return;
		this.value = val-1; //0-based
		if(this.options.bindField)
			$(this.options.bindField).value = val;
		if(this._initialized && doCallBack)
		{
			if(this.options.actionURL)
				new Ajax.Request(this.options.actionURL + val, {onComplete: this.options['callback'], method: 'get'});
			else
				if(this.options.callback)
					this.options['callback'](val);
		}
		this._starClear();
	}
});