class MeetActions {
    port;
    currentState;
    controls = {
        home: {
            'newMeeting': {
                selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div > button',
                children: {
                    'createForLater': {
                        selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > ul > li[aria-label="Create a meeting for later"]',
                    },
                    'startInstant': {
                        selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > ul > li[aria-label="Start an instant meeting"]',
                        element: null
                    },
                    'startInstant': {
                        selector: 'c-wiz > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div > ul > li[aria-label="Schedule in Google Calendar"]',
                        element: null
                    }
                }
            },
            'firstEvent': {
                selector: 'document.querySelector("c-wiz > div > div:nth-child(2) > div > div:nth-child(2) > c-wiz > c-wiz > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(5) > c-wiz > div > c-wiz:nth-child(1) > div")'
            }
        },
        hold: {},
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
                children: {
                    'cast': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(1)'
                    },
                    'whiteboard': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(2)'
                    },
                    'changeLayout': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(3)'
                    },
                    'fullScreen': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(4)'
                    },
                    'changeBackground': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(5)'
                    },
                    'settings': {
                        selector: 'body > div.JPdR6b.e5Emjc.CIYi0d.jvUMfb.yOCuXd.qjTEB > div > div > span:nth-child(11)'
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
            this.port.onMessage.addListener(this.handleMessage_);
        });
        chrome.runtime.sendMessage({action: 'addTab'});
    }

    addStateDetection_() {

    }

    configureForState_(state) {
        console.log('configureForState', this.currentState, state);
        if (state.videoOnHold && this.currentState !== 'onHold') {
            console.log('on hold');
            this.currentState = 'onHold';
            Object.entries(this.holdControls).forEach(([key, ctrl]) => {
                this.addElementDetector_(key, ctrl);
            });
        } else if (state.videoOnPage && this.currentState !== 'onAir') {
            console.log('on air');
            this.currentState = 'onAir';
            Object.entries(this.meetControls).forEach(([key, ctrl]) => {
                this.addElementDetector_(key, ctrl);
            });
        } else if (this.currentState !== 'onHome') {
            console.log('on home');
            this.currentState = 'onHome';
            Object.entries(this.homeControls).forEach(([key, ctrl]) => {
                this.addElementDetector_(key, ctrl);
            });
        }
    }

    handleMessage_(message, port) {
        try {
            console.log('handleMessage', message);
            port.postMessage(Object.assign(message, {success: true}));
        } catch(e) {
            console.error(e.message);
            port.postMessage(Object.assign(message, {success: false}));
        }
        
    }
}