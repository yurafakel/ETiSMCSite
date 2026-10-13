const selectElement = document.getElementById('edition-select');
const javaContent = document.getElementById('java-content');
const bedrockContent = document.getElementById('bedrock-content');
const notification = document.getElementById('copy-notification');

// Переключение между Java и Bedrock
selectElement.addEventListener('change', function() {
    if (this.value === 'java') {
        javaContent.classList.add('active');
        bedrockContent.classList.remove('active');
    } else if (this.value === 'bedrock') {
        bedrockContent.classList.add('active');
        javaContent.classList.remove('active');
    }
});

// Логика копирования текста по клику
const copyableElements = document.querySelectorAll('.copyable');

copyableElements.forEach(element => {
    element.addEventListener('click', function() {
        const textToCopy = this.textContent.trim();

        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification();
        }).catch(err => {
            console.error('Ошибка при копировании: ', err);
        });
    });
});

// Функция показа и скрытия уведомления
let notificationTimeout;
function showNotification() {
    clearTimeout(notificationTimeout);
    notification.classList.add('show');
    
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 2000); // Подсказка исчезнет через 2 секунды
}