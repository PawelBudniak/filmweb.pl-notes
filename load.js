function save(name) {
    document.getElementById(name + "_button").addEventListener('click', () => {
        const jsonInput = document.getElementById(name+"_jsonInput").value;
        const message = document.getElementById(name+"_message");
    
        try {
            const jsonData = JSON.parse(jsonInput);

            var obj = {}
            obj[name + "-new"] = jsonData
            // Store the JSON data in Chrome sync storage
            chrome.storage.sync.set( obj, () => {
                if (chrome.runtime.lastError) {
                    message.textContent = `Error: ${chrome.runtime.lastError}`;
                } else {
                    message.textContent = name + '1 saved successfully!';
                }
            });
        } catch (e) {
            message.textContent = 'Invalid JSON data. Please check your input.' + e;
            console.error('JSON parsing error (obj1):', e);
        }
    });
}
save('notes')
save('durations')