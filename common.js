function defaultNoteTextbox(){
    var textBox = document.createElement('textarea');
    textBox.style.width = '100%';
    textBox.style.height = '100px';
    textBox.style.border = '1px solid #ccc';
    textBox.style.borderRadius = '5px';
    textBox.style.padding = '8px';
    textBox.setAttribute('spellcheck', 'false');
    textBox.style.backgroundColor = '#f8f8f8';
    textBox.style.fontFamily = 'Arial, sans-serif';
    textBox.style.fontSize = '14px';
    textBox.style.textAlign = 'left';

    textBox.addEventListener('focus', function() {
        textBox.style.border = '1px solid green';
        // textBox.style.backgroundColor = '#fff';
      });
      
    textBox.addEventListener('blur', function() {
        textBox.style.border = '1px solid #ccc';
        // textBox.style.backgroundColor = '#f8f8f8';
    });

    // textBox.style.background = 'linear-gradient(to bottom, #ffffff, #f2f2f2)';
    // textBox.style.borderRadius = '10px';
    //textBox.style.transition = 'box-shadow 0.3s ease-in-out';
    textBox.placeholder = 'Add your notes here...';

    return textBox
}

function createSaveNoteCallback(filmId){
    return function(event){
        var textBox = event.target
        var noteText = textBox.value;
        chrome.storage.sync.get('notes', function(result) {
            var notes = result.notes || {};
            notes[filmId] = noteText;
            chrome.storage.sync.set({ 'notes': notes }, function() {
                console.log('Note saved for film ID:', filmId);
            });
        });
    }
}

function getFilmIdFromPath(path) {
    var filmId = '';
  
    // Example: */film/{filmId}*
    var regex = /\/(?:film|serial)\/([^/]+)/;
    var match =path.match(regex);
    if (match && match.length > 1) {
      filmId = match[1];
    }
  
    return filmId;
}


function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}