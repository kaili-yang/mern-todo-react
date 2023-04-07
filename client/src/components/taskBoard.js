import React, { useEffect, useState, useRef } from "react";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@mui/material/Grid';
import {
  alpha,
  withStyles,
} from '@material-ui/core/styles';
import '../index.css'

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function TaskList() {
  const [taskList, setTaskList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [newTodo, setNewTodo] = useState('Add new Task');
  const [searchTodo, setsearchTodo] = useState('Search new Task');
  const [open, setOpen] = React.useState(false);
  const [todoCheckedState, setTodoCheckedState] = useState(
    new Array(todoList.length).fill(false)
  );
  const [doneCheckedState] = useState(
    new Array(doneList.length).fill(false)
  );
  const classes = useStyles();
  const inputRef = useRef(null);

  // This method fetches the tasks from the database.
  useEffect(() => {
    getTasks()
  }, []);

  const getTasks = () => {
    fetch(`http://localhost:5000/api/task`)
      .then(response => response.json())
      .then(data => {
        handleTaskList(data.data)
      });
  }

  const handleTaskList = (data) => {
    if ( data == null || data.length === 0) {
      setTaskList([]);
      setTodoList([]);
      setDoneList([]);
      return
    } 
    setTaskList(data);
    const todoFilter = data.filter(item => item.status === 0)
    if (!todoFilter || todoFilter.length === 0) {
      setTodoList([]);
    } else {
      setTodoList(todoFilter.sort((a, b) => a.content.localeCompare(b.content)))
    }
    const doneFilter = data.filter(item => item.status === 1)
    if (!doneFilter || doneFilter.length === 0) {
      setDoneList([]);
    } else {
      setDoneList(doneFilter.sort((a, b) => a.content.localeCompare(b.content)).slice(0, 10));
    }
  }

  const handleCheckboxChange = (position, item, tag) => {
    if (tag === 'todo') {
      const updatedCheckedState = todoCheckedState.map((item, index) =>
        index === position ? !item : item
      );
      setTodoCheckedState(updatedCheckedState);
    } 
    const params = { ...item, status: item.status === 0 ? 1 : 0 };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    fetch(`http://localhost:5000/api/task/update`, requestOptions)
      .then(response => response.json())
      .then(todoData => {
        getTasks();
      });
  };

  const handleAddTodoClick = () => {
    let inputValue = newTodo.trim();
    if(inputValue.length === 0) return
    const newTodoObj = { content: inputValue, status: 0, description: "" };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodoObj)
    };
    fetch(`http://localhost:5000/api/task/add`, requestOptions)
      .then(response => response.json()).then(todoData => {
        getTasks()
        setNewTodo('')
      });
  }
  const handleSearchTodoClick = () => {
    // if(searchTodo.length === 0) return
    const requestOptions = {
      method: 'GET',
    };
    fetch(`http://localhost:5000/api/task?content=${searchTodo}`, requestOptions)
      .then(response => response.json()).then(todoData => {
        handleTaskList(todoData.data)
      });
  }
  
  const handlClick = (e) => {
    setNewTodo(e.target.value);
  }

  const searchClick = (e) => {
    setsearchTodo(e.target.value);
  }

  const handleDeleteAll = () => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch(`http://localhost:5000/api/task/delete`, requestOptions)
      .then(response => response.json()).then(todoData => {
        handleClose()
        getTasks()
      });
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the form from submitting
      handleAddTodoClick();
    }
  };

  const handleKeyDownDelete = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the form from submitting
      handleSearchTodoClick();
    }
  };


  
  return (
    <div>
      <div className="delete-box">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={handleClickOpen}
          className="right"
        >
          Delete All
        </Button>
      </div>
 
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className={classes.margin}>
            <BootstrapInput value={newTodo} onChange={handlClick} ref={inputRef} onKeyDown={handleKeyDown} id="bootstrap-input" />
            <span className="btn">
              <Button onClick={handleAddTodoClick} variant="contained" color="primary">Create</Button>
              </span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.margin}>
            <BootstrapInput value={searchTodo} onChange={searchClick} ref={inputRef} onKeyDown={handleKeyDownDelete} id="bootstrap-input" />
            <span className="btn"><Button onClick={handleSearchTodoClick} onKeyUp={handleSearchTodoClick}  variant="contained" color="primary" >Search</Button></span>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h2>Todo</h2>
            {todoList.map((item, index) => (
              <div key={item._id}>
                {todoCheckedState}
                <label>
                  <input
                    type="checkbox"
                    id="`todo-${index}`"
                    value="{item.content}"
                    checked={todoCheckedState[index]}
                    onChange={() => handleCheckboxChange(index, item, 'todo')}
                  />
                  {item.content}
                </label>
              </div>
            ))}
        </Grid>
        <Grid item xs={6}>
          <h2>Done</h2>
          {doneList.map((item, index) => (
            <div key={item._id}>
              <label>
                <input
                  type="checkbox"
                  checked={doneCheckedState[index]}
                  onChange={() => handleCheckboxChange(index, item, 'done')}
                />
                {item.content}
              </label>
            </div>
          ))}
        </Grid>
      </Grid>
      

      

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will delete all the tasks.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleDeleteAll} color="primary" autoFocus>
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}
