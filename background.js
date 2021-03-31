let meetCommands;
let pendingCommand;

chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled');
});

chrome.commands.onCommand.addListener(async (command) => {
    console.log('command', command);
    if (meetCommands) {
        const result = await meetCommands.executeCommand(command);
        console.log('result', result);
    } else if (command === 'newMeeting' || command === 'firstEvent') {
        console.log('meet tab not initialized = searching...');
        const tabs = await chrome.tabs.query({url: 'https://meet.google.com/*'})
        if (tabs.length === 1) {
            meetCommands = new MeetCommands(tabs[0]);
            return meetCommands.executeCommand(command);
        } else {
            console.log('opening tab');
            pendingCommand = command;
            const tab = await chrome.tabs.create({url: 'https://meet.google.com'});
            console.log('tab', tab);
            
        }
    }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('message', message, sender);
    switch (message.action) {
        case 'addTab': {
            if (!meetCommands) {
                meetCommands = new MeetCommands(sender.tab);
                if (pendingCommand) {
                    console.log(`issuing pending command ${pendingCommand}`);
                    const result = await meetCommands.executeCommand(pendingCommand);
                    console.log('executeCommand result', result);
                    pendingCommand = null;
                }
            } else if (!meetCommands.port) {
                meetCommands.addPort(sender.tab);
            }
            break;
        }
    }
    sendResponse({success: true});
})

class MeetCommands {
    port;
    pendingClicks = [];
    clickSequences = {
        newMeeting: ['newMeeting.firstEvent'],
        firstEvent: ['firstEvent', 'waitForPageLoad', 'joinNow'],
        toggleCaptions: ['toggleCaptions']
    };
    constructor(tab) {
        console.log('MeetCommands constructor');        
        this.addPort(tab);
    }

    async addPort(tab) {
        this.port = chrome.tabs.connect(tab.id, {name: 'MeetCommands'});
        this.port.onDisconnect.addListener(() => {
            console.log('disconnected');
            delete this.port;
        });
        const result = await this.sendMessage_({action: 'added'});
        console.log(result);
        this.issuePendingClicks();
    }

    async backoff_(fn, retries = 5, delay = 500) {
        let attempt = 0;
        let e;
        while (attempt < retries) {
            try {
                return await fn();
            } catch(error) {
                e = error;
                attempt++;
                const timeout = delay * 2 ** attempt;
                console.log(`attempt ${attempt} in ${timeout} ms`);
                await new Promise((resolve, reject) => setTimeout(resolve, timeout));
            }
        }
        console.warn('backoff exceeded', e);
        return {success: false, error: e.message};
    }

    async executeCommand(command) {
        const clickSequence = this.clickSequences[command];
        for (let click of clickSequence) {
            console.log('executing click', click);
            if (click === 'waitForPageLoad') {
                this.pendingClicks = clickSequence.splice(clickSequence.indexOf(click) + 1);
                console.log('caching for page load', this.pendingClicks);
                return false;
            }
            const result = await this.sendMessage_({command: click});
        }
        return true;
    }

    sendMessage_(message) {
        const send = () => {
            return new Promise((resolve, reject) => {
                if (!this.port) {
                    console.log('no port - adding to pending clicks', message);
                    this.pendingClicks.push(message);
                    return {success: false};
                }
                const key = new Date().getTime();
                const callback = (message, port) => {
                    if (message.key === key) {
                        delete message.key;
                        port.onMessage.removeListener(callback);
                        if (message.success) {
                            resolve(message);
                        } else {
                            console.log(message);
                            reject(message);
                        }
                    }
                };
                this.port.onMessage.addListener(callback);
                this.port.postMessage(Object.assign({key}, message));
            })
        };
        return this.backoff_(send, 5);
    }

    async issuePendingClicks() {
        while (this.pendingClicks.length) {
            const click = this.pendingClicks.shift();
            console.log('executing click', click);
            if (click === 'waitForPageLoad') {
                console.log('caching for page load', this.pendingClicks);
                return false;
            }
            const result = await this.sendMessage_({command: click});
        }
    }
}