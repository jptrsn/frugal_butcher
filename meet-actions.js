class MeetActions {
    port;
    currentState;
    // State detectors are functions that return true if they have detected the state (as indicated by the key)
    stateDetectors = {
        hold: () => {
            return !!document.querySelector('c-wiz > div > div > div:nth-child(4) > div.crqnQb > div > div.vgJExf > div > div > div.oORaUb.NONs6c');
        },
        meet: () => {
            return !!document.querySelector('[data-allocation-index]');
        },
        home: () => {
            return !!document.querySelector('#yDmH0d > c-wiz > div > div.S3RDod > div > div.Qcuypc > div.Ez8Iud');
        }
    };
    // Each control key must correspond to the state, as determined by state detectors
    // Each page of controls has a selector, when found it will have an element, and optionally has children that are injected into the DOM on click
    controls = {
        home: {
            newMeeting: {
                selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div > button',
                element: null,
                children: {
                    'createForLater': {
                        selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > ul > li:nth-child(1)',
                    },
                    'startInstant': {
                        selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > ul > li:nth-child(2)',
                        element: null
                    },
                    'startInstant': {
                        selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > ul > li:nth-child(3)',
                        element: null
                    }
                }
            },
            firstEvent: {
                selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(2) > c-wiz > c-wiz > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(5) > c-wiz > div > c-wiz:nth-child(1) > div > div',
                element: null
            }
        },
        hold: {
            joinNow: {
                selector: '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div.KieQAe > div.d7iDfe.NONs6c > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1)',
                element: null
            },
            present: {
                selector: '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div.KieQAe > div.d7iDfe.NONs6c > div > div.Sla0Yd > div > div.XCoPyb > div.uArJ5e.UQuaGc.kCyAyd.QU4Gid.xKiqt.cd29Sd.M9Bg4d',
                element: null
            },
            cast: {
                selector: '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div.KieQAe > div.d7iDfe.NONs6c > div > div.Sla0Yd > div > div.kgb0ld > div',
                element: null
            },
            changeBackground: {
                selector: '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div.KieQAe > div.ZUpb4c > div.oORaUb.NONs6c > div > div.Rd6sU > div',
                element: null
            }
        },
        meet: {
            'raiseHand': {
                selector: '[aria-label="Raise hand"]',
                element: null
            },
            'toggleCaptions': {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(3) > div:nth-child(2) > div',
                element: null
            },
            'presentNow': {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(3) > div:nth-child(3) > div',
                element: null
            },
            'moreActions': {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(3) > div:nth-child(4) > div',
                element: null,
                children: {
                    'cast': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(1)',
                        element: null
                    },
                    'whiteboard': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(2)',
                        element: null
                    },
                    'changeLayout': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(3)',
                        element: null
                    },
                    'fullScreen': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(4)',
                        element: null
                    },
                    'changeBackground': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(5)',
                        element: null
                    },
                    'settings': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(11)',
                        element: null
                    }
                }
            },
            'chat': {
                selector: '[aria-label="Chat with everyone"]',
                element: null
            },
            'attendees': {
                selector: '[aria-label="Show everyone"]',
                element: null
            },
            'muteAudio': {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(2) > div:nth-child(1) > div',
                element: null
            },
            'hangup': {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(2) > div:nth-child(2) > div',
                element: null
            },
            'muteVideo': {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(2) > div:nth-child(3) > div',
                element: null
            }
        }
    }

    constructor() {
        console.log('MeetActions constructor');
        chrome.runtime.onConnect.addListener((port) => {
            console.log('onConnect');
            this.port = port;
            this.port.onDisconnect.addListener(() => {
                console.log('port disconnected');
                delete this.port;
            });
            this.port.onMessage.addListener(this.handleMessage_);
        });
        this.addStateDetection_();
        chrome.runtime.sendMessage({action: 'addTab'});
    }

    addStateDetection_() {
        const detectState = () => {
            let windowState;
            for (let [state, detector] of Object.entries(this.stateDetectors)) {
                if (detector()) {
                    windowState = state;
                    break;
                }
            }
            if (windowState && windowState !== this.currentState) {
                console.log(`state change ${this.state} => ${windowState}`);
                this.configureForState_(windowState);
            }
        }
        setInterval(() => (detectState()), 1000);
        detectState();
        console.log('state detection added');
    }

    configureForState_(state) {
        console.log('configureForState', state);
        if (this.currentState) {
            Object.entries(this.controls[this.currentState]).forEach(([key, ctrl]) => {
                delete ctrl.element;
            });
        }
        Object.entries(this.controls[state]).forEach(([key, ctrl]) => {
            this.addElementDetector_(key, ctrl);
        });
        this.currentState = state;
    }

    async executeCommand(command) {
        const keyPath = command.split('.');
        console.log(keyPath);
        let ctrls = this.controls[this.currentState];
        for (const k of keyPath) {
            const ctrl = ctrls[k];
            ctrl.element = document.querySelectorAll(ctrl.selector)[0];
            if (!ctrl || !ctrl.element) {
                return false;
            }
            console.log('clickling', k, ctrl.element);
            ctrl.element.click();
            if (ctrl.children) {
                ctrls = ctrl.children;
            }
            
        }
        return true;
    }

    handleMessage_ = async (message, port) => {
        try {
            console.log('handleMessage', message);
            let success = true;
            if (message.command) {
                success = await this.executeCommand(message.command);
            } else if (message.action === 'addTab') {
                success = this.addStateDetection_();
            }
            port.postMessage(Object.assign({success}, message));
        } catch(e) {
            console.warn(e);
            port.postMessage(Object.assign({success: false}, message));
        }
        
    }

    async addElementDetector_(key, control) {
        let attempts = 0;
        while (attempts < 5) {
            const els = document.querySelectorAll(control.selector);
            if (els.length) {
                control.element = els[0];
                if (els.length > 1) {
                    console.warn('too broad selector', control.selector);
                    console.log(els);
                }
                break;
            }
            attempts++;
            await new Promise((resolve, reject) => setTimeout(resolve, 500 * 2 ** attempts));
        }
        console.log(`${key} element configured`, control.element);
        if (this.port) {
            this.port.postMessage({message: 'listenerAdded', key, success: true});
        }
        return control.element;
    }
}