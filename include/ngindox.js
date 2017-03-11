// requires jquery-3.1.1
window.Ngindox = {

  init: function() {
    $('.toggleEndpointList', this.el).click(function() {
      var anchor = this.getAttribute('data-id');
      if (anchor) {
        Ngindox.toggleEndpointListForResource(anchor);
      }
    });
  },

  toggleEndpointListForResource: function(resource) {
    $('#routes-' + resource).slideToggle("slow");
  },

  callDocs: function(fnName, e) {
    e.preventDefault();
    Ngindox[fnName](e.currentTarget.getAttribute('data-id'));
  }

}
$(document).ready(Ngindox.init);
