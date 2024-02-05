console.log("Notatka film script 2024")

filmId = getFilmIdFromPath(window.location.href)

var textBox = defaultNoteTextbox()
textBox.style.height = '150px'
textBox.addEventListener('input', createSaveNoteCallback(filmId))

// chrome.storage.sync.get(notesName(), function(result) {
//   var notes = result[notesName()] || {};
chrome.storage.sync.get('notes-new', function(result) {
  var notes = result['notes-new'] || {};
  console.log('read notes: ', notes)
  var noteText = notes[filmId] || '';
  textBox.value = noteText;
  console.log('setting', noteText, 'for:', filmId, )
});

// add text box
waitForElm('.filmActionBox__card').then((elm) => {
  console.log("namierzony filmActionBox__card")
  elm.appendChild(textBox)    
});

// save duration in sync storage
waitForElm('span[data-i18n="film:duration"]').then(elm => {
  var durationText = elm.textContent.trim();
  //minutes = convertToMinutes(durationText)
  //console.log("duration", minutes)
  chrome.storage.sync.get(durationsName(), function(result) {
    var durations = result[durationsName()] || {}
    //if (durations[filmId]) { return }
    durations[filmId] = durationText
    d = {}
    d[durationsName()] = durations
    chrome.storage.sync.set(d, function() {
      console.log('Duration', durationText, 'saved for film ID:', filmId);
  });
});
})