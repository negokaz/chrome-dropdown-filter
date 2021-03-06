
function executeContentScript(tabId) {
    chrome.tabs.executeScript(tabId, {
        file: "scripts/content.js",
        allFrames: true
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

function getTabOrigin(tab) {
    return new URL(tab.url).origin + "/";
}

function applyByPersistedState(tab, origin) {
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
    const origin = getTabOrigin(tab);
    chrome.permissions.request({
        origins: [origin]
    }, granted => {
        if (granted) {
            chrome.storage.local.get(origin, data => {
                const newData   = data[origin] ? data[origin] : { enable: false };
                newData[origin] = { enable: !newData.enable }; // toggle
                chrome.storage.local.set(newData, () => {
                    applyByPersistedState(tab, origin);
                });
            });
        }
    });
});

chrome.tabs.onActivated.addListener(e => {
    chrome.tabs.get(e.tabId, tab => {
        if (tab.url) {
            const origin = getTabOrigin(tab);
            applyByPersistedState(tab, origin);
        } else {
            setBadge(false, tab.id);
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {    
    if (changeInfo.status === 'complete' && tab.url) {
        const origin = getTabOrigin(tab);
        applyByPersistedState(tab, origin);
    } else {
        setBadge(false, tab.id);
    }
});