const noteContentInput = document.getElementById("note-content-input");
const noteTitleInput = document.getElementById("note-title-input");
const saveButton = document.getElementById("save-button");
const notesListContainer = document.getElementById("notes-list");
const modalContainer = document.getElementById("modal-container");

let notesData = JSON.parse(localStorage.getItem("notes")) || [];

// notes initialization
if (notesData.length === 0) {
  const messageElement = document.createElement('p');
  messageElement.textContent = 'Make your first note!';
  messageElement.className = 'text-center text-secondary-emphasis m-0';
  notesListContainer.appendChild(messageElement);
} else {
  renderNotes();
}

// auto fill title
noteContentInput.addEventListener("change", () => {
  if (!noteTitleInput.value) {
    const maxLength = noteTitleInput.maxLength; // Get the maxlength attribute value
    noteTitleInput.value = noteContentInput.value.slice(0, maxLength); // Truncate the text
  }
})

// save button listener
saveButton.addEventListener("click", () => {
  // if there are no input, skip
  if (!noteTitleInput.value || !noteContentInput.value) {
    return;
  }

  // if there are no notes, delete default empty notes message first
  if (notesData.length == 0) {
    notesListContainer.removeChild(notesListContainer.lastElementChild);
  }
  
  // create note button and modal, and store to local storage
  const noteId = Date.now(); // use date as note id
  notesData.push({
    id: noteId,
    title: noteTitleInput.value,
    content: noteContentInput.value
  })
  localStorage.setItem("notes", JSON.stringify(notesData));
  renderNotes();

  // delete note content and title input values
  noteContentInput.value = "";
  noteTitleInput.value = "";
})

function renderNotes() {
  notesListContainer.innerHTML = ''; // clear the list
  modalContainer.innerHTML = ''; // clear the modals

  // show message if there are no notes
  if (notesData.length === 0) {
    const messageElement = document.createElement('p');
    messageElement.textContent = 'Make your first note!';
    messageElement.className = 'text-center text-secondary-emphasis m-0';
    notesListContainer.appendChild(messageElement);
  }

  notesData.map((note) => {
    const noteModal = createModal(note.id, note.content, note.title)
    modalContainer.appendChild(noteModal);
    const noteListComponent = createNoteListComponent(note.id, note.title);
    notesListContainer.appendChild(noteListComponent);
  })
}


function createNoteListComponent(id, title = "Title") {
  // Create main container
  const container = document.createElement('div');
  container.className = 'd-flex';

  // Create main text button
  const textButton = document.createElement('button');
  textButton.type = 'button';
  textButton.className = 'btn btn-dark text-truncate border rounded-0 rounded-start me-auto flex-grow-1';
  textButton.setAttribute('data-bs-toggle', 'modal');
  textButton.setAttribute('data-bs-target', `#${id}`);
  textButton.textContent = title; // Use provided text or default

  // Create button group for right-side buttons
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'btn-group';

  // Create copy button
  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'btn btn-dark border rounded-0';
  copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
      </svg>
    `;
  copyButton.addEventListener("click", () => {
    const content = document.getElementById(`${id}-content`).innerHTML;
    const title = document.getElementById(`${id}-title`).innerHTML;
    const result = title + '\n\n' + content;
    navigator.clipboard.writeText(result);
    alert("Copied note: \n\n" + result);
  })

  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'btn border btn-outline-danger';
  deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
      </svg>
    `
  deleteButton.addEventListener("click", () => {
    notesData = notesData.filter((note) => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(notesData));
    renderNotes();
  })

  // Assemble the structure
  buttonGroup.appendChild(copyButton);
  buttonGroup.appendChild(deleteButton);
  container.appendChild(textButton);
  container.appendChild(buttonGroup);

  return container;
}

function createModal(id, content = 'Note Content', title = "Title") {

  // Create modal elements
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = id;
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('aria-labelledby', `note-${id}`);
  modal.setAttribute('aria-hidden', 'true');

  const modalDialog = document.createElement('div');
  modalDialog.className = 'modal-dialog modal-dialog-centered modal-dialog-scrollable';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Modal header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';

  const modalTitle = document.createElement('h1');
  modalTitle.className = 'modal-title fs-5';
  modalTitle.id = `${id}-title`;
  modalTitle.textContent = title;

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.setAttribute('data-bs-dismiss', 'modal');
  closeButton.setAttribute('aria-label', 'Close');

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  // Modal body
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  modalBody.id = `${id}-content`;
  modalBody.textContent = content;

  // Modal footer
  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn btn-dark border';
  closeBtn.setAttribute('data-bs-dismiss', 'modal');
  closeBtn.textContent = 'Close';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'btn btn-dark border';
  copyBtn.textContent = 'Copy';
  copyBtn.addEventListener("click", () => {
    const result = title + '\n\n' + content;
    navigator.clipboard.writeText(result);
    alert("Copied note: \n\n" + result);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-dark text-danger border';
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('data-bs-dismiss', 'modal');
  deleteBtn.addEventListener("click", () => {
    notesData = notesData.filter((note) => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(notesData));
    renderNotes();
  })

  modalFooter.appendChild(closeBtn);
  modalFooter.appendChild(copyBtn);
  modalFooter.appendChild(deleteBtn);

  // Assemble the modal
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);

  modalDialog.appendChild(modalContent);
  modal.appendChild(modalDialog);

  return modal;
}
