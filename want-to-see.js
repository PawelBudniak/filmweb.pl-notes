console.log("WANT TO SEE")
chrome.storage.sync.get('notes', function(result) {
    var notes = result.notes || {};

    // Find all film preview elements on the "Films I Want to See" page
    var filmPreviews = document.querySelectorAll('.preview');

    filmPreviews.forEach(function(filmPreview) {
        var linkElement = filmPreview.querySelector('.preview__link');
        var filmId = getFilmIdFromPath(linkElement.getAttribute('href'));

        var textBox = defaultNoteTextbox()
        textBox.style.marginTop = '10px'

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
