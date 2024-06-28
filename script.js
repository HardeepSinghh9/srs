document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('S_Form');
    const recordsTable = document.getElementById('Recordtable');
    const SPhotoInput = document.getElementById('SPhoto');
    const fileName = document.getElementById('fileName');
    const contactInput = document.getElementById('contact');

    // LOADING SAVED RECORDS FROM THE STORAGE MADE LOCALLY
    loadRecordsFromLocalStorage();

    function loadRecordsFromLocalStorage() {
        const records = JSON.parse(localStorage.getItem('SRecords')) || [];
        records.forEach(function (record) {
            const newRow = recordsTable.insertRow();
            const nameCell = newRow.insertCell(0);
            const idCell = newRow.insertCell(1);
            const emailCell = newRow.insertCell(2);
            const contactCell = newRow.insertCell(3);
            const actionsCell = newRow.insertCell(4);

            // PUTTING ALL THE DATA IN TABLE
            nameCell.textContent = record.S_name;
            idCell.textContent = record.s_id;
            emailCell.textContent = record.email;
            contactCell.textContent = record.contact;

            // edit and delete buttons

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            editBtn.classList.add('edit-btn');
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.classList.add('delete-btn');

            // PUTTING BUTTONS IN LAST CELL I.E ACTIONS CELL FOR EDIT AND DELETE
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }

    //SUBMIT BUTTON
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        addStudentRecord();
    });

    // ADDING RECORD
    async function addStudentRecord() {
        const S_name = document.getElementById('S_name').value;
        const s_id = document.getElementById('s_id').value;
        const email = document.getElementById('email').value;
        const contact = contactInput.value;

        // Validations for name and contact 
        const namePattern = /^[A-Za-z\s]+$/;
        if (!namePattern.test(S_name)) {
            alert('Please enter a valid name with only alphabets.');
            return;
        }

        const contactPattern = /^[0-9]+$/;
        if (!contactPattern.test(contact)) {
            alert('Please enter a valid contact number.');
            return;
        }

        // Add new record to table
        const newRow = recordsTable.insertRow();
        const nameCell = newRow.insertCell(0);
        const idCell = newRow.insertCell(1);
        const emailCell = newRow.insertCell(2);
        const contactCell = newRow.insertCell(3);
        const actionsCell = newRow.insertCell(4);

        contactCell.textContent = contact; 
        nameCell.textContent = S_name; 
        idCell.textContent = s_id; 
        emailCell.textContent = email; 

        // Create edit and delete buttons
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn'); 

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);

        // Save record to local storage
        saveRecordToLocalStorage({
            S_name: S_name,
            s_id: s_id,
            email: email,
            contact: contact
        });

        form.reset(); // Clear the form after adding record
    }

    // Handle edit, save, delete actions
    recordsTable.addEventListener('click', function (event) {
        const target = event.target.closest('button');
        if (target) {
            if (target.classList.contains('edit-btn')) {
                editStudentRecord(target.closest('tr'));
            } else if (target.classList.contains('save-btn')) {
                saveEditedRecord(target.closest('tr'));
            } else if (target.classList.contains('delete-btn')) {
                deleteStudentRecord(target.closest('tr'));
            }
        }
    });

    // EDIT FUNCTION
    function editStudentRecord(recordRow) {
        const cells = recordRow.cells;
        for (let i = 0; i < cells.length - 1; i++) { //  loop to iterate through all cells except last one
            const cell = cells[i];
            const text = cell.textContent.trim();
            cell.innerHTML = `<input type="text" value="${text}">`; // to input field with current text
        }

        const editBtn = recordRow.querySelector('.edit-btn');
        editBtn.classList.remove('edit-btn');
        editBtn.classList.add('save-btn'); // to save-btn class for editing
    }

    // SAVE EDITED RECORD
    function saveEditedRecord(recordRow) {
        const cells = recordRow.cells;
        const rowIndex = recordRow.rowIndex - 1;
        const records = JSON.parse(localStorage.getItem('SRecords')) || [];

        // Update record in local storage
        const updatedRecord = {
            S_name: cells[0].querySelector('input').value, //  retrieve input value
            s_id: cells[1].querySelector('input').value, 
            email: cells[2].querySelector('input').value, 
            contact: cells[3].querySelector('input').value 
        };

        records[rowIndex] = updatedRecord;
        localStorage.setItem('SRecords', JSON.stringify(records));

        for (let i = 0; i < cells.length - 1; i++) {
            const cell = cells[i];
            const input = cell.querySelector('input');
            const value = input.value;
            cell.textContent = value; //  set cell content to input value
        }

        const saveBtn = recordRow.querySelector('.save-btn');
        saveBtn.classList.remove('save-btn');
        saveBtn.classList.add('edit-btn'); // Updated to edit-btn class after saving
    }

    // DELETE RECORD
    function deleteStudentRecord(recordRow) {
        const records = JSON.parse(localStorage.getItem('SRecords')) || [];
        const rowIndex = recordRow.rowIndex - 1; // Adjust for header row
        records.splice(rowIndex, 1);
        localStorage.setItem('SRecords', JSON.stringify(records));
        recordRow.remove();
    }

    // Save record to local storage function
    async function saveRecordToLocalStorage(record) {
        const records = JSON.parse(localStorage.getItem('SRecords')) || [];
        records.push(record);
        localStorage.setItem('SRecords', JSON.stringify(records));
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
});
