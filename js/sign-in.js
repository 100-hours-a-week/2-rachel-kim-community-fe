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

    // 서버와 통신하여 로그인 상태 확인
    fetch(`${BACKEND_URL}/api/users/auth/status`, {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/posts'; // 이미 로그인된 경우 게시글 페이지로 이동
        }
    })
    .catch(() => {
        // 로그인되지 않은 상태, 회원가입 페이지 유지
    });

    // 프로필 사진 업로드 
    profilePhotoInput.addEventListener('change', ({ target: { files } }) => {
        const label = document.getElementById('profile-photo-label');
        if (files.length > 0) { // 프로필 사진이 업로드 된 경우
            clearHelperText(profilePhotoInput);
            isProfilePhotoUploaded = true;
            const reader = new FileReader();
            reader.onload = (e) => { // 이미지 업로드 후 라벨 내에 이미지 표시
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('profile-photo-preview'); 
                label.innerHTML = ''; 
                label.appendChild(img);
            };
            reader.readAsDataURL(files[0]);
        } else { // 프로필 사진을 선택하지 않거나 선택을 취소한 경우
            isProfilePhotoUploaded = false;
            label.innerHTML = ''; 
            const plusIcon = document.createElement('span'); 
            plusIcon.classList.add('plus-icon'); 
            plusIcon.textContent = '+'; 
            label.appendChild(plusIcon); 
            setHelperText(profilePhotoInput, '*프로필 사진을 추가해주세요.');
            profilePhotoInput.value = ''; // 선택된 파일이 있다면 그것도 삭제
        }
        updateSignupButtonState();
    });
    
    // 이메일 유효성 검사
    emailInput.addEventListener('blur', ({ target: { value } }) => {
        const email = event.target.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            setHelperText(emailInput, '*이메일을 입력해주세요.');
            isEmailValid = false;
        } else if (!emailRegex.test(email)) {
            setHelperText(emailInput, '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)');
            isEmailValid = false;
        } else {
            // 서버와 통신하여 이메일 중복 체크
            fetch(`${BACKEND_URL}/api/users/email/check?email=${encodeURIComponent(email)}`, {
                method: 'GET',
            })
            .then((response) => {
                if (response.status === 409) { // 중복된 이메일 처리
                    isEmailValid = false;
                    setHelperText(emailInput, '*중복된 이메일입니다.');
                } else if (response.status === 200) { // 사용 가능한 이메일 처리
                    isEmailValid = true;
                    clearHelperText(emailInput);
                } else {
                    return Promise.reject(`서버 에러 발생: ${response.status}`);
                }
            })
            .catch((error) => console.error('이메일 중복 체크 실패:', error))
            .finally(() => updateSignupButtonState());
        }
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
            // 서버와 통신하여 닉네임 중복 체크
            fetch(`${BACKEND_URL}/api/users/nickname/check/signup?nickname=${encodeURIComponent(nickname)}`, {
                method: 'GET',
            })
            .then(response => {
                if (response.status === 409) {
                    isNicknameValid = false;
                    setHelperText(nicknameInput, '*중복된 닉네임입니다.');
                        return;
                } else if (response.status === 200) {
                    isNicknameValid = true;
                    clearHelperText(nicknameInput);
                    return;
                } else {
                    return Promise.reject(`서버 에러 발생: ${response.status}`);
                }
            })
            .catch(error => {
                console.error('닉네임 중복 체크 실패:', error);
            })
            .finally(() => {
                updateSignupButtonState();
            });
        }
    });

    // 회원가입 버튼 클릭 시
    signupButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (isProfilePhotoUploaded && isEmailValid && isPasswordValid && isConfirmPasswordValid && isNicknameValid) {
            // 서버와 통신하여 회원가입(프로필 사진, 이메일, 비밀번호, 닉네임) 
            const formData = new FormData();
            formData.append('profilePhoto', profilePhotoInput.files[0]);
            formData.append('email', emailInput.value.trim());
            formData.append('password', passwordInput.value);
            formData.append('nickname', nicknameInput.value.trim());
            fetch(`${BACKEND_URL}/api/users/signup`, {
                method: 'POST', 
                body: formData, 
            })
            .then((response) => {
                if (response.status === 201) { // 회원가입 성공
                    window.location.href = '/login'; 
                }
                return response.json(); // 에러 메시지 처리
            })
            .then(data => {
                if (data && data.message) {
                    console.error('회원가입 실패:', data.message);
                }
            })
            .catch(error => console.error('회원가입 요청 실패:', error));
        }
    });

    // 로그인하러 가기 링크 클릭 시
    loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '/login';
    });

    // 백 애로우 클릭 시
    backArrow.addEventListener('click', () => {
        window.location.href = '/login';
    });

    // 유효성 검사 상태에 따라 회원가입 버튼 활성화
    const updateSignupButtonState = () => {
        if (isProfilePhotoUploaded && isEmailValid && isPasswordValid && isConfirmPasswordValid && isNicknameValid) {
            signupButton.disabled = false;
            signupButton.classList.add('active');  
        } else {
            signupButton.disabled = true;
            signupButton.classList.remove('active');  
        }
    };

    // 헬퍼 텍스트 설정 함수
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
            helperText.style.display = 'none'; 
        }
    }
});
