/* eslint-disable react/prop-types,no-unused-vars */
import React from 'react'
import './App.css'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
const API_URL = 'http://dradge.xyz:3500/api'

const App = () => {
  const [categories, setCategories] = React.useState([])
  const [questions, setQuestions] = React.useState([])
  const [questionCategory, setQuestionCategory] = React.useState(0)

  const fetchCategories = () => fetch(`${API_URL}/categories`)
    .then(res => res.json())
    .then(setCategories)
    .catch(console.log)

  const fetchQuestions = () => fetch(`${API_URL}/questions`)
    .then(res => res.json())
    .then(setQuestions)
    .catch(console.log)

  React.useEffect(() => {
    fetchCategories()
    fetchQuestions()
  }, [])

  return (
    <div id='app'>
      <h1 id='page-title'>TipTabToe</h1>
      <AddCategoryForm
        categories={categories}
        setCategories={setCategories}
      />
      <AddQuestionForm
        categories={categories}
        questions={questions}
        setQuestions={setQuestions}
      />

      <div>
        <h2>Categories</h2>
        {categories.map((c, i) =>
          <div key={i}>
            {c.name}
            <IconButton
              onClick={() =>
                fetch(`${API_URL}/categories/${c.id}`, { method: 'delete' })
                  .then(() => setCategories(categories.filter(cat => c.id !== cat.id)))
              }
            ><DeleteIcon/></IconButton>
          </div>)}
      </div>
      <div>
        <h2>Questions</h2>
        <InputLabel id='question-category-selection-label'>Category</InputLabel>
        <Select
          labelId='category-selection-label'
          id='category-selection'
          onChange={(e) => {
            console.log('setting category to:', e.target.value)
            setQuestionCategory(e.target.value)
          }}
          value={questionCategory}
          fullWidth={true}
          placeholder='Select category'
        >
          <MenuItem value={0}>All</MenuItem>
          {categories.map((c, i) =>
            <MenuItem key={i} value={c.id}>{c.name}</MenuItem>
          )}
        </Select>
        {questionCategory === 0
          ? questions
              .map((q, i) => <Question key={i} question={q} questions={questions} setQuestions={setQuestions}/>)
          : questions
            .filter(q => q.category.id === questionCategory)
            .map((q, i) => <Question key={i} question={q} questions={questions} setQuestions={setQuestions}/>)
        }
      </div>
    </div>
  )
}

const Question = ({ question, questions, setQuestions }) =>
  <div className='question'>
    <IconButton
      onClick={() =>
        fetch(`${API_URL}/questions/${question.id}`, { method: 'delete' })
          .then(() => setQuestions(questions.filter(q => q.id !== question.id)))
      }
    ><DeleteIcon/></IconButton>
    <h3>{question.question}</h3>

    <p><b>Category:</b></p>
    {question.category.name}
    <p><b>Correct answer:</b></p>
    <p>{question.correctAnswer}</p>
    <p><b>Wrong answers:</b></p>
    <ul>
      {question.answers
        .filter(a => a !== question.correctAnswer)
        .map((a, i) => <li key={i}>{a}</li>)
      }
    </ul>
  </div>

const AddCategoryForm = ({ categories, setCategories }) => {
  const [categoryName, setCategoryName] = React.useState('')

  return (
    <div id='add-category' className='input-box'>
      <h2 className='header'>Add category</h2>
      <TextField
        id='add-category-field'
        label='New category name'
        value={categoryName}
        onChange={e => setCategoryName(e.target.value)}
        fullWidth={true}
        variant='outlined'
      />
      <br/>
      <Button
        className='send-button'
        color='secondary'
        variant='contained'
        onClick={() => {
          console.log(categoryName)
          fetch(
            `${API_URL}/categories`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name: categoryName })
            }
          )
            .then(res => res.json())
            .then(json => setCategories(categories.concat(json)))
            .then(() => setCategoryName(''))
            .catch(console.log)
        }}
      >
        Add Category
      </Button>
    </div>
  )
}

const AddQuestionForm = ({ categories, questions, setQuestions }) => {
  const [question, setQuestion] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [correctAnswer, setCorrectAnswer] = React.useState('')
  const [answer2, setAnswer2] = React.useState('')
  const [answer3, setAnswer3] = React.useState('')
  const [answer4, setAnswer4] = React.useState('')

  const clearFields = () => {
    setQuestion('')
    setCorrectAnswer('')
    setAnswer2('')
    setAnswer3('')
    setAnswer4('')
  }

  return (
    <div id='addQuestion' className='input-box'>
      <h2 className='header'>Add question</h2>
      <InputLabel id='category-selection-label'>Category</InputLabel>
      <Select
        labelId='category-selection-label'
        id='category-selection'
        onChange={(e) => {
          console.log('setting category to:', e.target.value)
          setCategory(e.target.value)
        }}
        value={category}
        fullWidth={true}
        placeholder='Select category'
      >
        {categories.map((c, i) =>
          <MenuItem key={i} value={c}>{c.name}</MenuItem>
        )}
      </Select>
      <TextField
        id='question-field'
        label='Question'
        value={question}
        onChange={e => setQuestion(e.target.value)}
        fullWidth={true}
        variant='outlined'
      />
      <TextField
        id='correct-answer-field'
        label='Correct answer'
        value={correctAnswer}
        onChange={e => setCorrectAnswer(e.target.value)}
        fullWidth={true}
        variant='outlined'
      />
      <TextField
        id='answer-field-2'
        label='Answer 2'
        value={answer2}
        onChange={e => setAnswer2(e.target.value)}
        fullWidth={true}
        variant='outlined'
      />
      <TextField
        id='answer-field-3'
        label='Answer 3'
        value={answer3}
        onChange={e => setAnswer3(e.target.value)}
        fullWidth={true}
        variant='outlined'
      />
      <TextField
        id='answer-field-4'
        label='Answer 4'
        value={answer4}
        onChange={e => setAnswer4(e.target.value)}
        fullWidth={true}
        variant='outlined'
      />
      <Button
        color='secondary'
        variant='contained'
        className='send-button'
        onClick={() => {
          const newQuestion =
            {
              question,
              correctAnswer,
              category,
              answers: [correctAnswer, answer2, answer3, answer4]
            }
          console.log(newQuestion)
          fetch(
            `${API_URL}/questions`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newQuestion)
            })
            .then(res => res.json())
            .then(json => setQuestions(questions.concat(json)))
            .then(clearFields)
            .catch(console.log)
        }}
      >
        Add Question
      </Button>
      {/*
      <fieldset>
        <legend>Add new question</legend>
        <label htmlFor='cat'>Category:</label><br/>
        <select id='cat' name='cat'>
          {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
        </select><br/>
        <label htmlFor='q'>Question:</label><br/>
        <input type='text' name='q' id='q'/><br/>
        <label htmlFor='ca'>Correct answer:</label><br/>
        <input type='text' name='ca' id='ca'/><br/>
        <label htmlFor='wa1'>Wrong answers:</label><br/>
        <input type='text' name='wa1' id='wa1'/><br/>
        <input type='text' name='wa2' id='wa2'/><br/>
        <input type='text' name='wa3' id='wa3'/><br/>
        <input type='submit'/>
      </fieldset>
      */}
    </div>
  )
}
export default App
