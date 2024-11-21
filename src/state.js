import { persistentSignal } from "./framework.js";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";

export const initWebrtc = () => {
  const ydoc = new Y.Doc();
  const provider = new WebrtcProvider("todox-ydoc", ydoc, {
    password: "optional-room-password",
  });
  const persistence = new IndexeddbPersistence("todox-ydoc", ydoc);
  return [ydoc, persistence];
};

export const state = () => {
  const $filter = persistentSignal("filter", "all");
  const [ydoc, persistence] = initWebrtc();

  const yTodos = ydoc.getArray("todos");

  persistence.once("synced", () => {
    if (yTodos.length === 0) {
      const yTodoArray = defaultTodos.map((todo, index) => {
        const yTodo = new Y.Map();
        Object.entries(todo).map(([name, value]) => {
          yTodo.set(name, value);
        });
        return yTodo;
      });
      yTodos.insert(0, yTodoArray);
    }
  });

  const filteredTodos = () => {
    const filter = $filter.value;
    return yTodos;
    // return filter === "active"
    //   ? yTodos.toArray().filter((todo) => !todo.checked) //todo remove toArray
    //   : filter === "completed"
    //   ? yTodos.toArray().filter((todo) => todo.checked)
    //   : yTodos;
  };

  const onAdd = (text) => {
    const yTodo = new Y.Map();
    yTodo.set("text", text);
    yTodo.set("checked", false);

    yTodos.insert(0, [yTodo]);
  };

  const onEdit = (yTodo, text) => {
    yTodo.set("text", text);
  };

  const onCheck = (yTodo, checked) => {
    yTodo.set("checked", checked);
  };

  const onRemove = (yTodo) => {
    const todos = yTodos.toArray();
    const index = todos.indexOf(yTodo);

    if (index !== -1) {
      yTodos.delete(index);
    }
  };

  const onFilter = (filter) => {
    $filter.value = filter;
  };

  return {
    $filter,
    todos: filteredTodos(),
    onAdd,
    onEdit,
    onCheck,
    onRemove,
    onFilter,
  };
};

const defaultTodos = [
  { text: "🎒 Get your lunch box", checked: true },
  { text: "👝 Get 3 ziploc bags", checked: true },
  {
    text: "🍪 Put 2 cookies in a ziploc bag, then put it in your lunch box",
    checked: false,
  },
  {
    text: "🥨 Put pretzels in a ziploc bag, then put it in your lunch box",
    checked: false,
  },
  { text: "⬜ Put a napkin in your lunch box", checked: false },
  {
    text: `🧈 Make a peanut butter sandwich, put it in your lunch box`,
    checked: false,
  },
  {
    text: `🍼 Pour milk into your drink box, put it in your lunch box`,
    checked: false,
  },
];
