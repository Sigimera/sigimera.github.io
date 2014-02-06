if ( window.jQuery ) {
  statusJQuery = jQuery.noConflict();
  statusJQuery(document).ready(function() {
    startStatusCheck(statusJQuery);
  });
  /* Restore old JQuery */
  jQuery.noConflict(true);
} else {
  // Load the script
  var script = document.createElement("script");
  script.src = 'http://code.jquery.com/jquery-1.10.0.min.js';
  script.type = 'text/javascript';
  document.getElementsByTagName("head")[0].appendChild(script);

  // Poll for jQuery to come into existance
  var checkReady = function(callback) {
    if (window.jQuery) {
      callback(jQuery);
    }
    else {
      window.setTimeout(function() { checkReady(callback); }, 100);
    }
  };

  // Start polling...
  checkReady(function($) {
    startStatusCheck($);
  });
}

function startStatusCheck(statusJQuery) {
  SIG_CORE_URL = "https://status.sigimera.org";
  var url_to_send = SIG_CORE_URL + "/status.json?client_uuid=" + getCookie(["_SIGSES"]) + "&callback=?";

  statusJQuery.support.cors = true;
  statusJQuery.ajaxSetup({cache: false});

  statusJQuery.ajax({
    url : url_to_send,
    type : "GET",
    dataType: "jsonp",
    cache: false,
    timeout: 8000,
    success: function(data) {
      if ( data.status == "online" ) {
        statusJQuery("#online").show();
        statusJQuery("#loading").hide();
      } else {
        /* TODO: Show here some error message */
      }
      document.cookie = data.cookie;
    },
    error: function(xhr, text, exception) {
      statusJQuery("#offline").show();
      statusJQuery("#loading").hide();
    }
  });
}

function getCookie(c_name) {
  var c_value = document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) { c_start = c_value.indexOf(c_name + "="); }
  if (c_start == -1) { c_value = null; }
  else {
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) { c_end = c_value.length; }
    c_value = unescape(c_value.substring(c_start,c_end));
  }
  return c_value;
}
