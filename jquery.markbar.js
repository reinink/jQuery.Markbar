/**
 * A simple jQuery plugin that adds a WYSIWYG style toolbar to Markdown enabled textareas.
 *
 * @version  1.0
 * @author   Jonathan Reinink <jonathan@reininks.com>
 * @link     https://github.com/reinink/jQuery.Markbar
 */

;(function($, window, document, undefined)
{
	var defaults =
	{
		strong: true,
		em: true,
		h1: true,
		h2: true,
		h3: true,
		ol: true,
		ul: true,
		a: true,
		blockquote: true,
		code: true
	};

	function plugin(element, options)
	{
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this.init();
	}

	plugin.prototype =
	{
		init: function()
		{
			// Create markup
			var html = '<div class="markbar">'
			if (this.options.strong) html += '<a href="#strong" class="strong">Bold</a>';
			if (this.options.em) html += '<a href="#em" class="em">Italicize</a>';
			if (this.options.h1) html += '<a href="#h1" class="h1">Heading 1</a>';
			if (this.options.h2) html += '<a href="#h2" class="h2">Heading 2</a>';
			if (this.options.h3) html += '<a href="#h3" class="h3">Heading 3</a>';
			if (this.options.ol) html += '<a href="#ol" class="ol">Ordered List</a>';
			if (this.options.ul) html += '<a href="#ul" class="ul">Unordered List</a>';
			if (this.options.a) html += '<a href="#a" class="a">Link</a>';
			if (this.options.blockquote) html += '<a href="#blockquote" class="blockquote">Blockquote</a>';
			if (this.options.code) html += '<a href="#code" class="code">Code</a>';
			html += '</div>';

			// Insert
			this.toolbar = $(html).insertBefore(this.element);

			// Setup events
			var self = this;

			// Toolbar events
			this.toolbar.find('a').on('click', function()
			{
				self[$(this).attr('class')]();
				return false;
			});

			// Tabbing
			$(this.element).on('keydown', function(event)
			{
				if (event.keyCode === 9)
				{
					self.tab(event);
					return false;
				}
			});
		},

		strong: function()
		{
			this.replace('**' + this.get().text + '**');
		},

		em: function()
		{
			this.replace('*' + this.get().text + '*');
		},

		h1: function()
		{
			var text = this.get().text;
			text += '\n' + Array(text.length + 1).join('-');
			this.replace(text);
		},

		h2: function()
		{
			this.replace('## ' + this.get().text);
		},

		h3: function()
		{
			this.replace('### ' + this.get().text);
		},

		ol: function()
		{
			var rows = this.get().text.split('\n');
			var replace = '';
			var number = 1;

			$.each(rows, function(index, value)
			{
				if (value.length)
				{
					replace += number + '. ' + value + '\n';
					number++;
				}
				else
				{
					if (replace === '' || rows.slice(index).join('').replace(/^\s+|\s+$/g, '').length === 0)
					{
						replace += '\n';
					}
				}
			});

			this.replace(replace.slice(0, -1));
		},

		ul: function()
		{
			var rows = this.get().text.split('\n');
			var replace = '';

			$.each(rows, function(index, value)
			{
				if (value.length)
				{
					replace += '- ' + value + '\n';
				}
				else
				{
					if (replace === '' || rows.slice(index).join('').replace(/^\s+|\s+$/g, '').length === 0)
					{
						replace += '\n';
					}
				}
			});

			this.replace(replace.slice(0, -1));
		},

		a: function()
		{
			if (url = prompt('Enter your URL:'))
			{
				this.replace('[' + this.get().text + '](' + url + ')');
			}
		},

		blockquote: function()
		{
			this.replace('> ' + this.get().text.split('\n').join('\n> '));
		},

		code: function()
		{
			this.replace('    ' + this.get().text.split('\n').join('\n    '));
		},

		tab: function()
		{
			var selection = this.get();
			this.replace('    ' + selection.text.split('\n').join('\n    '), false);
		},

		get: function()
		{
			var e = this.element;

			return (

				// Mozilla, Webkit
				('selectionStart' in e && function()
				{
					var l = e.selectionEnd - e.selectionStart;

					return {
						start: e.selectionStart,
						end: e.selectionEnd,
						length: l,
						text: e.value.substr(e.selectionStart, l)
					};

				}) ||

				// Internet Explorer
				(document.selection && function()
				{
					e.focus();

					var r = document.selection.createRange();

					if (r === null)
					{
						return {
							start: 0,
							end: e.value.length,
							length: 0
						}
					}

					var re = e.createTextRange();
					var rc = re.duplicate();
					re.moveToBookmark(r.getBookmark());
					rc.setEndPoint('EndToStart', re);

					return {
						start: rc.text.length,
						end: rc.text.length + r.text.length,
						length: r.text.length,
						text: r.text
					};

				}) ||

				// Not supported
				function()
				{
					return null;
				}

			)();
		},

		replace: function(text, select)
		{
			var e = this.element;

			return (

				// Mozilla, Webkit
				('selectionStart' in e && function()
				{
					var start = e.selectionStart;
					e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);

					if (select === true || select === undefined)
					{
						e.selectionStart = start;
						e.selectionEnd = start + text.length;
					}
					else
					{
						e.selectionStart = e.selectionEnd = start + text.length;
					}

					return this;

				}) ||

				// Internet Explorer
				(document.selection && function()
				{
					e.focus();
					document.selection.createRange().text = text;
					return this;
				}) ||

				// Not supported
				function()
				{
					e.value += text;
					return jQuery(e);
				}

			)();
		},

	};

	$.fn['markbar'] = function(options)
	{
		return this.each(function()
		{
			if (!$.data(this, 'plugin_markbar'))
			{
				$.data(this, 'plugin_markbar', new plugin(this, options));
			}
		});
	}

})(jQuery, window, document);