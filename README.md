jQuery.Markbar
==============

## Introduction

Markbar is a simple jQuery plugin that adds a WYSIWYG style toolbar to "[Markdown](http://daringfireball.net/projects/markdown/) enabled" textareas. This is helpful for users not familiar with the Markdown syntax. You can view a [demo here](http://reinink.me/markbar/).

[![jQuery.Markbar Screenshot](http://reinink.me/markbar/screenshot.png)](http://reinink.me/markbar/)

## Basic usage

Markbar is super easy to use. Here is the most basic usage, which will enable all the available toolbar options.

	<script src="jquery.js"></script>
	<script src="jquery.markbar/jquery.markbar.js"></script>
	<link rel="stylesheet" href="jquery.markbar/themes/default/default.css">
	<script>
		$(function()
		{
			$('textarea').markbar();
		});
	</script>

	<textarea></textarea>

## Customize

If you want to limit which options are displayed in the toolbar, simply disable the ones you don't want:

	$('textarea').markbar(
	{
		blockquote: false,
		code: false
	});

Here is the complete list of all the available toolbar options:

- strong
- em
- h1
- h2
- h3
- ul
- ol
- a
- img
- blockquote
- code

## Questions or comments?

Send me a message on Twitter at [@reinink](https://twitter.com/reinink).