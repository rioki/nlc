App = Ember.Application.create();

App.Router.map(function() {
    this.route('unlock');
});

var msg = 
    '*** DRILL *** DRILL *** DRILL ***\n' +
    '\n' +
    'The release of nuclear weapons has be autherized.\n' +
    '\n' +
    'Athentication:  ABTZU\n' +
    'Launch Code:    125877\n' +
    'Target Package: TP078\n'


var state = {
    locked:        false,
    lockCode:      '1337',
    message:       msg,
    auth:          'ABTZU',
    pal:           'locked',
    palCode:       '125877',
    palInput:      '',
    targetPackage: '',
    icbms: [
        {target: 'No Target', fuel: 'No Fuel', arm: 'Unarmed'},
        {target: 'No Target', fuel: 'No Fuel', arm: 'Unarmed'},
        {target: 'No Target', fuel: 'No Fuel', arm: 'Unarmed'},
        {target: 'No Target', fuel: 'No Fuel', arm: 'Unarmed'},
        {target: 'No Target', fuel: 'No Fuel', arm: 'Unarmed'},
        {target: 'No Target', fuel: 'No Fuel', arm: 'Unarmed'},
        {target: 'No Target', fuel: 'No Fuel', arm: 'Unarmed'},
        {target: 'No Target', fuel: 'No Fuel', arm: 'Unarmed'}
    ]
};

App.IndexRoute = Ember.Route.extend({
    beforeModel: function() {
        if (state.locked) {
            this.transitionTo('unlock');
        }
    },
    model: function() {
        return state;
    },
    actions: {
        pal1: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '1');
        },
        pal2: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '2');
        },
        pal3: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '3');
        },
        pal4: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '4');
        },
        pal5: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '5');
        },
        pal6: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '6');
        },
        pal7: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '7');
        },
        pal8: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '8');
        },
        pal9: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '9');
        },
        pal0: function () {
            this.controller.set('palInput', this.controller.get('palInput') + '0');
        },
        pale: function () {
            var input = this.controller.get('palInput');
            if (input == state.palCode)
            {
                this.controller.set('pal', 'unlocked');
            }
            else
            {
                // play sound?
                this.controller.set('palInput', '');
            }
        },
        palc: function () {
            this.controller.set('palInput', '');
        },
        tp1: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '1');
            }
        },
        tp2: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '2');
            }
        },
        tp3: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '3');
            }
        },
        tp4: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '4');
            }
        },
        tp5: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '5');
            }
        },
        tp6: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '6');
            }
        },
        tp7: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '7');
            }
        },
        tp8: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '8');
            }
        },
        tp9: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '9');
            }
        },
        tp0: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '0');
            }
        },
        tpe: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                var icbms  = this.controller.get('icbms');
                var target = this.controller.get('targetPackage'); 
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'target',  'TP' + target + '/' + i);
                });                
            }            
        },
        tpc: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                this.controller.set('targetPackage', '');
            }
        }, 
        fuel: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                var icbms  = this.controller.get('icbms');
                console.log(icbms);
                icbms.forEach(function (icbm, i) {
                    // TODO fueling
                    Ember.set(icbm, 'fuel',  'Fuel 100%');
                });                
            } 
        },
        unfuel: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                var icbms  = this.controller.get('icbms');
                console.log(icbms);
                icbms.forEach(function (icbm, i) {
                    // TODO fueling
                    Ember.set(icbm, 'fuel',  'No Fuel');
                });                
            } 
        },
        arm: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                var icbms  = this.controller.get('icbms');
                console.log(icbms);
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'arm',  'Armed');
                });                
            } 
        },
        disarm: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                var icbms  = this.controller.get('icbms');
                console.log(icbms);
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'arm',  'Disarmed');
                });                
            } 
        },
        launch: function () {
            if (this.controller.get('pal') === 'unlocked')
            {
                var icbms  = this.controller.get('icbms');
                console.log(icbms);
                icbms.forEach(function (icbm, i) {
                    setTimeout(function () {
                        Ember.set(icbm, 'target',  'No Data');
                        Ember.set(icbm, 'fuel',  'No Data');
                        Ember.set(icbm, 'arm',  'No Data');
                    }, i * 1500);
                });                
            } 
        },
        
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

