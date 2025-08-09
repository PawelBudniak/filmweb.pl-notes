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

function print (name) {
  chrome.storage.sync.get(name, function(result) {
    console.log("saved:", name)
    console.log(result)
  })
}

// add text box
waitForElm('.filmRatingSection__filmActionBox').then((elm) => {
  console.log("namierzony filmRatingSection__filmActionBox");
  // wait for child elements to get added so it actually goes to the bottom
  setTimeout(_ => {
    elm.appendChild(textBox);
  }, 500);
});


const NEW_DURATION_FORMAT = (/\d+h(\s+\d+m)?/)
//const new_duration_format = (/(\d+) godz\.(\s+(\d+) min\.)?/)

function convertToOldFormat(duration) { 
  duration = duration.replace('h', ' godz.')
  return duration.replace('m', ' min.')
}


// save duration in sync storage
waitForElm('.filmCoverSection__duration').then(elm => {
  var durationText = elm.textContent.trim();
  //minutes = convertToMinutes(durationText)
  //console.log("duration", minutes)
  chrome.storage.sync.get(durationsName(), function(result) {
    var durations = result[durationsName()] || {}

    if (durationText.match(NEW_DURATION_FORMAT)) {
      durationText = convertToOldFormat(durationText)
      console.log("converted to: ", durationText)
    } else {
      console.log("old format ")
    }

    durations[filmId] = durationText
    d = {}
    d[durationsName()] = durations
    chrome.storage.sync.set(d, function() {
      console.log('Duration', durationText, 'saved for film ID:', filmId);
  });
});
})

