import { defineConfig } from 'wxt';

export default defineConfig({
  browser: 'chrome',
  modules: ['@wxt-dev/auto-icons'],
  autoIcons: {
    baseIconPath: 'assets/icon.drawio.svg',
  },
  manifest: {
    name: 'Dropdown Filter',
    description: 'ドロップダウンリストを素早く選択できるようになります',
    version: '0.4.1',
    permissions: ['storage', 'activeTab', 'scripting'],
    optional_host_permissions: ['http://*/', 'https://*/'],
    action: {},
  },
});
