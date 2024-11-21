import { computed, persistentSignal, signal } from "./framework.js";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";

const makeYMap = (item) => {
  const yTodo = new Y.Map();
  Object.entries(item).map((kv) => yTodo.set(...kv));
  return yTodo;
};

export const state = () => {
  const roomName = "todox-room";

  const ydoc = new Y.Doc();
  const provider = new WebrtcProvider(roomName, ydoc);
  const persistence = new IndexeddbPersistence(roomName, ydoc);

  const yTodos = ydoc.getArray("todos");

  persistence.once("synced", () => {
    if (yTodos.length === 0) {
      const yTodoArray = defaultTodos.map((todo) => makeYMap(todo));
      yTodos.insert(0, yTodoArray);
    }
  });

  const $filter = persistentSignal("filter", "all");
  const $todos = signal([]);

  yTodos.observe(() => {
    $todos.value = yTodos.toArray();
  });

  const $filteredTodos = computed(() => {
    const filter = $filter.value;
    const todos = $todos.value;

    return filter === "active"
      ? todos.filter((yTodo) => !yTodo.get("checked"))
      : filter === "completed"
      ? todos.filter((yTodo) => yTodo.get("checked"))
      : todos;
  });

  const onAdd = (text) => {
    const yTodo = makeYMap({ text, checked: false });
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
    $todos: $filteredTodos,
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
