const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Пример таблиц

let leaderboard_global = [
    { rank: 0, achievements: 'Пример', name: 'Игрок 1', nickname: 'Player1', score: 150, wins: 12 },
    { rank: 0, achievements: 'Пример', name: 'Игрок 2', nickname: 'Player2', score: 120, wins: 9 },
];

let leaderboard_local = [
    { rank: 0, achievements: 'Пример', name: 'Игрок A', nickname: 'Local1', score: 100, wins: 8 },
    { rank: 0, achievements: 'Пример', name: 'Игрок B', nickname: 'Local2', score: 80, wins: 5 },
    { rank: 0, achievements: 'Пример', name: 'Игрок B', nickname: 'Local2', score: 80, wins: 5 },

]; 

function rank_filter_global(){
    leaderboard_global.sort((a, b) => b.score - a.score);

    leaderboard_global.forEach((player, index) => {
        player.rank = index + 1; // Ранг начинается с 1
    });
}

rank_filter_global()

function rank_filter_local(){
    leaderboard_local.sort((a, b) => b.score - a.score);

    leaderboard_local.forEach((player, index) => {
        player.rank = index + 1; // Ранг начинается с 1
    });
}

rank_filter_global()
rank_filter_local()

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Авторизация
app.post('/api/auth', (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = 'ZhangaLox1232341203910';

    if (password === ADMIN_PASSWORD) {
        res.sendStatus(200); // Success
    } else {
        res.sendStatus(403); // Forbidden
    }
});


// API для получения данных таблицы
app.get('/api/leaderboard_global', (req, res) => {
    res.json(leaderboard_global);
});

app.get('/api/leaderboard_local', (req, res) => {
    res.json(leaderboard_local);
});

// Добавление игрока

app.post('/api/leaderboard_global', (req, res) => {
    const newPlayer = req.body;
    leaderboard_global.push(newPlayer);
    rank_filter_global()
    res.status(201).send({ message: 'Пользователь успешно создан', user: newPlayer });
});

app.post('/api/leaderboard_local', (req, res) => {
    const newPlayer = req.body;
    leaderboard_local.push(newPlayer);
    rank_filter_local()
    res.status(201).send({ message: 'Пользователь успешно создан', user: newPlayer });
});

// Удаление игрока
app.delete('/api/leaderboard_global', (req, res) => {
    const { id } = req.body;
    const index = leaderboard_global.findIndex(player => player.rank === Number(id));
    if (index !== -1) {
        leaderboard_global.splice(index, 1);
        res.send({ message: 'Игрок удален' });
    } else {
        res.status(404).send({ message: 'Игрок не найден' });
    }
    rank_filter_global()
});

app.delete('/api/leaderboard_local', (req, res) => {
    const { id } = req.body;
    const index = leaderboard_local.findIndex(player => player.rank === Number(id));
    if (index !== -1) {
        leaderboard_local.splice(index, 1);
        res.send({ message: 'Игрок удален' });
    } else {
        res.status(404).send({ message: 'Игрок не найден' });
    }
    rank_filter_local()
});

// Обновление игрока
app.put('/api/leaderboard_global/:index', (req, res) => {
    const index = parseInt(req.params.index-1, 10);
    const updates = req.body;

    console.log('Получен запрос на изменение:', index, updates);

    if (index >= 0 && index < leaderboard_global.length) {
        const player = leaderboard_global[index];

        // Обновляем только указанные поля
        leaderboard_global[index] = {
            ...player,
            ...updates,
        };

        console.log('Обновленный игрок:', leaderboard_global[index]);
        res.status(200).send({ message: 'Игрок успешно обновлён', player: leaderboard_global[index] });
    } else {
        res.status(404).send({ message: 'Игрок с таким ID не найден.' });
    }
    rank_filter_global()
});

app.put('/api/leaderboard_local/:index', (req, res) => {
    const index = parseInt(req.params.index-1, 10);
    const updates = req.body;

    console.log('Получен запрос на изменение:', index, updates);

    if (index >= 0 && index < leaderboard_local.length) {
        const player = leaderboard_local[index];

        // Обновляем только указанные поля
        leaderboard_local[index] = {
            ...player,
            ...updates,
        };

        console.log('Обновленный игрок:', leaderboard_local[index]);
        res.status(200).send({ message: 'Игрок успешно обновлён', player: leaderboard_local[index] });
    } else {
        res.status(404).send({ message: 'Игрок с таким ID не найден.' });
    }
    rank_filter_local()
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
