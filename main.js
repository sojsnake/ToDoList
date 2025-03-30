const addBtn = document.querySelector('.fa-plus'); //추가 버튼
const input = document.querySelector('.footer_input'); //input 요소
const input_date = document.querySelector('.footer_date');
const items = document.querySelector('.items'); //ul 빈 ul
const darkModeToggle = document.querySelector('.dark-mode-toggle');

//로컬스토리지에 저장
function saveTodos() {
  const todos = [];
  document.querySelectorAll('.item').forEach((item) => {
    todos.push({
      // 객체 형태로 todos 배열에 추가하기
      text: item.querySelector('span').textContent,
      dueDate: item.querySelector('.due-date').textContent,
      isDone: item.classList.contains('item_done'),
    });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
  // 배열을 문자열로 변환하여 todos로 저장
}

//로컬스토리지 로드
function loadTodos() {
  const savedTodos = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
  // 파서를 사용해 문자열을 js객체로 변환
  savedTodos.forEach((todo) =>
    items.appendChild(createItem(todo.text, todo.dueDate, todo.isDone))
  );
}

function createItem(text, dueDate, isDone) {
  // li를 ``로 작성하면 event 적용이 어려움
  console.log(text);
  const itemRow = document.createElement('li');
  itemRow.className = 'item';
  // 로컬 스토리지에서 불러왔을 때 완료된 상태인지 반영
  if (isDone) itemRow.classList.add('item_done');

  itemRow.innerHTML = `<span>${text}</span>
          <span class="due-date">${dueDate}</span>
          <i class="fa-solid fa-check"></i>
          <i class="fa-solid fa-trash-can"></i>`;

  // 체크버튼 클릭시 클래스 추가 이벤트
  itemRow.querySelector('.fa-check').addEventListener('click', () => {
    itemRow.classList.toggle('item_done'); //class에 item_done을 넣었다 제거했다가 해줌
    saveTodos();
  });

  // 삭제 버튼 클릭시 itemRow 제거 이벤트
  itemRow.querySelector('.fa-trash-can').addEventListener('click', () => {
    itemRow.remove();
    saveTodos();
  });
  //원하는 대상의 시점으로 focus
  //   setTimeout(() => itemRow.scrollIntoView({ block: 'center' }), 0); //settimeout을 만나면 동기 비동기???? 0초라도 내용 실행??
  requestAnimationFrame(() => itemRow.scrollIntoView({ block: 'center' }));
  return itemRow;
}

function onAdd() {
  const text = input.value.trim();
  // 마감날짜 입력. 입력 안하면 추가되지 않고 날짜 포커스
  const dueDate = input_date.value;

  if (!text) {
    input.value = '';
    input.focus(); //???이게 뭐야?
    return;
  }

  if (!dueDate) {
    input_date.focus();
    return;
  }

  //li 생성하는 함수 - createItem()
  //ul에 생성값을 추가함
  items.appendChild(createItem(text, dueDate)); //items 즉 li 안에 넣어줌
  saveTodos();

  input.value = '';
  input_date.value = '';
  // 입력 필드 초기화
  input.focus();
}

//이벤트 등록
addBtn.addEventListener('click', onAdd); //버튼이 클릭되었을때
input.addEventListener('keyup', (el) => el.key === 'Enter' && onAdd());
/*input.addEventListener('keypress', (el) => {
  if (el.key === 'Enter') {
    onAdd(); //enter가 눌러졌을때
  }
});*/
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // dark-mode가 적용된 상태이면 해 모양, 해재된 상태면 달 모양
  darkModeToggle.textContent = document.body.classList.contains('dark-mode')
    ? '☀️'
    : '🌙';
});

//새로고침했을 때 로컬 스토리지에서 데이터 불러오도록
window.addEventListener('load', loadTodos);
