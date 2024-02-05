setTimeout(function() {
    if (window.location.hash.includes("/wantToSee/")) {
        console.log("WANT TO SEE")
        // Wait until the first preview is available
        waitForElm('.sc-jhJOaJ.jfczAc').then(async (elm) => {
            //console.log("first preview found")

            let notes = await readSyncStorage(notesName())
            let durations = await readSyncStorage(durationsName())

            // console.log('notes', notes)
            // return
                
            // Find all film preview elements on the "Films I Want to See" page
            var filmPreviews = document.querySelectorAll('.sc-jhJOaJ.jfczAc');
            //console.log("film previous found: ", filmPreviews)
        
            setTimeout(function() {
                filmPreviews.forEach(function(filmPreview) {
                    addNoteTextBox(notes, filmPreview, durations)
                });
    
                observer = observeDOM(notes, durations);
                createSortButton(observer);
            }, 1000);
        });
    }
}, 200);

const readSyncStorage = async (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, function (result) {
        if (result[key] === undefined) {
          console.log('rejecting')
          reject();
        } else {
          resolve(result[key]);
        }
      });
    });
  };


// WITH WAITING
function addNoteTextBoxWait(notes, filmPreview, durations) {
    waitForElmParent(filmPreview, '.sc-fbKhjd.xMhRc').then((linkElement) => {
       addNoteTextBoxLink(notes, filmPreview, linkElement, durations)
    });
  }

// NO WAIT
function addNoteTextBox(notes, filmPreview, durations) {
    var linkElement = filmPreview.querySelector('.sc-fbKhjd.xMhRc');
    addNoteTextBoxLink(notes, filmPreview, linkElement, durations)
}

function addNoteTextBoxLink(notes, filmPreview, linkElement, durations){
    var filmId = getFilmIdFromPath(linkElement.getAttribute('href'));

    var textBox = defaultNoteTextbox()
    textBox.style.marginTop = '10px'

    // Retrieve the note for the current film ID, if available
    var noteText = notes[filmId] || '';
    textBox.value = noteText;

    // Save the note when the text box value changes
    textBox.addEventListener('input', createSaveNoteCallback(filmId))

    // Find the film preview's header element and append the text box
    //var headerElement = filmPreview.querySelector('.sc-fbKhjd.xMhRc');
    var parent = filmPreview.querySelector('.sc-fEcDHC.jSUPsO');
    parent.appendChild(textBox);

    // Add duration info
    displayDuration(filmPreview, filmId, durations)
}

function displayDuration(parent, filmId, durations) {
    // Find the film preview's header element and append the duration box
    duration = durations[filmId]
    el = createDurationElement(duration)
    parent.appendChild(el)
}

function createDurationElement(duration) {
    var el = document.createElement('div');
    //d = duration ? duration : ''
    el.textContent = duration ? duration : ''

    el.style.fontSize = '14px';
    el.style.color = '#555';
    el.style.marginTop = '10px';
    el.style.fontStyle = 'italic';
    el.style.width = '100%';
    el.style.textAlign = 'center';

    el.classList.add("my-duration")

    return el;
  }

// Function to observe mutations in the DOM
function observeDOM(notes, durations) {
    // Select the target node to observe (the body in this case)
    var targetNode = document.body;
  
    // Options for the observer (in this case, we want to observe childList mutations)
    var config = { childList: true, subtree: true };
  
    // Callback function to execute when mutations are observed
    var callback = function (mutationsList, observer) {
      for (var mutation of mutationsList) {
        if (mutation.type === "childList") {
          // Check if the added nodes include elements with the specified class name
          var addedElements = mutation.addedNodes;
          for (var i = 0; i < addedElements.length; i++) {
            var addedElement = addedElements[i];
            if (
              addedElement.nodeType === 1 && // Check if it's an element node
              addedElement.classList.contains("sc-jhJOaJ") &&
              addedElement.classList.contains("jfczAc")
            ) {
              // Annotate the specific element with the desired class name
              addNoteTextBoxWait(notes, addedElement, durations)
            }
          }
        }
      }
    };
  
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);
  
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    return observer
}

  // SORT
function createSortButton(observer) {
  console.log("creating button")
  var sortButton = document.createElement('button');
  sortButton.textContent = 'Sort Movies';
  sortButton.style.margin = '10px';

  // Add an event listener to the button to trigger the sort logic
  sortButton.addEventListener('click', function () {
    sortByDuration(observer);
  });

  // Append the button to the top of the page (you can adjust the target location)
  document.body.insertBefore(sortButton, document.body.firstChild);
}

function sortByDuration() {
  observer.disconnect();
    // Get the parent grid element
  var parentGrid = document.querySelector('.sc-gFVvzn.sc-kqNxZD.epxeWl.cbRtlG');

  // Get all the child movie elements
  var movieElements = Array.from(parentGrid.querySelectorAll('.sc-jhJOaJ.jfczAc'));

  // Extract and store movie data with duration from each child element
  var moviesData = movieElements.map(function (movieElement) {
    return {
      element: movieElement,
      duration: extractDuration(movieElement) // Replace with your logic to extract duration
    };
  });

  // Sort movies based on duration
  moviesData.sort(function (a, b) {
    // Convert and compare durations (replace with your logic if duration is not in minutes)
    var durationA = convertToMinutes(a.duration);
    var durationB = convertToMinutes(b.duration);
    return durationA - durationB;
  });

  // Clear existing content in the parent grid
  parentGrid.innerHTML = '';

  // Append sorted movie elements to the parent grid
  moviesData.forEach(function (movie) {
    parentGrid.appendChild(movie.element);
  });
}
// Function to extract duration from a movie element (replace with your logic)
function extractDuration(movieElement) {
  // Replace this logic with your code to extract duration from the movie element
  return movieElement.querySelector('.my-duration').textContent.trim();
}

// Function to convert duration text to minutes
function convertToMinutes(durationText) {
  // Extract hours and minutes using a regular expression
  var match = durationText.match(/(\d+) godz\.(\s+(\d+) min\.)?/);

  if (match) {
    // Parse hours and minutes from the regex match
    var hours = parseInt(match[1], 10) || 0;
    var minutes = match[3] ? parseInt(match[3], 10) || 0 : 0;

    return hours * 60 + minutes;
  } else {
    console.log("Invalid duration format: ", durationText);
    return null;
  }
}

// migrateData();
// function migrateData() {
//   // Fetch existing data from Chrome Sync Storage
//   chrome.storage.sync.get(['notes', 'durations'], function (result) {
//     if (chrome.runtime.lastError) {
//       console.error('Error fetching data from Chrome Sync Storage:', chrome.runtime.lastError);
//       return;
//     }

//     // Process and migrate data
//     const notesData = migrateMap(result.notes);
//     const durationsData = migrateMap(result.durations);

//     // Save migrated data to new maps
//     chrome.storage.sync.set({ 'notes-new': notesData });
//     chrome.storage.sync.set({ 'durations-new': durationsData });

//     console.log('Migration completed successfully.');
//   });
// }

// // Function to migrate map data
// function migrateMap(originalMap) {
//   const migratedMap = {};

//   if (originalMap) {
//     Object.keys(originalMap).forEach(function (key) {
//       // Extract the last part of the ID
//       const id = extractFilmID(key);
      
//       // Create an entry in the new map
//       migratedMap[id] = originalMap[key];
//     });
//   }

//   console.log(migratedMap);
//   return migratedMap;
// }

// // Function to extract the last part of the ID
// function extractFilmID(id) {
//   const parts = id.split('-');
//   return parts[parts.length - 1];
// }

// // Call the migration function
// migrateData();