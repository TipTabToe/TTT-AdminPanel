/* eslint-disable react/prop-types,no-unused-vars */
import React from 'react'
import './App.css'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Snackbar,
  Tooltip
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'

const ICON_COLOR = 'default'

const API_URL = 'http://localhost:8080/api'
// const API_URL = 'http://ttt-backend.eu-central-1.elasticbeanstalk.com/api'

const App = () => {
  const [categories, setCategories] = React.useState([])
  const [questions, setQuestions] = React.useState([])
  const [questionCategory, setQuestionCategory] = React.useState(0)
  const [snackbarState, setSnackbarState] = React.useState({ open: false, msg: '' })

  const state =
    {
      categories,
      setCategories,
      questions,
      setQuestions,
      questionCategory,
      setQuestionCategory,
      setSnackbarState
    }

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
        state={state}
      />
      <AddQuestionForm
        state={state}
      />
      <Categories
        state={state}
      />
      <Questions
        state={state}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackbarState.open}
        message={snackbarState.msg}
        onClose={() => setSnackbarState({ msg: '', open: false })}
        TransitionComponent={Slide}
        autoHideDuration={5000}
        action={
          <IconButton color='secondary' size='small' aria-label='close'
                      onClick={() => setSnackbarState({ open: false, msg: '' })}>
            <CloseIcon fontsize='small'/>
          </IconButton>
        }
      />
    </div>
  )
}

const Questions = ({ state }) => {
  const {
    questions,
    categories,
    questionCategory,
    setQuestionCategory
  } = state
  return (
    <div id='questions'>
      <h2 className='header'>Questions</h2>
      <div id='question-category-selector'>
        <InputLabel id='question-category-selection-label'>Category</InputLabel>
        <Select
          labelId='category-selection-label'
          id='category-selection'
          onChange={(e) =>
            setQuestionCategory(e.target.value)}
          value={questionCategory}
          fullWidth={true}
          placeholder='Select category'>

          <MenuItem value={0}>All</MenuItem>

          {categories.map((c, i) =>
            <MenuItem key={i} value={c.id}>{c.name}</MenuItem>
          )}
        </Select>
      </div>
      {
        questionCategory === 0
          ? questions
              .map((q, i) =>
              <Question
                key={i}
                question={q}
                state={state}/>
              )
          : questions
            .filter(q => q.category.id === questionCategory)
            .map((q, i) =>
              <Question
                key={i}
                question={q}
                state={state}/>
            )
      }
    </div>
  )
}

const Categories = ({ state }) =>
  <div id='categories'>
    <h2 className='header'>Categories</h2>
    {state.categories.map((c, i) =>
      <Category key={i} category={c} state={state}/>)}
  </div>

const Category = ({ state, category }) =>
  <div className='category'>
    <div className='icons'>
      <DeleteCategoryButton
        category={category}
        state={state}
      />
      <EditCategoryButton
        category={category}
        state={state}
      />
      <br/>
    </div>
    <h3 className='sub-header'>{category.name}</h3>
  </div>

