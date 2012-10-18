define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/home/show',
    'views/levels/index',
    'views/levels/show'
], function($, _, Backbone, home, levels, level) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'levels/:id': 'level'
        },
        home: function() {
            home.render();
        },
        level: function(id) {
            level.render(id);
        },
        levels: function() {
            levels.render();
        }
    });

    return {
        
        initialize: function() {
            var router = new AppRouter;
            Backbone.history.start();
        }
        
    };

});