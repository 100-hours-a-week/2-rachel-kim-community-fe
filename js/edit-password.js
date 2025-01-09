// edit-password.js
document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const editButton = document.getElementById("edit-button");
    const toast = document.getElementById('toast');
    
    let userId = null;

    // 서버와 통신하여 로그인 상태 확인
    fetch(`${BACKEND_URL}/api/users/auth/check`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    })
    .then(response => {
        if (response.status === 403) {
            localStorage.removeItem('authToken'); // 만료된 토큰 삭제
            window.location.href = '/login';
        } else if (!response.ok) {
            throw new Error('로그인 필요');
        }
        return response.json();
    })
    .then(authData => {
        userId = authData.data.user_id; // 사용자 ID 저장
    })
    .catch(() => {
        console.error('로그인 상태 확인 실패. 로그인 페이지로 리다이렉트합니다.');
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
    });
    
    let isPasswordValid = false;
    let isConfirmPasswordValid = false;

    // 비밀번호 유효성 검사
    passwordInput.addEventListener("input", (event) => {
        const password = event.target.value.trim();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

        if (!password) {
            setHelperText(passwordInput, '*비밀번호를 입력해주세요.');
            isPasswordValid = false;
        } else if (!passwordRegex.test(password)) {
            setHelperText(passwordInput, '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
            isPasswordValid = false;
        } else {
            clearHelperText(passwordInput);
            isPasswordValid = true;
        }
        updateEditButtonState();
    });

    // 비밀번호 확인 유효성 검사
    confirmPasswordInput.addEventListener("input", (event) => {
        const password = passwordInput.value.trim();
        const confirmPassword = event.target.value.trim();

        if (!confirmPassword) {
            setHelperText(confirmPasswordInput, '*비밀번호를 확인해주세요.');
            isConfirmPasswordValid = false;
        } else if (password !== confirmPassword) {
            setHelperText(confirmPasswordInput, '*비밀번호가 다릅니다.');
            isConfirmPasswordValid = false;
        } else {
            clearHelperText(confirmPasswordInput);
            isConfirmPasswordValid = true;
        }
        updateEditButtonState();
    });

    // 수정 버튼 클릭 시
    editButton.addEventListener("click", (event) => {
        event.preventDefault(); 

        // 서버와 통신하여 비밀번호 변경
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        fetch(`${BACKEND_URL}/api/users/${userId}/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 
            },
            body: JSON.stringify({ password, confirmPassword })
        })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then(() => {
            showToast('수정 완료!');
            // 수정 완료 후 게시글 페이지로 이동
            setTimeout(() => {
                window.location.href = '/posts'; // 게시글 페이지 경로로 리다이렉트
            }, 1500); // 토스트 메시지가 표시된 후 약간의 딜레이
        })
        .catch((error) => console.error('비밀번호 수정 실패:', error));
    });

    // 유효성 검사 상태에 따라 수정 버튼 활성화 
    function updateEditButtonState() {
        if (isPasswordValid && isConfirmPasswordValid) {
            editButton.disabled = false;
            editButton.classList.add("active");
        } else {
            editButton.disabled = true;
            editButton.classList.remove("active");
        }
    }

    // 토스트 메시지
    function showToast(message) {
        toast.textContent = message; 
        toast.classList.add('show'); 

        setTimeout(() => {
            toast.classList.remove('show');
        }, 1000); 
    }

    // 헬퍼 텍스트 설정 함수
    function setHelperText(inputElement, message) {
        const container = inputElement.closest('.input-area');
        const helperText = container.querySelector('.helper-text');
        if (helperText) {
            helperText.textContent = message;
            helperText.style.display = 'block'; 
        }
    }

    // 헬퍼 텍스트 초기화 함수
    function clearHelperText(inputElement) {
        const container = inputElement.closest('.input-area');
        const helperText = container.querySelector('.helper-text');
        if (helperText) {
            helperText.textContent = '';
        }
    }
});

