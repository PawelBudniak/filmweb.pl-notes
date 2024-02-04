console.log("Notatka film script 2024")

filmId = getFilmIdFromPath(window.location.href)

var textBox = defaultNoteTextbox()
textBox.style.height = '150px'
textBox.addEventListener('input', createSaveNoteCallback(filmId))

chrome.storage.sync.get('notes', function(result) {
  var notes = result.notes || {};
  var noteText = notes[filmId] || '';
  textBox.value = noteText;
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
  chrome.storage.sync.get('durations', function(result) {
    var durations = result.durations || {}
    //if (durations[filmId]) { return }
    durations[filmId] = durationText
    chrome.storage.sync.set({ 'durations': durations }, function() {
      console.log('Duration saved for film ID:', filmId);
  });
});
})


// Function to convert duration text to minutes
function convertToMinutes(durationText) {
  // Extract hours and minutes using a regular expression
  var match = durationText.match(/(\d+) godz\. (\d+) min\./);

  if (match) {
    // Parse hours and minutes from the regex match
    var hours = parseInt(match[1], 10) || 0;
    var minutes = parseInt(match[2], 10) || 0;

    return hours * 60 + minutes;;
  } else {
    console.log("Invalid duration format");
    return null;
  }
}