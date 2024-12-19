/* log-in.js */

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const signupLink = document.getElementById('sign-up-link');
    const helperText = document.getElementById('helper-text');

    let isEmailValid = false;
    let isPasswordValid = false;

    // 이메일 유효성 검사
    emailInput.addEventListener('input', (event) => {
        const email = event.target.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!email) {
            helperText.textContent = '*이메일을 입력해주세요.';
            helperText.style.display = 'block';
            isEmailValid = false;
        } else if (!emailRegex.test(email)) {
            helperText.textContent = '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
            helperText.style.display = 'block'; 
            isEmailValid = false;
        } else {
            helperText.textContent = '';
            helperText.style.display = 'none'; 
            isEmailValid = true;
        }
        updateLoginButtonState();
    });

    // 비밀번호 유효성 검사
    passwordInput.addEventListener('input', (event) => {
        const password = event.target.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        
        if (!password) {
            helperText.textContent = '* 비밀번호를 입력해주세요.';
            helperText.style.display = 'block'; 
            isPasswordValid = false;
        } else if (!passwordRegex.test(password)) {
            helperText.textContent = '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
            helperText.style.display = 'block'; 
            isPasswordValid = false;
        } else {
            helperText.textContent = '';
            helperText.style.display = 'none'; 
            isPasswordValid = true;
        }
        updateLoginButtonState();
    });

    // 로그인 버튼 클릭 시 동작
    loginButton.addEventListener('click', (event) => {
        event.preventDefault();  

        // 서버와 통신하여 로그인(이메일, 비밀번호)
        if (isEmailValid && isPasswordValid) {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
        
            fetch(`${BACKEND_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            })
            .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
            .then(data => {
                if (data.data && data.data.auth_token) {
                    // 로그인 성공 시 
                    localStorage.setItem('authToken', data.data.auth_token);
                    window.location.href = '/posts';
                } else {
                    // 로그인 실패 시 
                    helperText.textContent = '*아이디 또는 비밀번호를 확인해주세요.';
                    helperText.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('로그인 오류:', error);
            })
        }
    });

    // 회원가입 링크 클릭 시
    signupLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        window.location.href = '/signup';  
    });

    // 로그인 버튼 활성화
    function updateLoginButtonState() {
        if (isEmailValid && isPasswordValid) {
            loginButton.disabled = false;
            loginButton.classList.add('active');
        } else {
            loginButton.disabled = true;
            loginButton.classList.remove('active');  
        }
    }
});

