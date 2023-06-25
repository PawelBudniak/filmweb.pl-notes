console.log("Notatka film script")

filmId = getFilmIdFromPath(window.location.href)

var textBox = defaultNoteTextbox()
textBox.style.height = '150px'
textBox.addEventListener('input', createSaveNoteCallback(filmId))

chrome.storage.sync.get('notes', function(result) {
  var notes = result.notes || {};
  var noteText = notes[filmId] || '';
  textBox.value = noteText;
});

waitForElm('.filmActionBox__card').then((elm) => {
  console.log("namierzony filmActionBox__card")
  elm.appendChild(textBox)    
});