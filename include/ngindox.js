// Ngindox
// requires jquery
window.NgindoxInit = function() {
  $('.toggleEndpointList').click(function() {
    var resource = this.getAttribute('data-id');
    if (resource) {
      $('#routes-' + resource).slideToggle("slow");
    }
  });
};
$(document).ready(NgindoxInit);
