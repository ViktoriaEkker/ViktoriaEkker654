// Основная функция для инициализации приложения
document.addEventListener('DOMContentLoaded', function() {
    // Показываем первый раздел при загрузке
    showSection('intro');
    
    // Навигация по разделам через меню
    setupMenuNavigation();
    
    // Навигация по кнопкам "Далее" и "Назад"
    setupButtonNavigation();
    
    // Раскрытие/сворачивание подменю
    setupSubmenuToggle();
});

// Функция для настройки навигации через меню
function setupMenuNavigation() {
    document.querySelectorAll('.sidebar-menu a, .submenu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Обновляем активные элементы меню
            updateActiveMenuItems(this);
            
            // Если это ссылка на подраздел, открываем родительское меню
            toggleParentMenu(this);
        });
    });
}

// Функция для показа выбранного раздела
function showSection(sectionId) {
    // Скрываем все разделы
    document.querySelectorAll('.chapter-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Показываем выбранный раздел
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Прокручиваем к началу раздела с плавной анимацией
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Обновление активных элементов меню
function updateActiveMenuItems(clickedLink) {
    document.querySelectorAll('.sidebar-menu a, .submenu a').forEach(item => {
        item.classList.remove('active');
    });
    clickedLink.classList.add('active');
}

// Открытие родительского меню для подразделов
function toggleParentMenu(clickedLink) {
    if (clickedLink.parentElement.parentElement.classList.contains('submenu')) {
        const submenu = clickedLink.closest('.submenu');
        submenu.classList.add('active');
        
        const parentMenuItem = clickedLink.closest('.sidebar-menu li');
        if (parentMenuItem) {
            parentMenuItem.querySelector('a').classList.add('active');
        }
    }
}

// Настройка кнопок навигации "Далее" и "Назад"
function setupButtonNavigation() {
    document.querySelectorAll('.navigation a').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.getAttribute('data-next')) {
                showSection(this.getAttribute('data-next'));
            } else if (this.getAttribute('data-prev')) {
                showSection(this.getAttribute('data-prev'));
            }
        });
    });
}

// Раскрытие/сворачивание подменю
function setupSubmenuToggle() {
    document.querySelectorAll('.sidebar-menu > li > a').forEach(item => {
        item.addEventListener('click', function(e) {
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                e.preventDefault();
                submenu.classList.toggle('active');
            }
        });
    });
}

// Проверка тестов
function checkTest(testId) {
    // Правильные ответы для каждого теста
    const answers = {
        'test1': { 'q1': 'd', 'q2': 'a', 'q3': 'a' },
        'test2': { 'q1': 'd', 'q2': 'a', 'q3': 'b' }
    };
    
    const form = document.getElementById(testId);
    const questions = form.querySelectorAll('.question');
    let correct = 0;
    
    // Проверяем каждый вопрос
    questions.forEach((question, index) => {
        const qName = `q${index+1}`;
        const selected = question.querySelector(`input[name="${qName}"]:checked`);
        
        // Проверяем ответ и подсвечиваем вопрос
        if (selected && selected.value === answers[testId][qName]) {
            correct++;
            question.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
            question.style.borderLeft = '3px solid var(--success-color)';
        } else {
            question.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
            question.style.borderLeft = '3px solid var(--error-color)';
        }
    });
    
    // Показываем результаты
    showTestResults(correct, questions.length);
}

// Отображение результатов теста
function showTestResults(correct, total) {
    const scoreElement = document.getElementById('score');
    const feedbackElement = document.getElementById('feedback');
    const resultsElement = document.getElementById('results');
    
    scoreElement.textContent = `Правильных ответов: ${correct} из ${total}`;
    
    const percentage = (correct / total) * 100;
    if (percentage >= 80) {
        feedbackElement.textContent = 'Отличный результат!';
        feedbackElement.style.color = 'var(--success-color)';
    } else if (percentage >= 50) {
        feedbackElement.textContent = 'Хороший результат, но есть над чем поработать.';
        feedbackElement.style.color = 'var(--warning-color)';
    } else {
        feedbackElement.textContent = 'Рекомендуется повторить материал.';
        feedbackElement.style.color = 'var(--error-color)';
    }
    
    resultsElement.style.display = 'block';
    
    // Прокручиваем к результатам
    resultsElement.scrollIntoView({ behavior: 'smooth' });
}

// Функция для загрузки контента из базы данных
async function loadChapterContent(sectionId) {
    try {
        const response = await fetch(`/api/chapters/${sectionId}`);
        if (!response.ok) {
            throw new Error('Chapter not found');
        }
        const chapterData = await response.json();
        
        // Обновляем содержимое страницы
        const chapterContent = document.getElementById(sectionId);
        if (chapterContent) {
            chapterContent.querySelector('.content').innerHTML = chapterData.content;
        }
    } catch (error) {
        console.error('Error loading chapter:', error);
        // Можно показать сообщение об ошибке пользователю
    }
}

// Модифицируйте функцию showSection
function showSection(sectionId) {
    // Скрываем все разделы
    document.querySelectorAll('.chapter-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Показываем выбранный раздел
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Загружаем контент из базы данных
        loadChapterContent(sectionId);
        
        // Прокручиваем к началу раздела
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}