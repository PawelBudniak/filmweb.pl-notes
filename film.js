console.log("Notatka film script")

filmId = getFilmIdFromPath(window.location.href)

var textBox = defaultNoteTextbox()
textBox.height = '200px'
textBox.addEventListener('input', createSaveNoteCallback(filmId))


chrome.storage.sync.get('notes', function(result) {
  var notes = result.notes || {};
  var noteText = notes[filmId] || '';
  textBox.value = noteText;
});


seen = false
// the container doesn't exist at DOM load event, so we observe mutations
var observer = new MutationObserver(function(mutations) {
  // Check if the "Chcę obejrzeć" button exists
  var container = document.querySelector('.filmActionBox__card'); // Replace with an appropriate selector
  if (container && !seen) {
    seen = true
    console.log("namierzony filmActionBox__card")
    // Attach event listener to the button
    container.appendChild(textBox)    
    // Disconnect the MutationObserver since the button has been found
    observer.disconnect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

