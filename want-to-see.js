
// WORKING VERSION
// setTimeout(function() {
//     if (window.location.hash.includes("/wantToSee/")) {
//         console.log("This is a 'Films I Want to See' page");
//         // Your other code for this page...
//         console.log("WANT TO SEE")
//         // Wait until the first preview is available
//         waitForElm('.sc-jhJOaJ.jfczAc').then((elm) => {
//             //console.log("first preview found")
//             chrome.storage.sync.get('notes', function(result) {
//                 var notes = result.notes || {};
            
//                 // Find all film preview elements on the "Films I Want to See" page
//                 var filmPreviews = document.querySelectorAll('.sc-jhJOaJ.jfczAc');
//                 //console.log("film previous found: ", filmPreviews)
            
//                 setTimeout(function() {
//                     filmPreviews.forEach(function(filmPreview) {
//                         addNoteTextBox(notes, filmPreview)
//                     });
        
//                     observeDOM(notes);
//                 }, 1000);
            
//             });
//         });
//     }
// }, 200);


// sync read storage
setTimeout(function() {
    if (window.location.hash.includes("/wantToSee/")) {
        console.log("This is a 'Films I Want to See' page");
        // Your other code for this page...
        console.log("WANT TO SEE")
        // Wait until the first preview is available
        waitForElm('.sc-jhJOaJ.jfczAc').then(async (elm) => {
            //console.log("first preview found")

            let notes = await readSyncStorage('notes')
            let durations = await readSyncStorage('durations')
                
            // Find all film preview elements on the "Films I Want to See" page
            var filmPreviews = document.querySelectorAll('.sc-jhJOaJ.jfczAc');
            //console.log("film previous found: ", filmPreviews)
        
            setTimeout(function() {
                filmPreviews.forEach(function(filmPreview) {
                    addNoteTextBox(notes, filmPreview, durations)
                });
    
                observeDOM(notes, durations);
            }, 1000);
        });
    }
}, 200);


// nie dziala
// Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'Utalentowany+pan+Ripley-1999-867')
// Kontekst

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

// if (window.location.hash.includes("/wantToSee/")) {
//     console.log("This is a 'Films I Want to See' page");
//     // Your other code for this page...
//     console.log("WANT TO SEE")
//     // Wait until the first preview is available
    
//     chrome.storage.sync.get('notes', function(result) {
//         var notes = result.notes || {};
//         observeDOM(notes);
//     });
// }

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

    //console.log("fimid:", filmId)

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


    return el;
  }

// Function to observe mutations in the DOM
function observeDOM(notes) {
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
              addNoteTextBoxWait(notes, addedElement)
            }
          }
        }
      }
    };
  
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(callback);
  
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }
  
  // Observe DOM mutations to annotate new elements with the specified class name
  observeDOM();

// if (window.location.hash.includes("/wantToSee/")) {
//     console.log("This is a 'Films I Want to See' page");
//     // Your other code for this page...
//     console.log("WANT TO SEE")

//     const observer = new MutationObserver(mutations => {
//         filmPreview = document.querySelector('.sc-jhJOaJ.jfczAc')
//         if (filmPreview) {
//             console.log("found preview: ", filmPreview)
//             waitForElmParent(filmPreview, '.sc-fbKhjd.xMhRc').then((elm) => {
//                 var linkElement = filmPreview.querySelector('.sc-fbKhjd.xMhRc');
//                 var filmId = getFilmIdFromPath(linkElement.getAttribute('href'));
        
//                 //console.log("fimid:", filmId)
        
//                 var textBox = defaultNoteTextbox()
//                 textBox.style.marginTop = '10px'
        
//                 // Retrieve the note for the current film ID, if available
//                 var noteText = notes[filmId] || '';
//                 textBox.value = noteText;
        
//                 // Save the note when the text box value changes
//                 textBox.addEventListener('input', createSaveNoteCallback(filmId))
        
//                 // Find the film preview's header element and append the text box
//                 var headerElement = filmPreview.querySelector('.sc-fbKhjd.xMhRc');
//                 headerElement.appendChild(textBox);
//             });
//         }
//     });
//     observer.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
// }

//     // Wait until the first preview is available
//     waitForElm('.sc-jhJOaJ.jfczAc').then((elm) => {
//         //console.log("first preview found")
//         chrome.storage.sync.get('notes', function(result) {
//             var notes = result.notes || {};
        
//             // Find all film preview elements on the "Films I Want to See" page
//             var filmPreviews = document.querySelectorAll('.sc-jhJOaJ.jfczAc');
//             //console.log("film previous found: ", filmPreviews)
        
//             filmPreviews.forEach(function(filmPreview) {
//                 waitForElmParent(filmPreview, '.sc-fbKhjd.xMhRc').then((elm) => {
//                     var linkElement = filmPreview.querySelector('.sc-fbKhjd.xMhRc');
//                     var filmId = getFilmIdFromPath(linkElement.getAttribute('href'));
            
//                     //console.log("fimid:", filmId)
            
//                     var textBox = defaultNoteTextbox()
//                     textBox.style.marginTop = '10px'
            
//                     // Retrieve the note for the current film ID, if available
//                     var noteText = notes[filmId] || '';
//                     textBox.value = noteText;
            
//                     // Save the note when the text box value changes
//                     textBox.addEventListener('input', createSaveNoteCallback(filmId))
            
//                     // Find the film preview's header element and append the text box
//                     var headerElement = filmPreview.querySelector('.sc-fbKhjd.xMhRc');
//                     headerElement.appendChild(textBox);
//                 });
//             });
//         });
//     });
// }
// chrome.storage.sync.get('notes', function(result) {
//     var notes = result.notes || {};

//     // Find all film preview elements on the "Films I Want to See" page
//     var filmPreviews = document.querySelectorAll('.sc-jhJOaJ.jfczAc');
//     console.log("film previous found: ", filmPreviews)

//     filmPreviews.forEach(function(filmPreview) {
//         var linkElement = filmPreview.querySelector('.sc-fbKhjd.xMhRc');
//         var filmId = getFilmIdFromPath(linkElement.getAttribute('href'));

//         console.log("fimid:", filmId)

//         var textBox = defaultNoteTextbox()
//         textBox.style.marginTop = '10px'

//         // Retrieve the note for the current film ID, if available
//         var noteText = notes[filmId] || '';
//         textBox.value = noteText;

//         // Save the note when the text box value changes
//         textBox.addEventListener('input', createSaveNoteCallback(filmId))

//         // Find the film preview's header element and append the text box
//         var headerElement = filmPreview.querySelector('.sc-fbKhjd.xMhRc');
//         headerElement.appendChild(textBox);
//     });
// });
