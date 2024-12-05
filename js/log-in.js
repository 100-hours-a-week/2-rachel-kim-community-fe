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
            helperText.style.display = 'block'; 
            helperText.textContent = '*이메일을 입력해주세요.';
            isEmailValid = false;
        } else if (!emailRegex.test(email)) {
            helperText.style.display = 'block'; 
            helperText.textContent = '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
            isEmailValid = false;
        } else {
            helperText.textContent = '';
            isEmailValid = true;
        }
        
        updateLoginButtonState();
    });

    // 비밀번호 유효성 검사
    passwordInput.addEventListener('input', (event) => {
        const password = event.target.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        
        if (!password) {
            helperText.style.display = 'block'; 
            helperText.textContent = '* 비밀번호를 입력해주세요.';
            isPasswordValid = false;
        } else if (!passwordRegex.test(password)) {
            helperText.style.display = 'block'; 
            helperText.textContent = '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
            isPasswordValid = false;
        } else {
            helperText.textContent = '';
            isPasswordValid = true;
        }
        
        updateLoginButtonState();
    });

    // 로그인 버튼 클릭 시 동작
    loginButton.addEventListener('click', (event) => {
        event.preventDefault();  // 폼 제출 방지

        // 여기에 fetch 요청을 추가할 수 있는 자리입니다.
        // 예시:
        // fetch('/api/login', { ... })
    });

    // 회원가입 링크 클릭 시
    signupLink.addEventListener('click', (event) => {
        event.preventDefault(); // 브라우저 페이지 이동 기본 동작 막음
        window.location.href = '/users/new';  // 회원가입 페이지로 이동
    });

    // 유효성 검사 상태에 따라 로그인 버튼 활성화
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

