/** @format */

var i18n = {
  lng: "en",
  resources: {},

  init: function (options) {
    this.lng = options.lng || this.lng;
    this.resources = options.resources || this.resources;
  },

  applyTranslation: function () {
    var elements = document.querySelectorAll("[data-translate]");
    for (var i = 0; i < elements.length; i++) {
      var key = elements[i].getAttribute("data-translate");
      elements[i].textContent = this.resources[this.lng].translation[key];
    }
  }
};

function changeLanguage(lang) {
  i18n.lng = lang;
  i18n.applyTranslation();
}
