let meetCommands;
let pendingCommand;

chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled');
});

chrome.commands.onCommand.addListener(async (command) => {
    console.log('command', command);
    if (meetCommands) {
        if (!meetCommands.port) {
            console.log('no port');
            const tabs = await chrome.tabs.query({url: 'https://meet.google.com/*'})
            if (tabs.length === 1) {
                await meetCommands.addPort(tabs[0]);
                console.log('added port', meetCommands.port);
            }
        }
        const result = await meetCommands.executeCommand(command);
        console.log('result', result);
    } else {
        console.log('meet tab not initialized = searching...');
        const tabs = await chrome.tabs.query({url: 'https://meet.google.com/*'})
        if (tabs.length === 1) {
            meetCommands = new MeetCommands(tabs[0]);
            const result = await meetCommands.executeCommand(command);
            console.log('executeCommand result', result);
        } else if (!tabs.length) {
            if (command === 'instantMeet' || command === 'firstEvent') {
                console.log('opening tab');
                pendingCommand = command;
                await chrome.tabs.create({url: 'https://meet.google.com'});
            } else {
                console.warn('Command issued but no tab detected.');
            }
        } else {
            console.error('Multipe meet tabs detected', tabs);
        }    
    }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('message', message);
    switch (message.action) {
        case 'addTab': {
            if (!meetCommands && pendingCommand) {
                const command = `${pendingCommand}`;
                pendingCommand = null;
                meetCommands = new MeetCommands(sender.tab);
                console.log(`issuing pending command ${command}`);
                const result = await meetCommands.executeCommand(command);
                console.log('executeCommand result', result);
            } else if (meetCommands && !meetCommands.port && pendingCommand) {
                const command = `${pendingCommand}`;
                pendingCommand = null;
                await meetCommands.addPort(sender.tab);
                console.log(`issuing pending command ${command}`);
                const result = await meetCommands.executeCommand(command);
                console.log('executeCommand result', result);
            } else if (meetCommands && meetCommands.pendingClicks.length) {
                if (!meetCommands.port) {
                    await meetCommands.addPort(sender.tab);
                }
                console.log('issueing pending clicks', meetCommands.pendingClicks);
                await meetCommands.issuePendingClicks();
            } else {
                console.log('nothing pending');
            }
            break;
        }
    }
    sendResponse({success: true});
})

class MeetCommands {
    port;
    tabId;
    pendingClicks = [];
    clickSequences = {
        firstEvent: ['firstEvent', 'waitForPageLoad', 'joinNow'],
        instantMeet: ['newMeeting.startInstant'],
        muteAudio: ['muteAudio'],
        muteVideo: ['muteVideo'],
        shareScreen: ['presentNow.screen'],
        toggleCaptions: ['toggleCaptions']
    };
    constructor(tab) {
        this.addPort(tab);
    }

    async addPort(tab) {
        if (this.tabId && tab.id === this.tabId && this.port) {
            console.error('already connected to tab');
            return;
        }
        this.tabId = tab.id;
        this.port = chrome.tabs.connect(tab.id, {name: 'MeetCommands'});
        this.port.onDisconnect.addListener(() => {
            console.log('disconnected');
            delete this.port;
        });
    }

    closePort_() {
        if (this.port) {
            this.port.disconnect();
            delete this.port;
        }
    }

    async backoff_(fn, retries = 5, delay = 500) {
        let attempt = 0;
        let e;
        while (attempt < retries) {
            try {
                attempt++
                return await fn();
            } catch(error) {
                e = error;
                const timeout = delay * 2 ** attempt;
                console.log(`attempt ${attempt} in ${timeout} ms`);
                await new Promise((resolve, reject) => setTimeout(resolve, timeout));
            }
        }
        console.warn('backoff exceeded', e);
        return {success: false, error: e.message};
    }

    async executeCommand(command) {
        if (!this.port) {
            console.error('execute command called with no port', command);
        }
        const clickSequence = [...this.clickSequences[command]];
        const result = await this.sendClickArray(clickSequence);
        this.closePort_();
        return result;
    }

    sendMessage_(message) {
        const send = () => {
            return new Promise((resolve, reject) => {
                if (!this.port) {
                    console.log('no port - adding to pending clicks', message.command);
                    this.pendingClicks.push(message.command);
                    resolve({success: false, fatal: true, message: 'no port'});
                }
                const key = new Date().getTime();
                const timeoutId = setTimeout(() => {
                    resolve({success: false, error: 'timeout'});
                }, 30000);
                const callback = (message, port) => {
                    console.log('callback', message);
                    clearTimeout(timeoutId);
                    if (message.key === key) {
                        delete message.key;
                        port.onMessage.removeListener(callback);
                        if (message.success) {
                            resolve(message);
                        } else if (message.fatal) {
                            resolve(message);
                        } else {
                            console.log(message);
                            reject(message);
                        }
                    }
                };
                
                this.port.onMessage.addListener(callback);
                console.log('sendMessage', message, key);
                this.port.postMessage(Object.assign({key}, message));
            })
        };
        return this.backoff_(send, 5);
    }

    async issuePendingClicks() {
        const result = await this.sendClickArray(this.pendingClicks);
        this.closePort_();
        return result;
    }

    async sendClickArray(clickArray) {
        while (clickArray.length) {
            const click = clickArray.shift();
            if (click === 'waitForPageLoad') {
                console.log('caching for page load', clickArray);
                this.pendingClicks = clickArray;
                return true;
            }
            const result = await this.sendMessage_({command: click});
            console.log('click result', result);
            if (!result.success) {
                if (!result.fatal) {
                    this.pendingClicks = [clickArray];
                }
                return false;
            }
            
        }
        return true; 
    }
}