// Copyright (c) 2016 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// This software uses a MIT style license
// https://github.com/SoftwareAddictionShow/no-more-jquery
//"use strict";

// Great website for reasons not to use jquery:
// http://youmightnotneedjquery.com

function $one(selector) {
	return document.querySelector(selector);
}

function $all(selector) {
	return document.querySelectorAll(selector);
}

// TODO: Change to use a data-attribute when IE 10 goes out of support
// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
HTMLElement.prototype.hide = function(id) {
	this.setAttribute('display-orig', this.style.display);
	this.style.display = 'none';
};

HTMLElement.prototype.show = function(id) {
	this.style.display = this.getAttribute('display-orig');
};

function documentOnReady(cb) {
	if (document.readyState !== 'loading') {
		cb();
	} else {
		document.addEventListener('DOMContentLoaded', cb);
	}
}

function httpGet(url, cb, timeout) {
	httpRequest(url, 'GET', cb, timeout);
}

function httpPost(url, cb, timeout) {
	httpRequest(url, 'POST', cb, timeout);
}

function httpRequest(url, method, cb, timeout) {
	timeout = timeout | 3000;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState === 4) {
			cb(this.response, this.status);
		} else if (this.readyState === 0) {
			cb(null);
		}
	};
	xhr.onerror = function() {
		cb(null);
	};
	xhr.open(method, url, true);
	xhr.timeout = timeout;
	xhr.send(null);
}

// TODO
// animate
