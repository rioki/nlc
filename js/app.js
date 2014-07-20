App = Ember.Application.create();

App.Router.map(function() {
    this.route('unlock');
    this.route('console');
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

function createDrillMessage(auth, pal, tp) {
    return '*** DRILL *** DRILL *** DRILL ***\n' +
           '\n' +
           'The release of nuclear weapons has been authorized.\n' +
           '\n' +
           'Authentication: ' + auth + '\n' +
           'Launch Code:    ' + pal  + '\n' +
           'Target Package: ' + tp   + '\n';           
}

function createMessage(auth, pal, tp) {
    return 'The release of nuclear weapons has been authorized.\n' +
           '\n' +
           'Authentication: ' + auth + '\n' +
           'Launch Code:    ' + pal  + '\n' +
           'Target Package: ' + tp   + '\n';          
}

function palOk(pal) {
    return pal == 'unlocked' || pal == 'drill';
}

function nextRAuth(controller) {
    var index    = controller.get('authRIndex');
    var authRing = controller.get('model.authRing');
    
    index++;
    if (index >= authRing.length) {
        index = 0
    }
    
    var auth     = authRing[index];
    
    controller.set('authRIndex', index);
    return auth;
}

function getDrillCode(controller) {
    var palDrillCodes = controller.get('model.palDrillCodes');
    var i = Math.floor(Math.random() * palDrillCodes.length);
    return palDrillCodes[i];
}

App.IndexRoute = Ember.Route.extend({
    beforeModel: function() {
        this.transitionTo('unlock');
    }
});

App.ConsoleRoute = Ember.Route.extend({
    model: function () {
        var authRing = [];
        for (var i = 0; i < 100; i++) {
            authRing.push(makeAuthCode());    
        } 
        
        var palCode       = makePalCode();
        var palDrillCodes = [];
        for (var i = 0; i < 100; i++) {
            palDrillCodes.push(makePalCode());
        }
        
        var icbms = []
        for (var i = 0; i < 8; i++) {
            icbms.push({launched: false, target: '', fuel: 0, arm: false});
        }
        
        return {authRing:      authRing,
                palCode:       palCode,
                palDrillCodes: palDrillCodes,
                icbms:         icbms};
    },
    setupController: function(controller, model) {
        controller.set('model', model);
        
        setTimeout(function () {
            var auth         = nextRAuth(controller);
            //var pal          = getDrillCode(controller);
            var pal          = controller.get('model.palCode');
            var tp           = makeTargetPackage();
            var messageQueue = controller.get('messageQueue');
            messageQueue.pushObject(createMessage(auth, pal, tp));
        }, 2000);
    }
});

App.ConsoleController = Ember.Controller.extend({
    message:      '',
    messageQueue: [],
    auth:         '',
    authIndex:    0,
    authRIndex:   0,
    pal:          'locked',
    palInput:     '',
    tpInput:      '',
    actions: {
        eam: function () {
            var messageQueue = this.get('messageQueue');
            if (messageQueue.length != 0) {
                var message = messageQueue.popObject();
                this.set('message', message);
            }            
        },
        clear: function () {
            this.set('message', '');
        },
        nextAuth: function () {
            var index    = this.get('authIndex');
            var authRing = this.get('model.authRing');
            
            index++;
            if (index >= authRing.length) {
                index = 0
            }            
            
            this.set('auth',      authRing[index]);
            this.set('authIndex', index);
        },
        pal1: function () {
            this.set('palInput', this.get('palInput') + '1');
        },
        pal2: function () {
            this.set('palInput', this.get('palInput') + '2');
        },
        pal3: function () {
            this.set('palInput', this.get('palInput') + '3');
        },
        pal4: function () {
            this.set('palInput', this.get('palInput') + '4');
        },
        pal5: function () {
            this.set('palInput', this.get('palInput') + '5');
        },
        pal6: function () {
            this.set('palInput', this.get('palInput') + '6');
        },
        pal7: function () {
            this.set('palInput', this.get('palInput') + '7');
        },
        pal8: function () {
            this.set('palInput', this.get('palInput') + '8');
        },
        pal9: function () {
            this.set('palInput', this.get('palInput') + '9');
        },
        pal0: function () {
            this.set('palInput', this.get('palInput') + '0');
        },
        pale: function () {
            var input         = this.get('palInput');
            var palCode       = this.get('model.palCode')
            var palDrillCodes = this.get('model.palDrillCodes')
            if (input == palCode) {
                this.set('pal', 'unlocked');
            }
            else
            {
                var found      = false;
                var controller = this;
                palDrillCodes.forEach(function (code) {
                    if (input == code) {
                        controller.set('pal', 'drill');
                        found = true;                        
                    }
                });
                if (found == false)
                {
                    this.set('palInput', '');
                }
            }
        },
        palc: function () {
            this.set('palInput', '');
        },
        tp1: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', this.get('tpInput') + '1');
            }
        },
        tp2: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', this.get('tpInput') + '2');
            }
        },
        tp3: function () {
            if (palOk(this.get('pal')))
            {
                this.set('tpInput', this.get('tpInput') + '3');
            }
        },
        tp4: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', this.get('tpInput') + '4');
            }
        },
        tp5: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', this.get('tpInput') + '5');
            }
        },
        tp6: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', this.get('tpInput') + '6');
            }
        },
        tp7: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', this.get('tpInput') + '7');
            }
        },
        tp8: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', this.get('tpInput') + '8');
            }
        },
        tp9: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', this.get('tpInput') + '9');
            }
        },
        tp0: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', this.get('tpInput') + '0');
            }
        },
        tpe: function () {
            if (palOk(this.get('pal'))) {
                var icbms  = this.get('model.icbms');
                var target = this.get('tpInput'); 
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'target',  target + '/' + i);
                });                
            }            
        },
        tpc: function () {
            if (palOk(this.get('pal'))) {
                this.set('tpInput', '');
            }
        },
        fuel: function () {
            if (palOk(this.get('pal'))) {
                var icbms  = this.get('model.icbms');
                console.log(icbms);
                icbms.forEach(function (icbm, i) {
                    // TODO fueling
                    Ember.set(icbm, 'fuel',  100);
                });                
            } 
        },
        unfuel: function () {
            if (palOk(this.get('pal'))) {
                var icbms  = this.get('model.icbms');
                icbms.forEach(function (icbm, i) {
                    // TODO fueling
                    Ember.set(icbm, 'fuel',  0);
                });                
            } 
        },
        arm: function () {
            if (palOk(this.get('pal'))) {
                var icbms  = this.get('model.icbms');
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'arm',  true);
                });                
            } 
        },
        disarm: function () {
            if (palOk(this.get('pal'))) {
                var icbms  = this.get('model.icbms');
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'arm',  false);
                });                
            } 
        },
        launch: function () {
            if (this.get('pal') == 'unlocked') {
                var icbms  = this.get('model.icbms');
                icbms.forEach(function (icbm, i) {
                    setTimeout(function () {
                        Ember.set(icbm, 'launched', true);                        
                    }, i * 1500);
                });                
            }
            else if (this.get('pal') == 'drill') {
                this.set('pal', 'locked');
                this.set('message', 'drill success');
                this.set('palInput', '');
                this.set('tpInput', '');
                
                var icbms  = this.get('model.icbms');
                icbms.forEach(function (icbm, i) {
                    Ember.set(icbm, 'target',  '');
                    Ember.set(icbm, 'fuel',    0);
                    Ember.set(icbm, 'arm',     false);
                });
            }
        }
    }
});

