var Highwire = window.Highwire = Ember.Application.create();

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/components/*');
require('scripts/views/*');
require('scripts/router');
require('scripts/highwire');

App = Ember.Application.create({});

DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
    event.preventDefault();
    return false;
};

DragNDrop.Draggable = Ember.Mixin.create({
    attributeBindings: 'draggable',
    draggable: 'true',
    dragStart: function(event) {
        var dataTransfer = event.originalEvent.dataTransfer;
        dataTransfer.setData('Text', this.get('elementId'));
    }
});

DragNDrop.Droppable = Ember.Mixin.create({
    dragEnter: DragNDrop.cancel,
    dragOver: DragNDrop.cancel,
    drop: function(event) {
        event.preventDefault();
        return false;
    }
});

App.Product = Ember.Object.extend({
    name: null,
    isAdded: null
});

App.ProductView = Ember.View.extend(DragNDrop.Draggable, {
    tagName: 'span',

    // .setDragImage (in #dragStart) requires an HTML element as the first argument
    // so you must tell Ember to create the view and it's element and then get the
    // HTML representation of that element.
    dragIconElement: Ember.View.create({
        attributeBindings: ['src'],
        tagName: 'img',
        src: 'http://twitter.com/api/users/profile_image/twitter'
    }).createElement().get('element'),

    dragStart: function(event) {
        this._super(event);
        // Let the controller know this view is dragging
        this.setPath('content.isDragging', true);

        // Set the drag image and location relative to the mouse/touch event
        var dataTransfer = event.originalEvent.dataTransfer;
        dataTransfer.setDragImage(this.get('dragIconElement'), 24, 24);
    },

    dragEnd: function(event) {
        // Let the controller know this view is done dragging
        this.setPath('content.isDragging', false);
    }
});

App.ProductDropTarget = Ember.View.extend(DragNDrop.Droppable, {
    tagName: 'div',
    classNames: ['dropTarget'],
    classNameBindings: ['cartAction'],
    helpText: null,

    // This will determine which class (if any) you should add to
    // the view when you are in the process of dragging an item.
    cartAction: Ember.computed(function(key, value) {
        if(Ember.empty(this.get('dragContext'))) {
            this.set('helpText','(Drop Zone)');
            return null;
        }

        if(!this.getPath('dragContext.isAdded')) {
            this.set('helpText', '(Drop to Add)');
            return 'cart-add';
        } else if(this.getPath('dragContext.isAdded')) {
            this.set('helpText', '(Drop to Remove)');
            return 'cart-remove';
        } else {
            this.set('helpText', '(Drop Zone)');
            return null;
        }

    }).property('dragContext').cacheable(),

    drop: function(event) {
        var viewId = event.originalEvent.dataTransfer.getData('Text'),
            view = Ember.View.views[viewId];

        // Set view properties
        // Must be within `Ember.run.next` to always work
        Ember.run.next(this, function() {
            view.setPath('content.isAdded', !view.getPath('content.isAdded'));
        });

        return this._super(event);
    }
});

App.productsController = Ember.ArrayController.create({
    content: [
      App.Product.create({ name: "MacBook Pro", isAdded: false }),
      App.Product.create({ name: "iPhone", isAdded: false }),
      App.Product.create({ name: "iPad", isAdded: true }),
      App.Product.create({ name: "iTV", isAdded: false })
    ],

    currentDragItem: Ember.computed(function(key, value) {
        return this.findProperty('isDragging', true);
    }).property('@each.isDragging').cacheable(),

    productsInCart: Ember.computed(function(key, value) {
        return this.filterProperty('isAdded', true);
    }).property('@each.isAdded').cacheable()

});

App.cartController = Ember.ArrayController.create({
    content: Ember.computed(function(key, value) {
        var cartItems = this.get('cartItems');

        if(!Ember.empty(cartItems)) {
            // Sort desc by name
            return cartItems.sort(function(a,b){
                if((a.get('name').toLowerCase()) < (b.get('name').toLowerCase()))
                    return -1;
                else return 1;
            });
        }
    }).property('cartItems').cacheable(),

    cartItemsBinding: 'App.productsController.productsInCart'
});

