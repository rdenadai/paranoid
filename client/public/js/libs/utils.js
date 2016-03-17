String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.isEmpty = function() {
    return ($.trim(this).length > 0) ? false : true;
};

function isValidDate(d) {
    if(Object.prototype.toString.call(d) !== "[object Date]")
        return false;
    return !isNaN(d.getTime());
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
};

function roundNumber(num) {
    num = new String(num).replace(',', '.');
    return (Math.floor(num * 100) / 100).toFixed(2).replace('.', ',');
}

function isFloat(n) {
    return n === +n && n !== (n|0);
}

function isInteger(n) {
    return n === +n && n === (n|0);
}

function HtmlEncode(s) {
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}

if(!String.linkify) {
    String.prototype.linkify = function() {
        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        // Email addresses
        var emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;
        return this
            .replace(urlPattern, '<a href="$&" target="blank">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2" target="blank">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&" target="blank">$&</a>');
    };
}
