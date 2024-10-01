"use client";

import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { saveAs } from "file-saver";

interface Todo {
  id: number;
  bg: string;
  content: string[];
}

export default function Home() {
  const res = localStorage.getItem("todos");
  const localData = res ? JSON.parse(res) : [];
  const [todos, setTodos] = useState<Todo[]>(localData);
  const [show, setShow] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const colors = ["green", "red", "blue"];

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ) => {
    const { value } = e.target;
    setInputValues((prev) => ({ ...prev, [todoId]: value }));
  };

  const handleSubmit = (todoId: number) => {
    const task = inputValues[todoId];
    if (!task || task.trim() === "") {
      alert("Enter a task");
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, content: [...todo.content, task] }
          : todo
      )
    );

    setInputValues((prev) => ({ ...prev, [todoId]: "" }));
  };

  const handleDeleteTask = (todoId: number, taskIndex: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              content: todo.content.filter((_, index) => index !== taskIndex),
            }
          : todo
      )
    );
  };

  const downloadData = (data: any[]) => {
    if (data.length !== 0) {
      const resArr = JSON.stringify(data);
      const blob = new Blob([resArr], { type: "text/plain" });
      saveAs(blob, "data.txt");
    } else {
      alert("no todos to download");
    }
  };

  const handleDeleteTodo = (index: number) => {
    const filteredData = todos.filter((_, i) => i !== index);
    setTodos(filteredData);
  };

  return (
    <div>
      <div className="w-full flex items-end justify-center flex-col gap-2">
        <button
          className="bg-black p-4 rounded-xl text-white"
          onClick={() => {
            downloadData(todos);
          }}
        >
          download whole todos
        </button>

        <button
          className="bg-black p-4 rounded-full text-white"
          onClick={() => setShow(!show)}
        >
          +
        </button>

        {show &&
          colors.map((color, index) => (
            <div
              key={index}
              style={{ backgroundColor: color }}
              className="w-[40px] h-[40px] rounded-full cursor-pointer"
              onClick={() => {
                const newTodo: Todo = {
                  id: todos.length
                    ? Math.max(...todos.map((todo) => todo.id)) + 1
                    : 1,
                  bg: color,
                  content: [],
                };

                setTodos((prev) => [...prev, newTodo]);
                setInputValues((prev) => ({ ...prev, [newTodo.id]: "" }));
              }}
            />
          ))}
      </div>

      <Reorder.Group
        axis="y"
        values={todos}
        onReorder={setTodos}
        className="w-full flex-col flex items-center justify-center"
      >
        {todos &&
          todos.length > 0 &&
          todos.map((todo, index) => (
            <Reorder.Item
              key={todo.id}
              style={{ backgroundColor: todo.bg }}
              className="p-2 flex flex-col gap-3 w-[70%]"
              value={todo}
            >
              <input
                type="text"
                placeholder="Enter task"
                value={inputValues[todo.id] || ""}
                onChange={(e) => handleChange(e, todo.id)}
                className="p-4"
              />
              <button
                className="bg-black text-white rounded-xl p-4"
                onClick={() => handleSubmit(todo.id)}
              >
                Add task
              </button>

              <div className="flex w-full items-center justify-around">
                <button
                  className="text-white bg-black rounded-xl p-4"
                  onClick={() => {
                    downloadData(todo.content);
                  }}
                >
                  download todo
                </button>
                <button
                  className="text-white bg-black rounded-xl p-4"
                  onClick={() => handleDeleteTodo(index)}
                >
                  delete todo
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {todo.content.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="bg-black text-white w-[30%] flex items-center justify-between p-2 mt-2"
                  >
                    <input type="checkbox" />
                    <span>{task}</span>
                    <button
                      onClick={() => handleDeleteTask(todo.id, taskIndex)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </Reorder.Item>
          ))}
      </Reorder.Group>
    </div>
  );
}
