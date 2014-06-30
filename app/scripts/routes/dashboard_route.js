Highwire.DashboardRoute = Ember.Route.extend({
    // admittedly, this should be in IndexRoute and not in the
    // top level ApplicationRoute; we're in transition... :-)
    model: function () {
        return ['index', 'new', 'edit', 'sync', 'clone', 'delete'];
    }
});
