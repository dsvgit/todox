import { render } from "./framework.js";
import { TodoInput } from "./components/todo-input.js";
import { TodoFilter } from "./components/todo-filter.js";
import { TodoList } from "./components/todo-list.js";
import { state } from "./state.js";

const App = () => {
  const { $todos, onAdd, onRemove, onFilter } = state();

  return render`
    <div class="container p-4" style="max-width: 500px;">
      <h1>Todos</h1>
      <div class="vstack gap-3">
        ${TodoFilter({ onFilter })}
        ${TodoInput({ onAdd })}
        ${TodoList({ $todos, onRemove })}
      </div>
    </div>`;
};

document.querySelector("#root").replaceChildren(...App());