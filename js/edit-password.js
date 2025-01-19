// edit-password.js
document.addEventListener("DOMContentLoaded", () => {
    const profileImg = document.getElementById('profile-img');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const editButton = document.getElementById("edit-button");
    const toast = document.getElementById('toast');
    
    let userId = null;

    // 서버와 통신하여 인증된 사용자 확인
    fetch(`${BACKEND_URL}/api/users/protected`, {
        method: "GET",
        credentials: "include", // 세션 쿠키 포함
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // 인증된 사용자 정보 반환
        } else {
            throw new Error('인증되지 않은 사용자입니다.');
        }
    })
    .then(({ user }) => {
        userId = user.user_id;
        if (user.profile_image_path) {
            profileImg.src = `${BACKEND_URL}${user.profile_image_path}`; // 프로필 이미지 업데이트
        }
    })
    .catch(error => {
        console.error('사용자 인증 실패:', error.message);
        window.location.href = '/login'; // 인증 실패 시 로그인 페이지로 리다이렉트
    });

    // 프로필 이미지 클릭 시
    profileImg.addEventListener('click', () => dropdownMenu.classList.toggle('show')); 

    // 드롭 다운 메뉴 항목 클릭 시
    dropdownMenu.addEventListener('click', (event) => {
        const { target } = event;
        if (target.tagName === 'A') {
            event.preventDefault(); 
            if (target.id === 'profile-link') {
                window.location.href = `/users/${userId}/profile`;  
            } else if (target.id === 'password-link') {
                window.location.href = `/users/${userId}/password`;  
            } else if (target.id === 'logout-link') {
                // 서버와 통신하여 로그아웃
                fetch(`${BACKEND_URL}/api/users/logout`, {
                    method: 'POST',
                    credentials: 'include', // 세션 쿠키 포함
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/login'; // 로그아웃 성공 후 리다이렉트
                    }
                })
                .catch(error => console.error(`로그아웃 실패: ${error}`));
            }
        }
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
            credentials: 'include', // 쿠키 포함
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, confirmPassword })
        })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then(() => {
            showToast('수정 완료!');
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
        setTimeout(() => toast.classList.remove('show'), 1000);
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

