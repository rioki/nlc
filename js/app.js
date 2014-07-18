App = Ember.Application.create();

App.Router.map(function() {
    this.route('unlock');
});

var state = {
    locked:     true,
    lockCode:   '1337'
};

App.IndexRoute = Ember.Route.extend({
    beforeModel: function() {
        if (state.locked) {
            this.transitionTo('unlock');
        }
    },
    model: function() {
        return ['red', 'yellow', 'blue'];
    }
});

App.UnlockRoute = Ember.Route.extend({
    model: function() {
        return {input: ''};
    },
    actions: {
        kp1: function () {
            this.controller.set('input', this.controller.get('input') + '1');
        },
        kp2: function () {
            this.controller.set('input', this.controller.get('input') + '2');
        },
        kp3: function () {
            this.controller.set('input', this.controller.get('input') + '3');
        },
        kp4: function () {
            this.controller.set('input', this.controller.get('input') + '4');
        },
        kp5: function () {
            this.controller.set('input', this.controller.get('input') + '5');
        },
        kp6: function () {
            this.controller.set('input', this.controller.get('input') + '6');
        },
        kp7: function () {
            this.controller.set('input', this.controller.get('input') + '7');
        },
        kp8: function () {
            this.controller.set('input', this.controller.get('input') + '8');
        },
        kp9: function () {
            this.controller.set('input', this.controller.get('input') + '9');
        },
        kp0: function () {
            this.controller.set('input', this.controller.get('input') + '0');
        },
        kpe: function () {
            var input = this.controller.get('input');
            if (input == state.lockCode)
            {
                state.locked = false;
                this.transitionTo('index');
            }
            else
            {
                // play sound?
                this.controller.set('input', '');
            }
        },
        kpc: function () {
            this.controller.set('input', '');
        },
    }    
});

