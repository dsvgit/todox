import { render } from "./framework.js";
import { TodoInput } from "./components/todo-input.js";
import { TodoFilter } from "./components/todo-filter.js";
import { TodoList } from "./components/todo-list.js";
import { state } from "./state.js";
import { Version } from "./components/version.js";
import { ThemeSwitch } from "./components/theme-switch.js";

const App = () => {
  const { todos, $filter, onAdd, onRemove, onEdit, onFilter, onCheck } =
    state();

  return render`
    <div class="container p-4" style="max-width: 500px;">
      <div class="vstack gap-3">
        <header class="vstack">
          <div class="hstack justify-content-between">
            <h1 class="mb-0">📋 Todox</h1>
            ${ThemeSwitch()}
          </div>
          <div>
            ${Version()}
          </div>
        </header>
        ${TodoFilter({ $filter, onFilter })}
        ${TodoInput({ onAdd })}
        ${TodoList({ todos, onRemove, onEdit, onCheck })}
      </div>
    </div>
  `;
};

document.querySelector("#root").replaceChildren(...App());
