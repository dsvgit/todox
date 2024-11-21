import { For, render } from "../framework.js";
import { TodoItem } from "./todo-item.js";

export const TodoList = ({ $todos, onRemove, onEdit, onCheck }) => {
  return For({
    $list: $todos,
    component: render`<ul class="list-group"></ul>`,
    children: (yTodo) => {
      return TodoItem({ yTodo, onRemove, onEdit, onCheck });
    },
  });
};