App.UnlockRoute = Ember.Route.extend({
    model: function() {
        return {code: '1337'};
    }
});

App.UnlockController = Ember.Controller.extend({
    input: '',
    actions: {
        kp1: function () {
            this.set('input', this.get('input') + '1');
        },
        kp2: function () {
            this.set('input', this.get('input') + '2');
        },
        kp3: function () {
            this.set('input', this.get('input') + '3');
        },
        kp4: function () {
            this.set('input', this.get('input') + '4');
        },
        kp5: function () {
            this.set('input', this.get('input') + '5');
        },
        kp6: function () {
            this.set('input', this.get('input') + '6');
        },
        kp7: function () {
            this.set('input', this.get('input') + '7');
        },
        kp8: function () {
            this.set('input', this.get('input') + '8');
        },
        kp9: function () {
            this.set('input', this.get('input') + '9');
        },
        kp0: function () {
            this.set('input', this.get('input') + '0');
        },
        kpe: function () {
            var input = this.get('input');
            var code  = this.get('model.code');
            console.log({input: input, code: code});
            if (input == code)
            {
                // play sound?
                this.transitionToRoute('console');
            }
            else
            {
                // play sound?
                this.set('input', '');
            }
        },
        kpc: function () {
            this.set('input', '');
        }
    }
});


