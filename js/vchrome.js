/*!
 * VChrome is Chrome Extension for VKontakte.
 *
 * Version: 0.2.0 (Jan 2012)
 *
 * Copyright 2011, Vladimir Kostyukov (http://vkostyukov.ru)
 * License: http://www.apache.org/licenses/LICENSE-2.0.html
 */

(function($) {
	var frozen = false;

	var methods = {
		audio: function() {
			if (frozen || $(this).attr("vch-processed") == "true") return;

			frozen = true;
			$(this).attr("vch-processed", "true");

			var title = $("td.info .title_wrap", this).text()
				|| $("td.info .audio_title_wrap", this).text();
			var path = $("table tbody tr td.play_btn input", this).attr("value")
				|| $("table tbody tr td input", this).attr("value");

			path = path.split(",")[0];

			title = title.substring(0, title.length - 1);
			title = title.replace(/\"/gi, "&quot;");

			var image = chrome.extension.getURL("img/download.png");
			var style = "width:16px;height:16px;float:right;padding-right:2px;margin-top:2px;background:url('" + image + "') no-repeat;";
			var button = "<a title=\"Download as " + title + ".mp3\" href=\"" + path + "\" download=\"" + title + ".mp3\" style=\"" + style + "\"></a>";

			$("table tbody tr td.info", this).after("<td>" + button + "</td>");

			frozen = false;
		}
	};

	$.fn.vchrome = function(method) {
		if (methods[method]) {
			return this.each(methods[method]);
		} else {
			$.error("Method " +  method + " does not exist on jQuery.vkontakte");
		}
	};
})(jQuery);

$(document).ready(function() {
	$("#page_body").bind("DOMSubtreeModified", function() {
		$(".audio", this).vchrome("audio");
	});
});