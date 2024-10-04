import React, { useContext, useEffect } from 'react';
import noteContext from '../context/notes/noteContext';

const About = () => {

    // const a = useContext(noteContext)
    // useEffect(() => {
    //     a.update();
    // }, [])

    return (
        <div>
            {/* Just for explaination */}
            {/* This is about!{a.state.name} and he is in class {a.state.class} */}
            This is about page
        </div>
    );
}

export default About;
