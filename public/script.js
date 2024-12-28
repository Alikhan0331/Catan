// Scroll value
window.addEventListener("scroll", setScrollVar)
window.addEventListener("resize", setScrollVar)

function setScrollVar(){
    const htmlElemnt = document.documentElement
    const percent = htmlElemnt.scrollTop / htmlElemnt.clientHeight
    htmlElemnt.style.setProperty("--scroll", Math.min(percent*100, 100))
}

setScrollVar()

// Calendar
let c = 0;

const calendar = {
    currentDate: new Date(),
  
    renderCalendar() {
      const daysContainer = document.getElementById('days-container');
      const monthYear = document.getElementById('month-year');
      const currentMonth = this.currentDate.getMonth();
      const currentYear = this.currentDate.getFullYear();
  
      let monthName = this.currentDate.toLocaleDateString('ru-RU', {
        month: 'long',
      });
      // Преобразуем первую букву в заглавную
      monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      monthYear.textContent = `${monthName} ${currentYear}`;

      daysContainer.innerHTML = '';
    
      // Определяем первый день месяца (где понедельник = 0)
      let firstDay = new Date(currentYear, currentMonth, 1).getDay();
      firstDay = (firstDay === 0) ? 6 : firstDay - 1; // Преобразуем, чтобы неделя начиналась с понедельника
  
      const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
  
      // Добавляем пустые ячейки для дней перед началом месяца
      for (let i = 0; i < firstDay; i++) {
        daysContainer.innerHTML += '<div></div>';
      }
  
      // Добавляем дни текущего месяца
      for (let i = 1; i <= lastDate; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;

        const dayOfWeek = (firstDay + i - 1) % 7; // Понедельник = 0, Воскресенье = 6
  
        if (dayOfWeek === 6) { // Если день воскресенье
            dayDiv.classList.add('sunday');
        }
  
        daysContainer.appendChild(dayDiv);
      }
    },
  
    init() {
      document.getElementById('prev-month').addEventListener('click', () => {
        c -= 1;
        document.getElementById('next-month').style.display = 'block';
        if (c == -1){
          document.getElementById('prev-month').style.display = 'none';
        }
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
      });
  
      document.getElementById('next-month').addEventListener('click', () => {
        c += 1;
        document.getElementById('prev-month').style.display = 'block';
        if (c == 2){
          document.getElementById('next-month').style.display = 'none';
        }
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
      });
  
      this.renderCalendar();
    },
  };
  
  calendar.init();

// Table
var link = '/api/leaderboard_global';

// Auth

document.getElementsByClassName('fa-right-to-bracket')[0].addEventListener("click", ()=> {
  document.getElementById('auth-container').style.display = 'block';
});

document.getElementById('close-auth').addEventListener('click', () => {
  document.getElementById('auth-container').style.display = 'none';
})


let isAuthenticated = false;

document.getElementById('auth-button').addEventListener('click', async () => {
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });

    if (response.ok) {
        alert('Доступ предоставлен');
        isAuthenticated = true;
        loadTable()
        // Показать таблицу
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('settings').style.display="flex";
    } else {
        document.getElementById('incorrect_password').style.display='block';
    }
});

// Add player

function clearInputs() {
  document.getElementById('name').value = '';
  document.getElementById('nickname').value = '';
  document.getElementById('achievements').value = '';
  document.getElementById('score').value = '';
  document.getElementById('wins').value = '';
}

document.getElementById('add-player-button').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const nickname = document.getElementById('nickname').value;
  const achievements = document.getElementById('achievements').value;
  const score = parseInt(document.getElementById('score').value, 10);
  const wins = parseInt(document.getElementById('wins').value, 10);

  if (!name || !nickname || isNaN(score) || isNaN(wins)) {
      alert('Пожалуйста, заполните все поля.');
      return;
  }

  const newPlayer = { rank: 0, name, nickname, achievements, score, wins };

  try {
      const response = await fetch(link, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPlayer),
      });

      if (response.ok) {
          alert('Игрок успешно добавлен!');
          loadTable(); // Перезагружаем таблицу
          clearInputs()
      } else {
          alert('Ошибка при добавлении игрока.');
      }
  } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось связаться с сервером.');
  }
});

