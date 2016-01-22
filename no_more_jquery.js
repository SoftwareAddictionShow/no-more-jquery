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

// FIXME: Use a unique random number, rather than this global
var g_anim_counter = 0;
function animateCSS(element, start_fields, end_fields, duration, iteration_count, direction) {
	iteration_count = iteration_count || 1;
	direction = direction || 'normal';
	var anim_name = 'anim_' + (++g_anim_counter);

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = "\
	." + anim_name + " {\
		animation-duration: " + duration + ";\
		animation-name: " + anim_name + ";\
		animation-iteration-count: " + iteration_count + ";\
		animation-direction: " + direction + ";\
	}\
	@keyframes " + anim_name + " {\
		from {\
			" + start_fields + "\
		}\
	}\
	@keyframes " + anim_name + " {\
		to {\
			" + end_fields + "\
		}\
	}";
	document.getElementsByTagName('head')[0].appendChild(style);

	element.addEventListener('animationstart', function() {
		console.info('animationstart');
	}, false);
	element.addEventListener('animationend', function() {
		console.info('animationend');
		document.getElementsByTagName('head')[0].removeChild(style);
	}, false);
	element.addEventListener('animationiteration', function() {
		console.info('animationiteration');
	}, false);
	element.className = anim_name;
}

function animateValue(cb, old_value, new_value, duration) {
	var is_bigger = old_value > new_value;
	var diff_value = is_bigger ? old_value - new_value : new_value - old_value;
	var start_time = new Date().getTime();
	var frame_ms = 16.66666666666667;

	var animation_interval = setInterval(function() {
		var now_time = new Date().getTime();
		var elapsed_time = now_time - start_time;
		var percent = elapsed_time / duration;
		if (percent >= 1.0) {
			percent = 1.0;
			clearInterval(animation_interval);
		}

		var trans_value = 0;
		if (is_bigger) {
			trans_value = old_value - (diff_value * percent);
		} else {
			trans_value= old_value + (diff_value * percent);
		}
		cb(trans_value);
	}, frame_ms);
}
