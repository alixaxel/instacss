// Filename: router.js
define([
  'libs/require/domReady-min!', // Use with the ! suffix (http://requirejs.org/docs/api.html#pageload)

  'jQuery',
  'Underscore',
  'Backbone',

  // Views
  'views/topnav',
  'views/languageview',
  'views/fullwindow',

  // Collections
  'collections/mozdevcssprops'
], function(doc, $, _, Backbone,
            TopNavView, LanguageView, FullWindowView,
            MozDevCSSPropCollection) {

  var InstaCSS = Backbone.Router.extend({
    routes: {
      ''         : 'main',
      ':query'   : 'main',
    },

    initialize: function() {
      _.bindAll(this, 'changeLanguage', 'setLanguage');

      // for client-side search...
      this.wholeFrigginDB = new MozDevCSSPropCollection();

      this.languageViews = {
        'css' : new LanguageView({
          languageName: 'CSS',
          collection: this.wholeFrigginDB
        }),
        'html' : new LanguageView({
          languageName: 'HTML',
          collection: this.wholeFrigginDB
        })
      };

      // TODO: Make a different route for each language:
      //  insta.com/css
      //  insta.com/html
      //  insta.com/js
      //  ...
      this.currentLanguage = 'css';
    },

    changeLanguage: function(newLanguage) {
      if (newLanguage === this.currentLanguage) {
        return;
      }
      this.languageViews[this.currentLanguage].setActive(false);
      this.setLanguage(newLanguage);
    },

    setLanguage: function(newLanguage) {
      this.languageViews[newLanguage].setActive(true);
      $('#search-box').focus();

      if (!this.fullWindow) {
        this.fullWindow = new FullWindowView();
      }
      // Make sure toc well height is set correctly (TODO: move this into tocbarview)
      this.languageViews[newLanguage].collection.bind('reset', this.fullWindow.onResize);

      this.currentLanguage = newLanguage;
    },

    main: function(query) {
      this.topNavView = new TopNavView({
        el: $('#topbar-inner')
      });
      this.topNavView.render();
      this.topNavView.bind('changeLanguage', this.changeLanguage);

      // Start everything
      console.log('Router setting language to: ' + this.currentLanguage);
      this.setLanguage(this.currentLanguage);
    },
  });

  var initialize = function() {
    var mainApp = new InstaCSS();
    Backbone.history.start(); // can't do pushstate until we handle all routes on backend ({pushState: true});
  };

  return { initialize: initialize };
});

