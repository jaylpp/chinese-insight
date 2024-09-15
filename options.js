document.addEventListener('DOMContentLoaded', function() {
    // 加载保存的配置
    chrome.storage.sync.get(['modelName', 'apiKey', 'prompt'], function(result) {
        document.getElementById('modelName').value = result.modelName || 'glm-4-flash';
        document.getElementById('apiKey').value = result.apiKey || '';
    });

    // 保存配置
    document.getElementById('save').addEventListener('click', function() {
        var modelName = document.getElementById('modelName').value;
        var apiKey = document.getElementById('apiKey').value;

        chrome.storage.sync.set({
            modelName: modelName,
            apiKey: apiKey
        }, function() {
            var saveButton = document.getElementById('save');
            saveButton.textContent = '已保存';
            saveButton.style.backgroundColor = '#2980b9';
            setTimeout(function() {
                saveButton.textContent = '保存配置';
                saveButton.style.backgroundColor = '#3498db';
            }, 2000);
        });
    });
});