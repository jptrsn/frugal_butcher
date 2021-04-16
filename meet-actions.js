document.onreadystatechange = (ev) => {
    console.log('onreadystatechange', document.readyState);

    if (document.readyState === 'complete') {
        const meetActions = new MeetActions();
    }
}

class MeetActions {
    port;
    currentState;
    // State detectors are functions that return true if they have detected the state of the tab (as indicated by the key)
    // States correspond to different views loaded into the DOM, and defines the set of element controls we can use
    stateDetectors = {
        hold: () => {
            return !!document.querySelector('#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div.KieQAe > div.d7iDfe.NONs6c > div > div.Sla0Yd > div > div.kgb0ld > div');
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
                selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1) > div > button',
                children: {
                    createForLater: {
                        selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > ul > li:nth-child(1)',
                    },
                    startInstant: {
                        selector: '#yDmH0d > c-wiz > div > div.S3RDod > div > div.Qcuypc > div.Ez8Iud > div > div.VfPpkd-xl07Ob-XxIAqe-OWXEXe-oYxtQd > div:nth-child(2) > div > ul > li.JS1Zae.VfPpkd-StrnGf-rymPhb-ibnC6b.VfPpkd-rymPhb-ibnC6b-OWXEXe-tPcied-hXIJHe',
                        redirect: true
                    },
                    scheduleInCalendar: {
                        selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > ul > li:nth-child(3)'
                    }
                }
            },
            firstEvent: {
                selector: '#yDmH0d > c-wiz > div > div.S3RDod > div > div.C9bDzc > c-wiz > c-wiz > div:nth-child(1) > div.VdLOD.yUoCvf > div > div.d5kC8b > c-wiz > div > c-wiz:nth-child(1) > div > div',
                redirect: true
                    // selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(2) > c-wiz > c-wiz > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(5) > c-wiz > div > c-wiz:nth-child(1) > div > div'
            }
        },
        hold: {
            joinNow: {
                selector: '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div.KieQAe > div.d7iDfe.NONs6c > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1)'
            },
            present: {
                selector: '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div.KieQAe > div.d7iDfe.NONs6c > div > div.Sla0Yd > div > div.XCoPyb > div.uArJ5e.UQuaGc.kCyAyd.QU4Gid.xKiqt.cd29Sd.M9Bg4d'
            },
            cast: {
                selector: '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div.KieQAe > div.d7iDfe.NONs6c > div > div.Sla0Yd > div > div.kgb0ld > div'
            },
            changeBackground: {
                selector: '#yDmH0d > c-wiz > div > div > div:nth-child(9) > div.crqnQb > div > div > div.vgJExf > div > div.KieQAe > div.ZUpb4c > div.oORaUb.NONs6c > div > div.Rd6sU > div'
            }
        },
        meet: {
            raiseHand: {
                selector: '[aria-label="Raise hand"]'
            },
            toggleCaptions: {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(3) > div:nth-child(2) > div'
            },
            presentNow: {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(3) > div:nth-child(3) > div',
                children: {
                    screen: {
                        selector: 'span[aria-label="Your entire screen"]'
                    },
                    window: {
                        selector: 'body > div:nth-child(6) > div > div > span:nth-child(3)'
                    },
                    tab: {
                        selector: 'body > div:nth-child(6) > div > div > span:nth-child(4)'
                    }
                }
            },
            moreOptions: {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(3) > div:nth-child(4) > div',
                children: {
                    cast: {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span[aria-label="Cast this meeting"]'
                    },
                    whiteboard: {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span.z80M1.vpS9Pb'
                    },
                    changeLayout: {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span[aria-label="Change layout"]'
                    },
                    fullScreen: {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span[aria-label="Full screen"]'
                    },
                    changeBackground: {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span[aria-label="Change background"]'
                    },
                    settings: {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span[aria-label="Settings"]'
                    }
                }
            },
            chat: {
                selector: '[aria-label="Chat with everyone"]'
            },
            attendees: {
                selector: '[aria-label="Show everyone"]'
            },
            muteAudio: {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(2) > div:nth-child(1) > div > div > div'
            },
            hangup: {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(2) > div:nth-child(2) > div > div > div'
            },
            muteVideo: {
                selector: 'c-wiz > div > div > div:nth-child(9) > div:nth-child(3) > div:nth-child(9) > div:nth-child(2) > div:nth-child(3) > div > div > div'
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
                this.port = null;
            });
            this.port.onMessage.addListener(this.handleMessage_);
        });
        chrome.runtime.sendMessage({ action: 'addTab' });
    }

    detectState() {
        let windowState;
        for (let [state, detector] of Object.entries(this.stateDetectors)) {
            if (detector()) {
                windowState = state;
                break;
            }
        }
        return windowState;
    }

    async executeCommand(command, { port, message }) {
        if (!command) return { success: true };
        const state = this.detectState();
        if (!state) {
            console.error('no state', state);
            return { success: false, error: 'no state detected' };
        } else {
            console.log('current state', state);
        }
        const keyPath = command.split('.');
        let ctrls = this.controls[state];
        for (const k of keyPath) {
            const ctrl = ctrls[k];
            if (!ctrl) {
                console.error('no control', k, state);
                return { success: false, error: `no control for ${k}` };
            }
            const elements = document.querySelectorAll(ctrl.selector);

            if (!elements.length) {
                console.log(`FATAL: selector found no element for ${k}; command ${command}`);
                console.log(ctrl.selector, elements);
                return { success: false, fatal: true, error: `FATAL: selector found no element for ${k}; command ${command}` };
            }
            const element = elements[0];
            if (ctrl.redirect) {
                message.success = true;
                port.postMessage(message)
            } else if (ctrl.children) {
                ctrls = ctrl.children;
            }
            element.dispatchEvent(new Event('click', { bubbles: true }));
            console.log('clicked element', element);
            await new Promise((res, rej) => setTimeout(res, 1500));

        }
        return { success: true };
    }

    handleMessage_ = async(message, port) => {
        try {
            console.log('handleMessage', message);
            let rtn = Object.assign({ success: true }, message);
            if (message.command) {
                const result = await this.executeCommand(message.command, { port, message });
                Object.assign(rtn, result);
            }
            port.postMessage(rtn);
        } catch (e) {
            console.error(e);
            port.postMessage(Object.assign({ success: false, fatal: true, error: e.message }, message));
        }

    }
}