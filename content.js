// Create a text box element
var textBox = document.createElement('textarea');
textBox.style.width = '100%';
textBox.style.height = '200px';
textBox.style.border = '1px solid #ccc';
textBox.style.borderRadius = '5px';
textBox.style.padding = '8px';
textBox.setAttribute('spellcheck', 'false');

// Retrieve the note from sync storage and display it in the text box
// chrome.storage.sync.get('note', function(result) {
//   var noteText = result.note || '';
//   textBox.value = noteText;
// });

// // Save the note when the text box value changes
// textBox.addEventListener('input', function() {
//   var noteText = textBox.value;
//   chrome.storage.sync.set({ 'note': noteText }, function() {
//     console.log('Note saved:', noteText);
//   });
// });

// Extract the film ID from the URL
function getFilmId() {
  var url = window.location.href;
  var filmId = ''; // Initialize with an empty string

  // Implement the logic to extract the film ID from the URL
  // Modify the logic based on the URL structure of filmweb.pl
  // Example: https://www.filmweb.pl/film/{filmId}
  var regex = /\/film\/([^/]+)/;
  var match = url.match(regex);
  if (match && match.length > 1) {
    filmId = match[1];
  }

  return filmId;
}



chrome.storage.sync.get('notes', function(result) {
  var notes = result.notes || {};
  var filmId = getFilmId(); // Implement a function to extract the film ID from the filmweb.pl website
  var noteText = notes[filmId] || '';
  textBox.value = noteText;
});

// Save the note when the text box value changes
textBox.addEventListener('input', function() {
  var filmId = getFilmId(); // Implement a function to extract the film ID from the filmweb.pl website
  var noteText = textBox.value;
  chrome.storage.sync.get('notes', function(result) {
    var notes = result.notes || {};
    notes[filmId] = noteText;
    chrome.storage.sync.set({ 'notes': notes }, function() {
      console.log('Note saved for film ID:', filmId);
    });
  });
});


function myInitCode () {
  console.log("załadowany")
  var targetElement = document.querySelector('.filmActionBox__card'); // Replace with an appropriate selector
  targetElement.appendChild(textBox);
}


// == observe DOM changes

seen = false
// the container doesn't exist at DOM load event, so we observe mutations
var observer = new MutationObserver(function(mutations) {
  // Check if the "Chcę obejrzeć" button exists
  var container = document.querySelector('.filmActionBox__card'); // Replace with an appropriate selector
  if (container && !seen) {
    seen = true
    console.log("namierzony")
    // Attach event listener to the button
    container.appendChild(textBox)    
    // Disconnect the MutationObserver since the button has been found
    observer.disconnect();
  }
});

// Start observing changes in the DOM
observer.observe(document.body, { childList: true, subtree: true });
console.log("Notatka film script")



// NOWY PLAN - napisac maila 
// a extension dac link do letterboxd w rozszerzeniu

// == button click listener - mi sie wydaje ze slaby bo nie wiemy czy najpierw sie wykona ten listener
// czy najpierw sie zmieni wartosc data-value

// function handleButtonClick (){
//   console.log("UWAGA UWAGA: przycisk klikniety: ")
//   divThatHoldsValue = document.querySelector('.wantToSeeStateButton.tooltip__parent')
//   value = divThatHoldsValue.dataset.value
//   console.log("value: " + value)
//   if (value === "0")
//   {
//     console.log("was 0")
//     // nie dziala jak nie bedzie polskiego tytulu raczej
//     var movieTitle = document.querySelector('div.filmCoverSection__originalTitle').innerText;
//     console.log("UWAGA UWAGA: TITLE: "+ movieTitle);
//     displayInTopRight(movieTitle)
//   } else {
//     console.log("wasn't 0")
//   }



// }

// // == observe DOM changes

// // the button doesn't exist at DOM load event, so we observe mutations
// var observer = new MutationObserver(function(mutations) {
//   // Check if the "Chcę obejrzeć" button exists
//   var wantToSeeButton = document.querySelector('.wantToSeeStateButton__container');
//   if (wantToSeeButton) {
//     console.log("namierzony")
//     // Attach event listener to the button
//     wantToSeeButton.addEventListener('click', handleButtonClick);
    
//     // Disconnect the MutationObserver since the button has been found
//     observer.disconnect();
//   }
// });

// // Start observing changes in the DOM
// observer.observe(document.body, { childList: true, subtree: true });


// == check for data-value (goes of like 3 times for some reason xD)
// imo - to jest to co chcemy zrobic, pomysly:
// - dodac delay po 1 odpaleniu tak jak chatGPT sugerowa;
// - dodac debug code ktory printuje old value i new value bo zastanawiam sie co sie odkurwia

function getTitle(){
  let originalTitle = document.querySelector('div.filmCoverSection__originalTitle');
  let title = document.querySelector('.filmCoverSection__title');
  // if there is no title translation then OrigignalTitle doesn't exist
  return originalTitle?.innerText || title.innerText;
}

function getYear(){
  return document.querySelector('.filmCoverSection__year').innerText
}

// https://letterboxd.com/api-beta/ tu trzeba zapytac o access XD 
function addToLetterboxd(){
  const LIST_NAME = 'towatch'

  fetch('https://api.letterboxd.com/api/v0/me/watchlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_LETTERBOXD_API_TOKEN' // Replace with your actual Letterboxd API token
    },
    body: JSON.stringify({
      'filmId': '', // Fill in with the ID of the movie on Letterboxd
      'name': movieTitle
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Movie added to Letterboxd watchlist:', movieTitle);
    } else {
      console.error('Failed to add movie to Letterboxd watchlist:', movieTitle);
    }
  })
  .catch(error => {
    console.error('Failed to make API call:', error);
  });

}


function handleWantToSeeAddition(){
  var movieTitle = getTitle()
  var year = getYear()
  console.log("UWAGA UWAGA: TITLE: "+ movieTitle);
  displayInTopRight(movieTitle + " " + year)
}

function handleMutation(mutations) {
  mutations.forEach(function(mutation) {
    // Check if the mutation is a change in the data-value attribute
    if (mutation.type === 'attributes' &&
        mutation.attributeName === 'data-value' &&
        mutation.target.classList.contains('wantToSeeStateButton')){

      var newValue = mutation.target.dataset.value;
      var oldValue = mutation.oldValue

      console.log("target", mutation.target)
      console.log("new value: " + newValue)
      console.log("old value: " + oldValue)
      // sometimes this somehow fires with oldValue==NewValue, so ignore these cases
      if (newValue !== '0' && newValue != oldValue) {
        handleWantToSeeAddition()
      }
    }
  });
}

// Create a MutationObserver instance
var observer = new MutationObserver(handleMutation);

// Start observing changes in the DOM
observer.observe(document.body, { attributes: true, subtree: true , attributeOldValue: true});


// ==== wait 3 sec

// function wait(ms){
//   var start = new Date().getTime();
//   var end = start;
//   while(end < start + ms) {
//     end = new Date().getTime();
//  }
// }
// wait (3000)
// console.log("poczekany")
// document.querySelector('div.wantToSeeStateButton__container').addEventListener('click', function() {
//   console.log("UWAGA UWAGA: listener entry: ")
//   // nie dziala jak nie bedzie polskiego tytulu raczej
//   var movieTitle = document.querySelector('div.filmCoverSection__originalTitle').innerText;
//   console.log("UWAGA UWAGA: TITLE: "+ movieTitle);
//   displayInTopRight(movieTitle);
// })


