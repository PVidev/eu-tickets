// Генериране на случайна математическа задача
function generateCaptcha() {
    const operations = [
        { op: '+', func: (a, b) => a + b },
        { op: '-', func: (a, b) => a - b },
        { op: '*', func: (a, b) => a * b }
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    
    // Запазваме отговора в localStorage
    const answer = operation.func(num1, num2);
    localStorage.setItem('captchaAnswer', answer);
    
    return `${num1} ${operation.op} ${num2}`;
}

// Инициализация на формата
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const captchaLabel = document.querySelector('.captcha-group label');
    
    // Генериране на първата captcha
    captchaLabel.textContent = `Security Check: What is ${generateCaptcha()}?`;
    
    // Брояч на символите
    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        if (length < 60) {
            this.setCustomValidity('Message must be at least 60 characters long');
        } else if (length > 1500) {
            this.setCustomValidity('Message cannot exceed 1500 characters');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Валидация на формата
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const captcha = document.getElementById('captcha').value;
        const correctAnswer = localStorage.getItem('captchaAnswer');
        
        if (captcha !== correctAnswer) {
            alert('Please enter the correct answer to the security check');
            // Генериране на нова captcha
            captchaLabel.textContent = `Security Check: What is ${generateCaptcha()}?`;
            document.getElementById('captcha').value = '';
            return false;
        }
        
        // Изпращане на формата чрез AJAX
        const formData = new FormData(this);
        
        fetch('process_contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                charCount.textContent = '0';
                // Генериране на нова captcha
                captchaLabel.textContent = `Security Check: What is ${generateCaptcha()}?`;
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending your message. Please try again.');
        });
        
        return false;
    });
}); 