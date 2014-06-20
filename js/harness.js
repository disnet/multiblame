var unproxy = new WeakMap();

Str = function(x, blame) {
	var extraBlame = [];
	if (typeof x === 'object' && x && unproxy.has(x)) {
		extraBlame = "\nExtra blame labels: " + unproxy.get(x).labels;
	}
	if (typeof x !== 'string') {
		throw Error("The value " + x + " is not a String\n" +
					"Blaming " + blame + extraBlame);
	}
	return x;
}

Void = function(x, blame) {
	if (x == null) {
		return x;
	}
	throw Error("The value " + x + " is not null or undefined\nBlaming " + blame);
}

Any = function(x, blame) { return x; }

Dyn = function(x, blame) {
	var y = {
		toString: function() {
			return x;
		}
	};
	var p = new Proxy(y, {});	
	unproxy.set(p, {
		labels: [blame]
	});
	return p;
}