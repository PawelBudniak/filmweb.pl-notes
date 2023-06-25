function handleNotes(){
    chrome.storage.sync.get('notes', function(result) {
        var notes = result.notes || {};

        // Find all film preview elements on the "Films I Want to See" page
        var filmPreviews = document.querySelectorAll('.preview');

        // Iterate over each film preview element
        filmPreviews.forEach(function(filmPreview) {
            // Extract the film ID from the film preview's link element
            var linkElement = filmPreview.querySelector('.preview__link');
            var filmId = getFilmIdFromPath(linkElement.getAttribute('href'));

            // Create a text box element with custom styling
            var textBox = defaultNoteTextbox()

            // Retrieve the note for the current film ID, if available
            var noteText = notes[filmId] || '';
            textBox.value = noteText;

            // Save the note when the text box value changes
            textBox.addEventListener('input', createSaveNoteCallback(filmId))

        // Find the film preview's header element and append the text box
        var headerElement = filmPreview.querySelector('.preview__header');
        headerElement.appendChild(textBox);
        });
    });
}

console.log("WANT TO SEE")
handleNotes()
