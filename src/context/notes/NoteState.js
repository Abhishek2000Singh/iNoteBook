import React, { useState } from 'react';
import NoteContext from './noteContext';

const NoteState = (props) => {
    //Just for the purpose of the explaination
    // const s1 = {
    //     "name": "harshit",
    //     "class": "12a"
    // }

    // const [state, setState] = useState(s1)

    // const update = () => {
    //     setTimeout(() => {
    //         setState({
    //             "name": "Abhishek",
    //             "class": "10th"
    //         })
    //     }, 1000);
    // }

    const notesInitial = [
        {
            "_id": "66fd2a24ba0f7a220bdaa5a4",
            "user": "66fc6c940fea752b949cc97a",
            "title": "My title",
            "description": "Wake up",
            "tag": "personal",
            "date": "1727867428984",
            "__v": 0
        },
        {
            "_id": "66fd61c2ba0f7a220bdaa5a7",
            "user": "66fc6c940fea752b949cc97a",
            "title": "New Note",
            "description": "Please Access the Playlist",
            "tag": "videos",
            "date": "1727881666240",
            "__v": 0
        },
        {
            "_id": "66fd61c2ba0f7a220bdaa5a7",
            "user": "66fc6c940fea752b949cc97a",
            "title": "New Note",
            "description": "Please Access the Playlist",
            "tag": "videos",
            "date": "1727881666240",
            "__v": 0
        },
        {
            "_id": "66fd61c2ba0f7a220bdaa5a7",
            "user": "66fc6c940fea752b949cc97a",
            "title": "New Note",
            "description": "Please Access the Playlist",
            "tag": "videos",
            "date": "1727881666240",
            "__v": 0
        }
    ]  

    const [notes, setNotes] = useState(notesInitial);

    return (
        <NoteContext.Provider value={{notes,setNotes}}>
            {/* Your components here */}
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;