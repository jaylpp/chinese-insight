document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('configButton').addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });

    document.getElementById('instructionsButton').addEventListener('click', function() {
        chrome.tabs.create({url: 'https://sif8f6uboze.feishu.cn/wiki/XiVcwjfdOix1L0k1XA2cJ02Un3g?from=from_copylink'});
    });
});