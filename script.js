const url = 'https://anotadasservice.onrender.com/api/note';
var notes = [];

window.onload = async () => {
    await getNotes().then(data => {
        notes = data;
        addNotesToDOM(notes);
    });

    const buttonAdd = document.getElementById('add-duretaneada');

    buttonAdd.addEventListener('click', () => {
        openForm();
    });
}

function closeForm() {
    const panelForm = document.getElementById('panel-form');
    document.body.removeChild(panelForm);
}

function openForm() {

    const formPanel = document.createElement('div');
    formPanel.className = 'panel-form';
    formPanel.id = 'panel-form';

    formPanel.innerHTML = `
        <div class="form">
            <div>
                <textarea col="5" id="description" placeholder="description"></textarea>
            </div>
            <div>
                <select id="person">
                    <option value="mamá" selected>Mamá</option>
                    <option value="papá">Papá</option>
                    <option value="leo">Leo</option>
                    <option value="nico">Nico</option>
                    <option value="eze">Eze</option>
                    <option value="anónimo">Anónimo</option>
                </select>
            </div>
            <div>
                <button id="confirm-add">Agregar</button>
            </div>
        </div>
        <button id='close-form'>Volver</button>
    `;

    document.body.appendChild(formPanel);

    const btnConfirmAdd = document.getElementById('confirm-add');
    btnConfirmAdd.addEventListener('click', () => {
        createNote();
    }); 

    const btnCloseForm = document.getElementById('close-form');
    btnCloseForm.addEventListener('click', () => {
        closeForm();
    }); 
}

function addSpinner() {
    const btnAdd = document.getElementById('confirm-add');

    btnAdd.innerHTML = `
        Agregar <span class='spinner'></span>
    `;
}

function removeSpinner() {
    const btnAdd = document.getElementById('confirm-add');

    btnAdd.innerHTML = `
        Agregar
    `;
}


async function createNote() {
    const description = document.getElementById('description').value;
    const person = document.getElementById('person').value;
    
    const body = {
        description, person
    }
    
    addSpinner();
    await addNote(body).then(async () => {
        removeSpinner();
        closeForm();
        alert('Duretaneada agregada con éxito');
        await getNotes().then(data => {
            notes = data;
            addNotesToDOM(notes);
        });
    })
    .catch(e => {
        console.log(e);
        removeSpinner();
        closeForm();
        alert('Error al intentar agregar la duretaneada. reintente');
    });
}

function addNotesToDOM(notes) {
    const notesSection = document.getElementById('notes-section');

    notesSection.innerHTML = '';

    notes.map(note => {
        const element = document.createElement('div');
        const personSpan = document.createElement('span');
        const descriptionSpan = document.createElement('span');
        const timeSpan = document.createElement('span');

        element.className = 'note-element';

        personSpan.innerHTML = `
            ${note.person}
        `;
            // <span class='delete-button' id='delete-button'>eliminar</span>
        element.appendChild(personSpan);

        descriptionSpan.innerHTML = note.description;
        element.appendChild(descriptionSpan);

        timeSpan.innerHTML = new Date(note.creation).toLocaleString();
        element.appendChild(timeSpan);

        notesSection.appendChild(element);
    });
}

async function getNotes() {
    const response = await fetch(url);
    const json = await response.json();
    const data = json.data;
    return data;
}

async function addNote(body) {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });
    const json = await response.json();
    const data = json.data;
    return data;
}

async function updateNote(body) {
    const response = await fetch(url, {
        method: 'PUT',
        body
    });
    const json = await response.json();
    const data = json.data;
    return data;
}

async function deleteNote(id) {
    const response = await fetch(url + `/${id}`, {
        method: 'DELETE'
    });
    const json = await response.json();
    const data = json.data;
    return data;
}