Prototype.AJAX-Rating-Stars
===========================

AJAX Rating Stars using PrototypeJS

Mirrored from http://beauscott.com/examples/RatingStars/


Rating Stars requires [PrototypeJS](http://prototypejs.org/download) and the stars.js script

```html
<script src="prototype.js" type="text/javascript"></script>
<script src="stars.min.js" type="text/javascript"></script>
```

You can put the rating stars in a container like so

```html
<span id="mycontainer"></span>
```

```javascript
new Stars({
	container : 'mycontainer'
});
```

or bind it to a form field

```html
<input type="text" name="myformfield" id="myformfield" />
```

```javascript
new Stars({
	bindField: 'myformfield',
});
```

take a look at the example file for more examples and more parameters