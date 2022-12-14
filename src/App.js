import React, { useEffect, useRef, useState } from "react";
import Todo from "./components/Todo";
import FilterButton from "./components/FilterButton";
import Form from "./components/Form";
import { nanoid } from "nanoid";
import usePrevious from "./components/usePrevious";

// Each key is the name of a filter, each value is a function that filters
const FILTER_MAP = {
  Tout: () => true, // Show Tout tasks
  Todo: (task) => !task.completed, // Show tasks whose `completed` prop is `false`
  Terminé: (task) => task.completed, // Show tasks whose `completed` prop is `true`
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("Tout");

  function addTask(name) {
    const newTask = {
      id: `todo-${nanoid(5)}`,
      name: name,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        onToggleTaskCompleted={toggleTaskCompleted}
        onDeleteTask={deleteTask}
        onEditTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      onFilter={setFilter}
    />
  ));

  const taskNoun = taskList.length !== 1 ? "taches" : "tache";
  const headingText = taskList.length !== 1 ? `${taskList.length} ${taskNoun} restantes` : `${taskList.length} ${taskNoun} restante`;
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>Todo App 📝</h1>
      <Form onSubmit={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      {/* eslint-disable-next-line */}
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;