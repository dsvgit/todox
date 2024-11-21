import { render } from "../framework.js";

export const TodoItem = ({ todo: yTodo, onRemove, onEdit, onCheck }) => {
  let todo = yTodo.toJSON();
  const id = "id" + Math.random().toString(16).slice(2);
  const handleCheck = (e) => {
    e.preventDefault();
    onCheck(yTodo, e.target.checked);
  };
  const handleEdit = (e) => {
    e.preventDefault();
    onEdit(yTodo, e.target.innerText);
  };
  return render`
    <li class="list-group-item todox-list-group-item-action hstack gap-3 pe-1 align-items-start">
      ${render`
        <input id="${id}" type="checkbox" class="form-check-input" ${
        todo.checked ? "checked" : ""
      } />
        ${(element) => {
          element.addEventListener("change", handleCheck);

          yTodo.observe((event) => {
            element.checked = yTodo.get("checked");
          });
        }}
      `}
      
      ${render`
        <div class="d-inline flex-fill todox-item-editable" contenteditable="true">${
          todo.text
        }</div>>
        ${(element) => {
          let isFocused = false;
          element.addEventListener("input", handleEdit);
          element.addEventListener("focus", () => {
            isFocused = true;
          });
          element.addEventListener("blur", () => {
            isFocused = false;
          });
          yTodo.observe((event) => {
            const { text, checked } = yTodo.toJSON();
            if (!isFocused) {
              element.innerText = text;
            }
            element.style.opacity = checked ? 0.5 : 1;
          });
        }}
      `}
      
      ${render`
        <button
          class="btn btn-sm"
          style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .3rem; --bs-btn-font-size: .6rem;"
        >
         ❌
        </button>
         ${(element) => {
           element.addEventListener("click", () => {
             onRemove(yTodo);
           });
         }}
      `}
    </li>
  `;
};
