const util = require('util');
const fs = require('fs');
// new package to generate unique IDs
const uuidv1 = require('uuid/v1');

const readFileSync = util.promisify(fs.readFile);
const writeFileSync = util.promisify(fs.writeFile);

class Store {
    read() {
        return readFileSync('db/db.json', 'utf8');
    }

    write(note) {
        return writeFileSync('db/db.json', JSON.stringify(note));
    }

    getNotes() {
        return this.read().then((notes) => {
            let savedNotes;
            
            // try to turn saved notes into array 
            try{
                savedNotes = [].concat(JSON.parse(notes));
            } catch(err) {
                // if it can not be done then just return and empty array
                savedNotes = [];
            }

            return savedNotes;
        });
    }

    addNote(note) {
        const { title, text } = note;
        // following code will run if a title or text is not added
        if (!title || !text) {
            throw new Error("Note 'title' and 'text' cannot be blank")
        }

        // using the new npm package we add a unique ID to each note
        const newNote = { title, text, id: uuidv1() };

        return this.getNotes()
            .then((notes) => [...notes, newNote])
            .then((updatedNotes) => this.write(updatedNotes))
            .then(() => newNote);
    }

    removeNote(id) {
        return this.getNotes()
            .then((notes) => notes.filter((note) => note.id !== id))
            .then((filteredNotes) => this.write(filteredNotes));
    }
}

module.exports = new Store();
