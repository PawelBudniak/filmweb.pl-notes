function dump(name) {
    chrome.storage.sync.get([name], function(result) {
        console.log(name, " dump::")
        const obj = result[name];
        const jsonString = JSON.stringify(obj, null, 2);
        console.log(jsonString);
      });
}