// Change element in table

document.getElementById('edit-player-button').addEventListener('click', async () => {
  const index = parseInt(document.getElementById('edit-index').value, 10);
  const name = document.getElementById('edit-name').value;
  const nickname = document.getElementById('edit-nickname').value;
  const achievements = document.getElementById('edit-achievements').value;
  const score = document.getElementById('edit-score').value;
  const wins = document.getElementById('edit-wins').value;

  if (isNaN(index)) {
      alert('Пожалуйста, введите корректный индекс.');
      return;
  }

  // Формируем объект только с непустыми значениями
  const updatedPlayer = {};
  if (name) updatedPlayer.name = name;
  if (nickname) updatedPlayer.nickname = nickname;
  if (achievements) updatedPlayer.achievements = achievements;
  if (score) updatedPlayer.score = parseInt(score, 10);
  if (wins) updatedPlayer.wins = parseInt(wins, 10);

  console.log('Отправка данных на сервер:', updatedPlayer);

  try {
      const response = await fetch(`${link}/${index}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPlayer),
      });

      if (response.ok) {
          const result = await response.json();
          console.log('Ответ сервера:', result);
          alert('Данные игрока успешно обновлены!');
          loadTable(); // Перезагружаем таблицу
          clearEditInputs(); // Очищаем все поля ввода
      } else {
          const error = await response.json();
          console.error('Ошибка сервера:', error);
          alert(`Ошибка: ${error.message}`);
      }
  } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось связаться с сервером.');
  }
});


function clearEditInputs() {
  document.getElementById('edit-index').value = '';
  document.getElementById('edit-name').value = '';
  document.getElementById('edit-nickname').value = '';
  document.getElementById('edit-achievements').value = '';
  document.getElementById('edit-score').value = '';
  document.getElementById('edit-wins').value = '';
}

// table load

async function loadTable() {
    const response = await fetch(link);
    const data = await response.json();

    const tbody = document.querySelector('#leaderboard tbody');
    tbody.innerHTML = '';

    data.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="center">${player.rank}</td>
            <td>${player.achievements}</td>
            <td>${player.name}</td>
            <td>${player.nickname}</td>
            <td class="score">${player.score}</td>
            <td>${player.wins}</td>
            ${isAuthenticated ? `<button onclick="deletePlayer(${index})">Удалить</button>` : ""}
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', loadTable);

let a;
const ch_tb = document.getElementById("choose-table")
const tb_sw = document.getElementsByClassName("table-switcher")

ch_tb.addEventListener("click", () => {
  tb_sw[0].classList.toggle('active')
  ch_tb.classList.toggle('active_color')
})

function typeTable(a){

  if ( a == 1){
    ch_tb.innerHTML = `
      <p>Общий рейтинг</p>
      <i class="fa-solid fa-angle-down"></i>
    `;
    link = '/api/leaderboard_global';
  }else{
    ch_tb.innerHTML = `
      <p>Квартальный рейтинг</p>
      <i class="fa-solid fa-angle-down"></i>
    `;
    link = '/api/leaderboard_local';
  }
  tb_sw[0].classList.remove('active')
  loadTable()
  ch_tb.classList.remove('active_color')
}

// Delete

async function deletePlayer(index) {
  try {
      const response = await fetch(link, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: index + 1})
          
      });

      if (response.ok) {
          loadTable();
      } else {
          throw new Error("Ошибка удаления игрока");
      }
  } catch (error) {
      console.error(error);
  }
}

// Additional functions

document.getElementsByClassName('logo')[0].addEventListener("click", () => {
  window.scrollTo(0, 0);
})

const burger = document.getElementById('burger');
const navPanel = document.getElementById('nav-panel');

burger.addEventListener('click', () => {
    navPanel.classList.toggle('active');
});