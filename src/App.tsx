import { useState, useEffect, useCallback } from "react";

type Task = {
  completed: boolean;
  id: string;
  title: string;
};

function Tasks() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  function onSaveTask() {
    if (!input.trim()) {
      return alert("Voce precisa digitar algo!!!!");
    }

    setTasks([
      ...tasks,
      { completed: false, id: crypto.randomUUID(), title: input },
    ]);

    setInput("");
  }

  function completeTask({ id }: Task) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      })
    );
  }

  function remove({ id }: Task) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <h2 className="text-xl font-bold uppercase tracking-tighter">
          TODO LIST
        </h2>

        <div className=" p-6 w-full flex flex-col gap-6 rounded-xl bg-blue-950">
          <input
            className="flex-1 bg-transparent border-2   p-2 outline-none text-white placeholder:text-gray-500"
            type="text"
            placeholder="Digite uma tarefa..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />

          <button
            className="border-3 rounded-full border-blue-900 px-4 py-2 hover:bg-white hover:text-black transition-all"
            onClick={onSaveTask}
          >
            Save
          </button>

          <ul className="flex flex-col gap-4">
            {tasks.map((task) => {
              return (
                <li
                  key={task.id}
                  className={`rounded-xl   p-2 flex items-center gap-4 justify-between ${task.completed ? "bg-green-500 " : "bg-blue-900"}`}
                >
                  <button
                    onClick={() => completeTask(task)}
                    className={`border-2 rounded-full px-2 py-2 text-xs font-bold ${
                      task.completed 
                        ? "bg-green-700"
                        : ""
                    }`}
                  >
                    OK
                  </button>

                  <span
                    className={
                     
                      "text-black"
                     }
                  >
                    {task.title}
                  </span>

                  <button
                    className="border-2 px-3 py-1  rounded-lg text-xs font-bold bg-red-700 hover:bg-red-900"
                    onClick={() => remove(task)}
                  >
                    Remover
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default function Pomodoro() {
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  const tick = useCallback(() => {
    setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isActive && seconds > 0) {
      timer = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, seconds, tick]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const displayTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;

 
  function pomodoroTime() {
    setIsActive(false);
    setSeconds(1500);
  }

  
  function shortBreak() {
    setIsActive(false);
    setSeconds(600);
  }


  function longBreak() {
    setIsActive(false);
    setSeconds(900);
  }

  const [mode, setMode] = useState("pomodoro");

  



  return (
    <div className="bg-slate-900 min-h-screen w-full text-white flex flex-col items-center py-10 gap-12">
      <div className="flex flex-col items-center gap-6 px-10 py-10 rounded-xl bg-blue-950">

        <h1 className="text-2xl font-bold uppercase tracking-widest">
          Pomodoro
        </h1>

      
        <div className="flex gap-4">
          <button
            className={`border px-5 py-2  rounded-full  transition-all ${mode === "pomodoro"  ? "bg-green-400 text-black" : "hover:bg-green-400  shadow-lg hover:text-black"}`}
            onClick={()=>{
              setMode("pomodoro");
              pomodoroTime()
            }}
          >
            Pomodoro
          </button>

          <button
            className={`border px-4 py-2  rounded-full transition-all ${mode=== "short" ? "bg-blue-400 text-black" : "hover:bg-blue-400  shadow-lg hover:text-black"}`}
            onClick={()=>{
              setMode("short");
              shortBreak()}}
          >
            Pausa Curta
          </button>

          <button
            className={`border px-4 py-2 rounded-full transition-full ${mode === "long" ? "bg-sky-400 text-black" : "hover:bg-sky-400  shadow-lg hover:text-black "} `}
            onClick={()=>{
              setMode("long");
              longBreak()}}
          >
            Pausa Longa
          </button>
        </div>

        
        <div className="border-4 border-white w-64 h-40 flex items-center justify-center rounded">
          <span className="text-5xl font-mono">{displayTime}</span>
        </div>

        
        <div className="flex gap-4">
          <button
            className="border-blue-900 rounded-full bg-blue-700 px-5 py-3 hover:bg-blue-600"
            onClick={() => setIsActive(true)}
          >
            Iniciar
          </button>

          <button
            className=" border-blue-900  rounded-full bg-red-700 px-5 py-3 hover:bg-red-600"
            onClick={() => setIsActive(false)}
          >
            Pausar
          </button>

          <button
            className="border-blue-900 rounded-full bg-gray-700 px-5 py-3 hover:bg-gray-600"
            onClick={() => {
              setIsActive(false);
              setSeconds(1500);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <Tasks />
    </div>
  );
}