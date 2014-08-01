App = Ember.Application.create();

App.Router.map(function() {
    this.route('unlock');
    this.route('console');
    this.route('fail');
    this.route('success');
});

function makeLockCode()
{
    var text = '';
    var possible = '0123456789';

    for (var i = 0; i < 4; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeAuthCode() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makePalCode()
{
    var text = '';
    var possible = '0123456789';

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeTargetPackage() {
    var text = '';
    var possible = '0123456789';

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

function createTutorialMessage(auth) {
    return 'Operator, your task is to ensure our nations safety by providing our ' +
           'commander in chief a nuclear option and preventing unauthorized ' +
           'access to our nuclear arsenal.\n' +
           '\n' +
           'All messages are authenticated by a code ring. Ensure that messages ' +
           'are properly authenticated. The authenticator ring is advanced with ' +
           'the "Next" button.\n' +
           '\n' +
           'A launch command will be sent via an Emergency Action Message (EAM). ' +
           'The launch command will contain a valid PAL code, a target package ' +
           'and the message will authenticate.\n' +
           '\n' +
           'The nuclear weapons are secured by Permissive Action Link (PAL). ' +
           'This unit is secured by a previously configured code. Additionally ' +
           'this unit is configured with a number of training codes that will be ' +
           'used during drills.\n' +
           '\n' +
           'To launch a nuclear weapon:\n' +
           '  * fuel missile\n' +
           '  * assign target\n' +
           '  * arm warhead\n' +
           '  * launch\n' +
           '\n' +
           'Authentication: ' + auth + '\n';
}

function createAlertMessage(auth) {    
    return '*** Alert *** Alert *** Alert ***\n' +
           '\n' +  
           'The USN are threatening to deploy nuclear weapons against us.\n'
           '\n' + 
           'All military forces are put into high alert.\n' +
           '\n' + 
           'Authentication: ' + auth + '\n';
}


function createUpdateMessage(auth) {
    var tp = [
        makeTargetPackage(),
        makeTargetPackage(),
        makeTargetPackage(),
        makeTargetPackage(),
        makeTargetPackage()
    ];
    tp.sort();
    
    return 'Target packages '+tp[0]+', '+tp[1]+', '+tp[2]+', '+tp[3]+' and '+tp[4]+' ' +
           'have been updated to reflect new inteligence.\n' +
           '\n' +
           'Authentication: ' + auth + '\n';
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

function startDrill(ctrl) {
    var auth         = nextRAuth(ctrl);
    var pal          = getDrillCode(ctrl);
    var tp           = makeTargetPackage();            
    var messageQueue = ctrl.get('messageQueue');
    messageQueue.pushObject(createDrillMessage(auth, pal, tp));
    ctrl.set('drillTarget', tp);
    ctrl.set('drillStart', new Date());
}

function drillResults(ctrl) {
    
    var icbms = ctrl.get('model.icbms');
    
    var ta = ctrl.get('drillTarget') + '/0' == icbms[0].target ? 'Pass' : 'Fail';
    var mf = icbms[0].fuel == 100 ? 'Pass' : 'Fail';
    var wa = icbms[0].arm ? 'Pass' : 'Fail';
    
    var dur = Math.round((new Date() - ctrl.get('drillStart')) / 1000);
    var tl  = dur < 60 ? 'Pass' : 'Fail';

    var msg = 'Drill Results:\n' + 
              '\n'+
              '  Target Assignment:        ' + ta + '\n' + 
              '  Missile Fuelling:         ' + mf + '\n' + 
              '  Warhead Armed:            ' + wa + '\n' +
              '  Launch:                   Pass\n' +
              '  Duration:                 ' + dur + 's\n' +
              '  Time Limit:               ' + tl + '\n';
    return msg;
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
        
        createTutorialMessage
        setTimeout(function () {
            var auth         = nextRAuth(controller);
            var messageQueue = controller.get('messageQueue');
            messageQueue.pushObject(createTutorialMessage(auth));
        }, 5000)               
        
        var count = 0;
        var i = setInterval(function () {
            count++;
            startDrill(controller);
            
            if (count == 3) {
                setTimeout(function () {
                    var auth         = nextRAuth(controller);
                    var messageQueue = controller.get('messageQueue');
                    messageQueue.pushObject(createAlertMessage(auth));
                }, 65000)
            }
            
            if (count == 4) {
                setTimeout(function () {
                    var auth         = nextRAuth(controller);
                    var messageQueue = controller.get('messageQueue');
                    messageQueue.pushObject(createUpdateMessage(auth));
                }, 60000)
            }
            
            
            if (count == 5) {
                clearInterval(i);
                setTimeout(function () {
                    var auth         = nextRAuth(controller);
                    var pal          = controller.get('model.palCode');
                    var tp           = makeTargetPackage();            
                    var messageQueue = controller.get('messageQueue');
                    messageQueue.pushObject(createMessage(auth, pal, tp));
                }, 120000);
            }
        }, 120000);
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
    fueling:      0,
    drillTarget:  '',
    drillStart:   new Date(),
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
                var fueling = this.get('fueling');
                if (fueling == 1) {
                    return;
                }
                this.set('fueling', 1);
                
                var ctrl = this;
                var i = setInterval(function () {
                    if (ctrl.get('fueling') != 1) {
                        clearInterval(i);
                        return;
                    }
                
                    var done  = false;
                    var icbms = ctrl.get('model.icbms');
                    icbms.forEach(function (icbm, i) {
                        var fuel = icbm.fuel + 1;
                        if (fuel == 100) {
                            done = true;
                        }                        
                        Ember.set(icbm, 'fuel', fuel);
                    });
                    
                    if (done) {
                        ctrl.set('fueling', 0);
                        clearInterval(i);
                    }
                }, 400);
            } 
        },
        unfuel: function () {
            if (palOk(this.get('pal'))) {
                var fueling = this.get('fueling');
                if (fueling == -1) {
                    return;
                }
                this.set('fueling', -1);
                
                var ctrl = this;
                var i = setInterval(function () {
                    if (ctrl.get('fueling') != -1) {
                        clearInterval(i);
                        return;
                    }
                    
                    var done   = false;
                    var icbms  = ctrl.get('model.icbms');
                    icbms.forEach(function (icbm, i) {
                        var fuel = icbm.fuel - 1;
                        if (fuel == 0) {
                            done = true;
                        }                        
                        Ember.set(icbm, 'fuel', fuel);
                    });
                    
                    if (done) {
                        ctrl.set('fueling', 0);
                        clearInterval(i);
                    }
                }, 800);              
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
                this.set('pal',      'locked');
                this.set('message',  drillResults(this));
                this.set('palInput', '');
                this.set('tpInput',  '');
                
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
        return {code: makeLockCode()};
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

