const uri = 'api/todoitems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let addButton = button.cloneNode(false);
        addButton.innerText = 'Add';
        addButton.setAttribute('onclick', `addItemAfter(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textSpan = document.createElement('span');
        textSpan.innerText = item.name;
        textSpan.style.color = item.isComplete ? 'MediumSeaGreen' : 'Tomato';
        //let textNode = document.createTextNode(item.name);
        //textNode.style = colorStyle;
        td2.appendChild(textSpan);

        let td3 = tr.insertCell(1);
        let textNode = document.createTextNode(item.owner);
        td3.appendChild(textSpan);

        let td4 = tr.insertCell(2);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(3);
        td5.appendChild(deleteButton);

        let td6 = tr.insertCell(4);
        td6.appendChild(addButton);
    });

    todos = data;
}

function sortTable(column) {
    todos.sort((a, b) => {
        if (column == 'isComplete') {
            // Sortuj checkboxy (wartości logiczne) za pomocą operatora logicznego ===, dlaczego przy zamianie a i b miejscami, sortowało desc?
            return b[column] === a[column] ? 0 : b[column] ? 1 : -1;
        } else if (column == 'name') {
            // Sortuj inne kolumny
            const aValue = a[column].toString().toUpperCase();
            const bValue = b[column].toString().toUpperCase();
            return aValue.localeCompare(bValue);
        }
    });
    _displayItems(todos);
}

function addItemAfter(id) {
    const addNameTextbox = document.getElementById('add-name');

    const newItem = {
        isComplete: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
        .then(response => response.json())
        .then(data => {
            // Znajdź indeks klikniętego itemu
            const index = todos.findIndex(item => item.id === id);

            // Wstaw nowy po nim
            todos.splice(index + 1, 0, data);

            // Update listy
            _displayItems(todos);
        })
        .catch(error => console.error('Unable to add item.', error));
}