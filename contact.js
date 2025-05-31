// Генериране на случайна математическа задача
function generateCaptcha() {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let answer;

    switch(operation) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            // Уверете се, че резултатът е положително число
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
    }

    const captchaLabel = document.querySelector('.captcha-group label');
    captchaLabel.textContent = `Security Check: What is ${num1} ${operation} ${num2}?`;
    
    // Запазване на отговора в sessionStorage
    sessionStorage.setItem('captcha_answer', answer);
}

// Инициализация на формата
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация на формата
    const form = document.getElementById('contactForm');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    // Генериране на CSRF токен
    const csrfToken = Math.random().toString(36).substring(2);
    sessionStorage.setItem('csrf_token', csrfToken);
    
    // Добавяне на CSRF токен към формата
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrf_token';
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    // Генериране на първата captcha
    generateCaptcha();

    // Броене на символите в съобщението
    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        if (length < 60) {
            charCount.style.color = 'red';
        } else if (length > 1500) {
            charCount.style.color = 'red';
        } else {
            charCount.style.color = 'var(--text-light)';
        }
    });

    // Валидация и изпращане на формата
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Проверка на captcha
        const captchaInput = document.getElementById('captcha');
        const captchaAnswer = sessionStorage.getItem('captcha_answer');
        
        if (parseInt(captchaInput.value) !== parseInt(captchaAnswer)) {
            alert('Invalid captcha answer. Please try again.');
            generateCaptcha();
            captchaInput.value = '';
            return;
        }

        // Събиране на данните от формата
        const formData = new FormData(form);
        
        // Изпращане на AJAX заявка
        fetch('process_contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Показване на съобщение за успех
                alert('Message sent successfully!');
                // Изчистване на формата
                form.reset();
                // Генериране на нова captcha
                generateCaptcha();
                // Нулиране на брояча на символите
                charCount.textContent = '0';
            } else {
                // Показване на съобщение за грешка
                alert(data.message || 'An error occurred. Please try again.');
                // Генериране на нова captcha при грешка
                generateCaptcha();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending your message. Please try again.');
            // Генериране на нова captcha при грешка
            generateCaptcha();
        });
    });
}); 