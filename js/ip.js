const selectElement = document.getElementById('edition-select');
const javaContent = document.getElementById('java-content');
const bedrockContent = document.getElementById('bedrock-content');
const notification = document.getElementById('copy-notification');

// Переключение между Java и Bedrock
if (selectElement) {
    selectElement.addEventListener('change', function() {
        if (this.value === 'java') {
            javaContent.classList.add('active');
            bedrockContent.classList.remove('active');
        } else if (this.value === 'bedrock') {
            bedrockContent.classList.add('active');
            javaContent.classList.remove('active');
        }
    });
}

// Логика копирования текста по клику
const copyableElements = document.querySelectorAll('.copyable');

copyableElements.forEach(element => {
    element.addEventListener('click', function() {
        // Ищем текст внутри .ip-text, либо берём весь текст элемента
        const textElement = this.querySelector('.ip-text') || this;
        const textToCopy = textElement.textContent.trim();

        // Современный способ через Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification();
            }).catch(err => {
                console.warn('Clipboard API не сработал, пробуем запасной вариант:', err);
                fallbackCopyText(textToCopy);
            });
        } else {
            // Запасной вариант для HTTP-соединений
            fallbackCopyText(textToCopy);
        }
    });
});

// Запасной метод копирования для старых браузеров или незащищенного HTTP
function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Сдвигаем элемент за пределы экрана, чтобы избежать скролла
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification();
        } else {
            console.error('Не удалось скопировать текст');
        }
    } catch (err) {
        console.error('Ошибка запасного копирования: ', err);
    }

    document.body.removeChild(textArea);
}

// Функция показа и скрытия уведомления
let notificationTimeout;
function showNotification() {
    if (!notification) return;
    clearTimeout(notificationTimeout);
    notification.classList.add('show');
    
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 2000); // Подсказка исчезнет через 2 секунды
}