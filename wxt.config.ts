import { defineConfig } from 'wxt';

export default defineConfig({
  browser: 'chrome',
  manifest: {
    name: 'Dropdown Filter',
    description: 'ドロップダウンリストを素早く選択できるようになります',
    version: '0.3.6',
    permissions: ['storage', 'activeTab', 'scripting'],
    optional_host_permissions: ['http://*/', 'https://*/'],
    action: {},
  },
});
