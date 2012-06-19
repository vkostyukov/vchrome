/*!
 * VChrome is Chrome Extension for VKontakte (http://vk.com).
 *
 * Version: 0.4.0 (Jun 2012)
 *
 * Copyright 2012, Vladimir Kostyukov (http://vkostyukov.ru)
 * License: http://www.apache.org/licenses/LICENSE-2.0.html
 * Project page: https://github.com/vkostyukov/vchrome
 *
 */

(function($) {
	var frozen = false;

	var checksum = function (string) {
		var chk = 0x123456789;
		for (var i = 0; i < string.length; i++) {
			chk += (string.charCodeAt(i) * i);
		}
		return chk;
	};

	var methods = {
		audio: function() {
			if (frozen) return;
			frozen = true;

			var infoWidth = $("td.info", this).css("width");
			var chk = checksum(infoWidth);
			if (chk == $(this).attr("vch-checksum")) {
				frozen = false;
				return;
			}

			if ($(this).attr("vch-checksum") == undefined) {
				var title = $("td.info .title_wrap", this).text()
					|| $("td.info .audio_title_wrap", this).text();
				var path = $("table tbody tr td.play_btn input", this).attr("value")
					|| $("table tbody tr td input", this).attr("value");

				path = path.split(",")[0];

				title = title.replace(/\s+$/, "");
				title = title.replace(/\"/gi, "");

				var blueImage = chrome.extension.getURL("img/disk-blue.png");
				var blueStyle = "width:16px;height:16px;float:left;padding-right:2px;background:url('" + blueImage + "') no-repeat;";
				var blueButton = "<a title=\"Download as " + title + ".mp3\" href=\"" + path + "\" download=\"" + title + ".mp3\" style=\"" + blueStyle + "\"></a>";

				$("td.info", this).before("<td>" + blueButton + "</td>");
			}

			var titleHandler = function(index, value) {
				return value.substring(0, value.length - 2) - 16 + "px";
			};

			var infoHandler = function(index, value) {
				if (value != infoWidth) return value;
				return value.substring(0, value.length - 2) - 24 + "px";
			};

			$("td.info .audio_title_wrap", this).css("width", titleHandler);
			$("td.info .title_wrap", this).css("width", titleHandler);

			$(this).attr("vch-checksum", chk);

			// TODO: add support fo white button in version 0.5
//			$("td.play_btn", this).bind("click", function() {
//				var whiteImage = chrome.extension.getURL("img/disk-white.png");
//				var whiteStyle = "width:12px;height:12px;float:left;margin-top:12px;padding-right:4px;margin-left:4px;background:url('" + whiteImage + "') no-repeat;";
//				var whiteButton = "<a onmouseover=\"showTooltip(this, {content: '&lt;div class=gp_tip_text&gt;Download as "+ title + " .mp3&lt;/div&gt;',className:'gp_tip',shift:[4,12]});\" href=\"" + path + "\" download=\"" + title + ".mp3\" style=\"" + whiteStyle + "\"></a>";
//
//				$("#audio_global #gp_large .play_btn").after(whiteButton);
//			});
//
//			$("#gp_audio_info_large").css("width", "310px");
//			$("#gp_duration.duration").css("right", "20px");

			frozen = false;
		}
	};

	$.fn.vchrome = function(method) {
		if (methods[method]) {
			return this.each(methods[method]);
		} else {
			$.error("Method " +  method + " doesn't exist on jQuery.vchrome");
		}
	};
})(jQuery);

$(document).ready(function() {
	$("#page_body").bind("DOMSubtreeModified", function() {
		$(".audio", this).vchrome("audio");
	});
});