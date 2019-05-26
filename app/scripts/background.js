
function executeContentScript(tabId) {
    chrome.tabs.executeScript(tabId, {
        file: "scripts/content.js"
    });
}

function setBadge(isActive, tabId) {
    if (isActive) {
        chrome.browserAction.setBadgeText({ text: 'on', tabId: tabId });
        chrome.browserAction.setBadgeBackgroundColor({ color: '#008000', tabId: tabId });
    } else {
        chrome.browserAction.setBadgeText({ text: 'off', tabId: tabId });
        chrome.browserAction.setBadgeBackgroundColor({ color: '#696969', tabId: tabId });
    }
}

function applyByPersistedState(tab) {
    const origin = new URL(tab.url).origin;
    chrome.storage.local.get(origin, data => {
        if (data[origin] && data[origin].enable) {
            executeContentScript(tab.id);
            setBadge(true, tab.id);
        } else {
            setBadge(false, tab.id);
        }
    });
}

chrome.browserAction.onClicked.addListener(tab => {
    const origin = new URL(tab.url).origin;
    chrome.storage.local.get(origin, data => {
        const newData = data[origin] ? data[origin] : { enable: false };
        newData[origin] = {
            enable: !newData.enable
        };
        chrome.storage.local.set(newData, () => {
            applyByPersistedState(tab);
        });
    });
});

chrome.tabs.onActivated.addListener(e => {
    chrome.tabs.get(e.tabId, tab => {
        applyByPersistedState(tab);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {    
    if (changeInfo.status === 'loading' && tab.url) {
        applyByPersistedState(tab);
    }
});