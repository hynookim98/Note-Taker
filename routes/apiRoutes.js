const router = require('express').Router();
const store = require('../db/store');

// route to get all notes from database
router.get('/notes', (req, res) => {
    store.getNotes()
        .then((notes) => {
            return res.json(notes);
        })
        .catch((error) => res.status(500).json(error));
});

// route to add notes to database
router.post('/notes', (req, res) => {
    store.addNote(req.body)
        .then((note) => res.json(note))
        .catch((error) => res.status(500).json(error));
});

// route to delete notes from database
router.delete('/notes/:id', (req, res) => {
    store.removeNote(req.params.id)
        .then(() => res.json({ ok: true }))
        .catch((error) => res.status(500).json(error));
});

module.exports = router;