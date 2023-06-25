function defaultNoteTextbox(){
    var textBox = document.createElement('textarea');
    textBox.style.width = '100%';
    textBox.style.height = '100px';
    textBox.style.border = '1px solid #ccc';
    textBox.style.borderRadius = '5px';
    textBox.style.padding = '8px';
    textBox.setAttribute('spellcheck', 'false');

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
    var regex = /\/film\/([^/]+)/;
    var match =path.match(regex);
    if (match && match.length > 1) {
      filmId = match[1];
    }
  
    return filmId;
}
