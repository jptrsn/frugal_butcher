

chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled');
});

chrome.commands.onCommand.addListener((command) => {
    console.log('command', command);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message, sender);
    switch (message.action) {
        case 'addTab': {
            meetCommands = new MeetCommands();
            meetCommands.addPort(sender.tab);
            break;
        }
    }
})

class MeetCommands {
    port;
    constructor() {
        console.log('MeetCommands constructor');        
    }

    async addPort(tab) {
        this.port = chrome.tabs.connect(tab.id, {name: 'MeetCommands'});
        
        this.port.onDisconnect.addListener(() => {
            console.log('disconnected');
            delete this.port;
        });
        
        const response = await this.sendMessage_({action: 'added'});
        console.log('response', response);
    }

    sendMessage_(message) {
        return new Promise((resolve, reject) => {
            this.port.onMessage.addListener((message, port) => {
                resolve(message);
            });
            this.port.postMessage(message);
        })
    }
}