
function detectIE() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
   
    return "IE " + parseInt( ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
   
    var rv = ua.indexOf('rv:');
    return "IE " + parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
   
    return "Edge " + parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return "false";
}
var result=detectIE();
if (result=="false")
{
}
else
{
   window.location = '/assets/browser_error/browser_error.html';
   this.remove();
}

