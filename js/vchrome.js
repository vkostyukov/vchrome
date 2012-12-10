/*!
 * VChrome is Chrome Extension for VKontakte (http://vk.com).
 *
 * Version: 0.6 (Dec 2012)
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

      var cutter = function(index, value) {
        return parseInt(value.substring(0, value.length - 2)) - 22 + "px";
      };

      var infoWidth = $(".info", this).css("width");
      var chk = checksum(infoWidth);
      if (chk == $(this).attr("vch-checksum")) {
        frozen = false;
        return;
      }

      if ($(this).attr("vch-checksum") == undefined) {

        // if the location is "vk.com/audio"
        var isAudioPage = $(this).parent("#initial_list").length > 0;

        var title = $(".info .title_wrap", this).text()
            || $(".info .audio_title_wrap", this).text();
        var path = $("table tbody tr td.play_btn input", this).attr("value")
            || $("table tbody tr td input", this).attr("value")
            || $(".area .play_btn input", this).attr("value");

        path = path.split(",")[0];

        title = title.replace(/\s+$/, "");
        title = title.replace(/\"/gi, "");

        var blueImage = chrome.extension.getURL("img/disk-blue.png");
        var blueStyle = "";
        if (isAudioPage) {
          blueStyle = "width:16px;height:16px;float:left;padding-right:4px;margin-top:4px;margin-left:-4px;background:url('" + blueImage + "') no-repeat;";
        } else {
          blueStyle = "width:16px;height:16px;float:left;padding-right:4px;margin-top:6px;background:url('" + blueImage + "') no-repeat;";
        }
        var blueButton = "<a title=\"Download as " + title + ".mp3\" href=\"" + path + "\" download=\"" + title + ".mp3\" style=\"" + blueStyle + "\"></a>";

        $(".area .info", this).before("<td class=\"fl_l\">" + blueButton + "</td>");

        if (isAudioPage) {
          $(".area .info", this).css("width", cutter);
        }
      }

      $(".info .audio_title_wrap", this).css("width", cutter);
      $(".info .title_wrap", this).css("width", cutter);

      $(this).attr("vch-checksum", chk);

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