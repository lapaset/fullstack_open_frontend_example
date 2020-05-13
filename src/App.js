import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import noteService from './services/notes'


const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
    console.log('user set at refresh', loggedUserJSON)
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(updatedNote => {
        setNotes(notes.map(note => note.id !== id ? note : updatedNote))
      })
      .catch(() => {
        setErrorMessage(`The note '${note.content}' was already deleted from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = noteObject => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(createdNote => {
        setNotes(notes.concat(createdNote))
      })
      .catch(exception => {
        console.log(exception)
      })
  }

  const login = async userObject => {

    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        login={login}
      />
    </Togglable>
  )

  const noteFormRef = React.createRef()

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm
        createNote={addNote}
      />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      { user === null
        ? loginForm()
        : <div>
          <p>{user.name} logged in</p>
          <button onClick={logout}>logout</button>
          {noteForm()}
        </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
            show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>

      <Footer />
    </div>
  )
}

export default App