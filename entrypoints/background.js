export default defineBackground(() => {
    async function executeContentScript(tabId) {
        await browser.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            files: ['content-scripts/content.js'],
        });
        await browser.scripting.insertCSS({
            target: { tabId: tabId, allFrames: true },
            files: ['content-scripts/content.css'],
        });
    }

    function setBadge(isActive, tabId) {
        if (isActive) {
            browser.action.setBadgeText({ text: 'on', tabId: tabId });
            browser.action.setBadgeBackgroundColor({ color: '#008000', tabId: tabId });
        } else {
            browser.action.setBadgeText({ text: 'off', tabId: tabId });
            browser.action.setBadgeBackgroundColor({ color: '#696969', tabId: tabId });
        }
    }

    function getTabOrigin(tab) {
        return new URL(tab.url).origin + '/';
    }

    async function applyByPersistedState(tab, origin, inject = false) {
        const data = await browser.storage.local.get(origin);
        if (data[origin] && data[origin].enable) {
            if (inject) executeContentScript(tab.id);
            setBadge(true, tab.id);
        } else {
            setBadge(false, tab.id);
        }
    }

    browser.action.onClicked.addListener(async tab => {
        const origin = getTabOrigin(tab);
        const granted = await browser.permissions.request({ origins: [origin] });
        if (granted) {
            const data = await browser.storage.local.get(origin);
            const newData = data[origin] ? data[origin] : { enable: false };
            newData[origin] = { enable: !newData.enable };
            await browser.storage.local.set(newData);
            applyByPersistedState(tab, origin, /*inject=*/true);
        }
    });

    browser.tabs.onActivated.addListener(async e => {
        const tab = await browser.tabs.get(e.tabId);
        if (tab.url) {
            applyByPersistedState(tab, getTabOrigin(tab));
        } else {
            setBadge(false, tab.id);
        }
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.url) {
            applyByPersistedState(tab, getTabOrigin(tab));
        } else {
            setBadge(false, tabId);
        }
    });
});
