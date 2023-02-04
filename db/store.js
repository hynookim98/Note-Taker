const { promisify } = require('util');
const fs = require('fs');
const uuid = require('uuid/v1');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class NoteStorage {
  async getAll() {
    try {
      const data = await readFile('db/db.json', 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async add(note) {
    const { title, text } = note;
    if (!title || !text) {
      throw new Error('Note title and text cannot be blank.');
    }

    const newNote = { title, text, id: uuid() };
    const allNotes = await this.getAll();
    const updatedNotes = [...allNotes, newNote];
    await writeFile('db/db.json', JSON.stringify(updatedNotes));
    return newNote;
  }

  async remove(id) {
    const allNotes = await this.getAll();
    const filteredNotes = allNotes.filter(n => n.id !== id);
    await writeFile('db/db.json', JSON.stringify(filteredNotes));
  }
}

module.exports = new NoteStorage();