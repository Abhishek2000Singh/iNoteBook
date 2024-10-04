const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');


//ROUTE 1 : Get all the notes using: GET "/api/notes/getallnotes". login is required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes)
})




//ROUTE 2 : Add notes using: Post "/api/notes/addnotes". login is required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid Title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    const { title, description, tag } = req.body;

    //if there are error return bad req and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.send(`Hello, ${req.query.person}!`);
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.send(savedNote)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error Occurred")
    }

})

//ROUTE 3 : Update the existing notes using: Post "/api/notes/updatenote". login is required 

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        //Find the node to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error Occurred")
    }
})


//ROUTE 4 : Delete the existing notes using: Post "/api/notes/deletenote". login is required 

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    //we have to verify that the notes belong to person who is deleting the note 
    try {
        //Find the node to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        //Allow deletion if user owns this notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error Occurred")
    }
})



module.exports = router