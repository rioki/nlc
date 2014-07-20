App = Ember.Application.create();

App.Router.map(function() {
    this.route('unlock');
});

function makeAuthCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makePalCode()
{
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeTargetPackage() {
    var text = "TP";
    var possible = "0123456789";

    for (var i = 0; i < 3; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var state = {
    locked:          false,
    lockCode:        '1337',
    eam:             '',
    message:         '',
    pendingMessages: [],
    auth:            '',
    authRing:        [],
    authIndex:       0, // the index of the authenticator
    authRIndex:      0, // the index of the message generator
    pal:             'locked',
    palCode:         makePalCode(),
    palDrillCodes:   [],
    palInput:        '',
    targetPackage:   '',
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

for (i = 0; i < 100; i++) {
    state.authRing.push(makeAuthCode());
    state.palDrillCodes.push(makePalCode());
}

function createDrillMessage(auth) {
    var dc = Math.floor(Math.random() * state.palDrillCodes.length);
    return '*** DRILL *** DRILL *** DRILL ***\n' +
           '\n' +
           'The release of nuclear weapons has been authorized.\n' +
           '\n' +
           'Authentication: ' + state.authRing[auth]    + '\n' +
           'Launch Code:    ' + state.palDrillCodes[dc] + '\n' +
           'Target Package: ' + makeTargetPackage()     + '\n';           
}

function createMessage(auth) {
    var dc = Math.floor(Math.random() * state.palDrillCodes.length);
    return 'The release of nuclear weapons has been authorized.\n' +
           '\n' +
           'Authentication: ' + state.authRing[auth]    + '\n' +
           'Launch Code:    ' + state.palCode           + '\n' +
           'Target Package: ' + makeTargetPackage()     + '\n';           
}


function palOk(pal) {
    return pal == 'unlocked' || pal == 'drill';
}
    
App.IndexRoute = Ember.Route.extend({
    beforeModel: function() {
        if (state.locked) {
            this.transitionTo('unlock');
        }
    },
    model: function() {
        /*setTimeout(function () {
            var auth = this.controller.get('authRIndex');
            
            state.pendingMessages.push(createDrillMessage(auth));            
            
            auth++;
            if (auth == state.authRing.length)
            {
                auth = 0;
            }            
            this.controller.set('authRIndex', auth);
            this.controller.set('eam', 'eam');
        }, 1000);*/
    
        return state;
    },
    actions: {
        eam: function () {
            if (state.pendingMessages.length != 0) {
                this.controller.set('message', state.pendingMessages.pop());
                if (state.pendingMessages.length != 0) {
                    this.controller.set('eam', 'eam');
                }
                else {
                    this.controller.set('eam', '');
                }                
            }            
        },
        clear: function () {
            this.controller.set('message', '');
            var controller = this.controller;
            setTimeout(function () {
                var auth = controller.get('authRIndex');
                
                state.pendingMessages.push(createDrillMessage(auth));            
                
                auth++;
                if (auth == state.authRing.length)
                {
                    auth = 0;
                }            
                controller.set('authRIndex', auth);
                controller.set('eam', 'eam');
            }, 1000);
        },
        nextAuth: function () {
            var i = this.controller.get('authIndex');
            this.controller.set('auth', state.authRing[i]);
            
            i++;
            if (i == state.authRing.length)
            {
                i = 0;
            }            
            this.controller.set('authIndex', i);
        },
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
            if (input == state.palCode) {
                this.controller.set('pal', 'unlocked');
            }
            else
            {
                var drill = false;
                var controller = this.controller;
                state.palDrillCodes.forEach(function (code) {
                    if (input == code) {
                        controller.set('pal', 'drill');
                        drill = true;                        
                    }
                });
                if (drill == false)
                {
                    this.controller.set('palInput', '');
                }
            }
        },
        palc: function () {
            this.controller.set('palInput', '');
        },
        tp1: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '1');
            }
        },
        tp2: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '2');
            }
        },
        tp3: function () {
            if (palOk(this.controller.get('pal')))
            {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '3');
            }
        },
        tp4: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '4');
            }
        },
        tp5: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '5');
            }
        },
        tp6: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '6');
            }
        },
        tp7: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '7');
            }
        },
        tp8: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '8');
            }
        },
        tp9: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '9');
            }
        },
        tp0: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', this.controller.get('targetPackage') + '0');
            }
        },
        tpe: function () {
            if (palOk(this.controller.get('pal'))) {
                var icbms  = this.controller.get('icbms');
                var target = this.controller.get('targetPackage'); 
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'target',  'TP' + target + '/' + i);
                });                
            }            
        },
        tpc: function () {
            if (palOk(this.controller.get('pal'))) {
                this.controller.set('targetPackage', '');
            }
        }, 
        fuel: function () {
            if (palOk(this.controller.get('pal'))) {
                var icbms  = this.controller.get('icbms');
                console.log(icbms);
                icbms.forEach(function (icbm, i) {
                    // TODO fueling
                    Ember.set(icbm, 'fuel',  'Fuel 100%');
                });                
            } 
        },
        unfuel: function () {
            if (palOk(this.controller.get('pal'))) {
                var icbms  = this.controller.get('icbms');
                icbms.forEach(function (icbm, i) {
                    // TODO fueling
                    Ember.set(icbm, 'fuel',  'No Fuel');
                });                
            } 
        },
        arm: function () {
            if (palOk(this.controller.get('pal'))) {
                var icbms  = this.controller.get('icbms');
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'arm',  'Armed');
                });                
            } 
        },
        disarm: function () {
            if (palOk(this.controller.get('pal'))) {
                var icbms  = this.controller.get('icbms');
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'arm',  'Unarmed');
                });                
            } 
        },
        launch: function () {
            if (this.controller.get('pal') == 'unlocked') {
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
            else if (this.controller.get('pal') == 'drill') {
                this.controller.set('pal', 'locked');
                this.controller.set('message', 'drill success');
                this.controller.set('palInput', '');
                this.controller.set('targetPackage', '');
                
                var icbms  = this.controller.get('icbms');
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'target',  'No Target');
                    Ember.set(icbm, 'fuel',    'No Fuel');
                    Ember.set(icbm, 'arm',     'Unarmed');
                });
            }
        }        
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

