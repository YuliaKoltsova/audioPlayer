// Сохранение в localStorage
const saveToLocalStorage = (key, info) => {
  localStorage.setItem(key, JSON.stringify(info)); //преобразование массива в json строку и сохранение его в localStorage по ключу tasks
}

export {saveToLocalStorage};