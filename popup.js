document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('configButton').addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });

    document.getElementById('instructionsButton').addEventListener('click', function() {
        chrome.tabs.create({url: 'https://github.com/jaylpp/chinese-insight'});
    });
});
