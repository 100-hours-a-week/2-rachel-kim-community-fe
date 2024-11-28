/* sign-in.js */

document.addEventListener('DOMContentLoaded', () => {
    const profilePhotoInput = document.getElementById('profile-photo');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const nicknameInput = document.getElementById('nickname');
    const signupButton = document.getElementById('signup-button');
    const loginLink = document.getElementById('login-link');
    const backArrow = document.getElementById('back-arrow');
    
    let isProfilePhotoUploaded = false;
    let isEmailValid = false;
    let isPasswordValid = false;
    let isConfirmPasswordValid = false;
    let isNicknameValid = false;


    // 프로필 사진 업로드 
    profilePhotoInput.addEventListener('change', (event) => {
        const label = document.getElementById('profile-photo-label');
    
        if (event.target.files.length > 0) {
            // 프로필 사진이 업로드 된 경우
            clearHelperText(profilePhotoInput);
            isProfilePhotoUploaded = true;
            const file = event.target.files[0]; 
            const reader = new FileReader();
            
            reader.onload = function (e) {
                // 이미지 업로드 후 라벨 내에 이미지 표시
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('profile-photo-preview'); 
                label.innerHTML = ''; 
                label.appendChild(img);
            };
        
            reader.readAsDataURL(file);
        } else {
            // 프로필 사진을 선택하지 않거나 선택을 취소한 경우
            isProfilePhotoUploaded = false;
            label.innerHTML = ''; 
            const plusIcon = document.createElement('span'); 
            plusIcon.classList.add('plus-icon'); 
            plusIcon.textContent = '+'; 
            label.appendChild(plusIcon); 
            setHelperText(profilePhotoInput, '*프로필 사진을 추가해주세요.');
            
            // 선택된 파일이 있다면 그것도 삭제
            profilePhotoInput.value = ''; 
        }
        updateSignupButtonState();
    });
    

    // 이메일 유효성 검사
    emailInput.addEventListener('blur', (event) => {
        const email = event.target.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email) {
            setHelperText(emailInput, '*이메일을 입력해주세요.');
            isEmailValid = false;
        } else if (!emailRegex.test(email)) {
            setHelperText(emailInput, '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)');
            isEmailValid = false;
        } else {

            // 서버와 통신하여 중복 체크
            // 예: fetch('/api/check-email', { method: 'POST', body: JSON.stringify({ email }) })
            // .then(...)
            // .catch(...)

            // 중복 이메일일 경우
            //isEmailValid = false; 
            //setHelperText(emailInput, '*중복된 이메일 입니다.');

            isEmailValid = true; 
            clearHelperText(emailInput);
            
        }
        updateSignupButtonState();
    });

    // 비밀번호 유효성 검사
    passwordInput.addEventListener('blur', (event) => {
        const password = event.target.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

        if (!password) {
            setHelperText(passwordInput, '*비밀번호를 입력해주세요.');
            isPasswordValid = false;
        } else if (!passwordRegex.test(password)) {
            setHelperText(passwordInput, '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
            isPasswordValid = false;
        } else {
            isPasswordValid = true;
            clearHelperText(passwordInput);
        }
        updateSignupButtonState();
    });

    // 비밀번호 확인 유효성 검사
    confirmPasswordInput.addEventListener('blur', (event) => {
        const confirmPassword = event.target.value;

        if (!confirmPassword) {
            setHelperText(confirmPasswordInput, '*비밀번호를 한번 더 입력해주세요.');
            isConfirmPasswordValid = false;
        } else if (confirmPassword !== passwordInput.value) {
            setHelperText(confirmPasswordInput, '*비밀번호가 다릅니다.');
            isConfirmPasswordValid = false;
        } else {
            isConfirmPasswordValid = true;
            clearHelperText(confirmPasswordInput);
        }
        updateSignupButtonState();
    });

    // 닉네임 유효성 검사
    nicknameInput.addEventListener('blur', (event) => {
        const nickname = event.target.value.trim();

        if (!nickname) {
            setHelperText(nicknameInput, '*닉네임을 입력해주세요.');
            isNicknameValid = false;
        } else if (nickname.includes(' ')) {
            setHelperText(nicknameInput, '*띄어쓰기를 없애주세요');
            isNicknameValid = false;
        } else if (nickname.length > 10) {
            setHelperText(nicknameInput, '*닉네임은 최대 10자까지 작성 가능합니다.');
            isNicknameValid = false;
        } else {
            // 서버와 통신하여 중복 체크
            // 예: fetch('/api/check-nickname', { method: 'POST', body: JSON.stringify({ nickname }) })
            // .then(...)
            // .catch(...)

            // 중복 닉네임일 경우
            //isNicknameValid = false; 
            //setHelperText(nicknameInput, '*중복된 닉네임 입니다.');

            isNicknameValid = true; 
            clearHelperText(nicknameInput);
        }
        updateSignupButtonState();
    });

    // 회원가입 버튼 클릭 시
    signupButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (isProfilePhotoUploaded && isEmailValid && isPasswordValid && isConfirmPasswordValid && isNicknameValid) {
            // 여기에 회원가입 데이터를 서버로 전송
            // 예: fetch('/api/sign-up', { method: 'POST', body: JSON.stringify(userData) })
            window.location.href = '/log-in';
        }
    });

    // 로그인하러 가기 링크 클릭 시
    loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '/log-in';
    });

    // 백 애로우 클릭 시
    backArrow.addEventListener('click', () => {
        window.location.href = '/log-in';
    });

    // 유효성 검사 상태에 따라 회원가입 버튼 활성화
    function updateSignupButtonState() {
        if (isProfilePhotoUploaded && isEmailValid && isPasswordValid && isConfirmPasswordValid && isNicknameValid) {
            signupButton.classList.add('active');  
        } 
        else {
            signupButton.classList.remove('active');  
        }
    }

    /// 헬퍼 텍스트 설정 함수
    function setHelperText(inputElement, message) {
        const container = inputElement.closest('.input-area') || inputElement.closest('.profile-photo-container');
        const helperText = container.querySelector('.helper-text');
        if (helperText) {
            helperText.textContent = message;
            helperText.style.display = 'block'; 
        }
    }

    // 헬퍼 텍스트 초기화 함수
    function clearHelperText(inputElement) {
        const container = inputElement.closest('.input-area') || inputElement.closest('.profile-photo-container');
        const helperText = container.querySelector('.helper-text');
        if (helperText) {
            helperText.textContent = '';
        }
    }
    
});