const DeleteCategoryButton = ({ category, state }) => {
  const { categories, setCategories, questions, setSnackbarState } = state
  const [open, setOpen] = React.useState(false)

  const deleteCategory = () => fetch(
    `${API_URL}/categories/${category.id}`,
    { method: 'delete' })
    .then(setCategories(categories.filter(cat => cat.id !== category.id)))
    .then(setSnackbarState({ open: true, msg: 'Category deleted.' }))
    .catch(console.log)

  const closeDialog = () => setOpen(false)

  return (
    <>
      <Tooltip title={'Delete category'}>
        <IconButton
          variant='contained'
          color={ICON_COLOR}
          onClick={() => {
            if (questions.filter(q => q.category.id === category.id).length === 0) {
              setOpen(true)
            } else {
              setSnackbarState({ msg: 'Error! There are some questions left in this category.', open: true })
            }
          }}
        >
          <DeleteIcon/>
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={closeDialog}
      >
        <DialogTitle>{`Delete category "${category.name}"?`}</DialogTitle>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            onClick={closeDialog}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={deleteCategory}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const DeleteQuestionButton = ({ state, question }) => {
  const { questions, setQuestions, setSnackbarState } = state
  const [open, setOpen] = React.useState(false)

  const deleteQuestion = () => fetch(
    `${API_URL}/questions/${question.id}`,
    { method: 'delete' })
    .then(setQuestions(questions.filter(q => q.id !== question.id)))
    .then(setSnackbarState({ open: true, msg: 'Question deleted.' }))
    .catch(console.log)

  const closeDialog = () => setOpen(false)

  return (
    <>
      <Tooltip title={'Delete question'}>
        <IconButton
          variant='contained'
          color={ICON_COLOR}
          onClick={() => setOpen(true)}
        >
          <DeleteIcon/>
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={closeDialog}
      >
        <DialogTitle>{`Delete question "${question.question}"?`}</DialogTitle>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            onClick={closeDialog}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={deleteQuestion}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const EditCategoryButton = (props) => {
  const { categories, setCategories, questions, setQuestions, setSnackbarState } = props.state
  const [category, setCategory] = React.useState(props.category.name)
  const [open, setOpen] = React.useState(false)

  const updateCategory = () => fetch(
    `${API_URL}/categories/${props.category.id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: category
      })
    })
    .then(res => res.json())
    .then(json => {
      setCategories(categories.map(c =>
        c.id === props.category.id
          ? json
          : c))
      return json
    })
    .then(json => setQuestions(questions.map(q => {
      if (q.category.id === json.id) {
        q.category = json
      }
      return q
    })))
    .then(closeDialog)
    .then(setSnackbarState({ open: true, msg: `Category renamed to ${category}.` }))
    .catch(console.log)

  const closeDialog = () => setOpen(false)

  return (
    <>
      <Tooltip title={'Edit category'}>
        <IconButton
          className='edit-button'
          variant='contained'
          color={ICON_COLOR}
          onClick={() => setOpen(true)}
        >
          <EditIcon/>
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={closeDialog}>

        <DialogTitle>{'Edit question'}</DialogTitle>
        <DialogContent className='edit-question-content'>

          <TextField
            id='edit-answer-field-4'
            label='Answer 4'
            value={category}
            onChange={e => setCategory(e.target.value)}
            fullWidth={true}
            variant='outlined'
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            onClick={closeDialog}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={updateCategory}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const EditQuestionButton = (props) => {
  const { questions, setQuestions, categories, setSnackbarState } = props.state
  const [open, setOpen] = React.useState(false)
  const [question, setQuestion] = React.useState(props.question.question)
  const [correctAnswer, setCorrectAnswer] = React.useState(props.question.correctAnswer)
  const [answer2, setAnswer2] = React.useState(props.question.answers[1])
  const [answer3, setAnswer3] = React.useState(props.question.answers[2])
  const [answer4, setAnswer4] = React.useState(props.question.answers[3])
  const [category, setCategory] = React.useState(categories.find(c => c.id === props.question.category.id))

  const updateQuestion = () => fetch(
    `${API_URL}/questions/${props.question.id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        category,
        correctAnswer,
        answers: [correctAnswer, answer2, answer3, answer4]
      })
    }
  )
    .then(res => res.json())
    .then(json => setQuestions(questions.map(q => q.id === props.question.id ? json : q)))
    .then(closeDialog)
    .then(setSnackbarState({ open: true, msg: 'Question updated.' }))
    .catch(console.log)

  const closeDialog = () => setOpen(false)

  return (
    <>
      <Tooltip title={'Edit question'}>
        <IconButton
          className='edit-button'
          variant='contained'
          color={ICON_COLOR}
          onClick={() => setOpen(true)}
        >
          <EditIcon/>
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={closeDialog}
        className='edit-question-dialog'
      >
        <DialogTitle>{'Edit question'}</DialogTitle>
        <DialogContent className='edit-question-content'>
          <InputLabel id='category-selection-label'>Category</InputLabel>
          <Select
            labelId='category-selection-label'
            id='edit-category-selection'
            onChange={(e) => {
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
            id='edit-question-field'
            label='Question'
            value={question}
            onChange={e => setQuestion(e.target.value)}
            fullWidth={true}
            variant='outlined'
          />
          <TextField
            id='edit-correct-answer-field'
            label='Correct answer'
            value={correctAnswer}
            onChange={e => setCorrectAnswer(e.target.value)}
            fullWidth={true}
            variant='outlined'
          />
          <TextField
            id='edit-answer-field-2'
            label='Answer 2'
            value={answer2}
            onChange={e => setAnswer2(e.target.value)}
            fullWidth={true}
            variant='outlined'
          />
          <TextField
            id='edit-answer-field-3'
            label='Answer 3'
            value={answer3}
            onChange={e => setAnswer3(e.target.value)}
            fullWidth={true}
            variant='outlined'
          />
          <TextField
            id='edit-answer-field-4'
            label='Answer 4'
            value={answer4}
            onChange={e => setAnswer4(e.target.value)}
            fullWidth={true}
            variant='outlined'
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            onClick={closeDialog}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={updateQuestion}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const Question = ({ question, state }) => (
  <div className='question'>
    <DeleteQuestionButton question={question} state={state} />
    <EditQuestionButton question={question} state={state} />
    <h3 className='sub-header'>{question.question}</h3>

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
)

const AddCategoryForm = ({ state }) => {
  const { categories, setCategories, setSnackbarState } = state
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
        color={ICON_COLOR}
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
            .then(setSnackbarState({ open: true, msg: 'Category added.' }))
            .catch(console.log)
        }}
      >
        Add Category
      </Button>
    </div>
  )
}

const AddQuestionForm = ({ state }) => {
  const { categories, questions, setQuestions, setSnackbarState } = state
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
        color={ICON_COLOR}
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
            .then(setSnackbarState({ open: true, msg: 'Question added.' }))
            .catch(console.log)
        }}
      >
        Add Question
      </Button>
    </div>
  )
}
export default App
