var Highwire = window.Highwire = Ember.Application.create();

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/components/*');
require('scripts/views/*');
require('scripts/router');
require('scripts/highwire-canvas');
require('scripts/highwire-dashboard');
require('scripts/highwire-logs');
require('scripts/highwire-inactive');
