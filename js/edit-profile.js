// edit-profile.js

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profile-img');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const nicknameInput = document.getElementById('nickname');
    const editButton = document.getElementById('edit-button');
    const helperText = document.getElementById('helper-text');
    const deleteAccountLink = document.getElementById('delete-account-link');
    const deleteAccountModal = document.getElementById('delete-account-modal');
    const cancelButton = document.getElementById('cancel-button');
    const confirmButton = document.getElementById('confirm-button');
    const saveButton = document.getElementById('save-button');
    const profilePhotoInput = document.getElementById('profile-photo');
    const currentProfilePhoto = document.getElementById('current-profile-photo');
    const emailArea = document.querySelector('.email-area p');
    const toast = document.getElementById('toast');
    
    let userId = null;
    let profileImagePath = null;

    // 서버와 통신하여 로그인 상태 확인
    fetch(`${BACKEND_URL}/api/users/auth/check`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
    })
    .then(response => {
        if (response.status === 403) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        } else if (!response.ok) {
            throw new Error('인증 실패');
        }
        return response.json();
    })
    .then(({ data: { user_id, profile_image_path } }) => { 
        userId = user_id;
        profileImagePath = profile_image_path;
        if (profileImagePath) {
            profileImg.src = `${BACKEND_URL}${profileImagePath}`; // 프로필 이미지 업데이트
        }
        initializeUserInfo(); // 로그인 상태 확인 후 유저 정보 초기화
    })
    .catch(() => {
        console.error('로그인 상태 확인 실패. 로그인 페이지로 리다이렉트합니다.');
        window.location.href = '/login'; // 로그인되지 않은 경우 리다이렉트
    });

    // 유저 정보 초기화
    function initializeUserInfo() {
        // 서버와 통신하여 유저 정보 조회
        fetch(`${BACKEND_URL}/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then(({ data }) => {
            if (data.email) emailArea.textContent = data.email;
            if (data.profile_image_path) currentProfilePhoto.src = `${BACKEND_URL}${data.profile_image_path}`;
            if (data.nickname) nicknameInput.value = data.nickname;
        })
        .catch(error => console.error('유저 정보 조회 실패:', error));
    }
    
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
                window.location.href = '/login';  
            }
        }
    });

    let originalProfilePhotoSrc = currentProfilePhoto.src; 

    // 프로필 사진 변경 클릭 시
    profilePhotoInput.addEventListener('change', ({ target: { files } }) => {    
        if (files.length > 0) { // 프로필 사진이 업로드 된 경우
            const file = files[0]; 
            const reader = new FileReader();

            reader.onload = function (e) {
                currentProfilePhoto.src = e.target.result; // 업로드된 사진 미리보기
            };
        
            reader.readAsDataURL(file);
        } else {
            currentProfilePhoto.src = originalProfilePhotoSrc; // 파일 선택이 취소된 경우, 원래 프로필 사진 복원
            profilePhotoInput.value = ''; // 선택된 파일이 있다면 그것도 삭제
        }
    });

    // 수정하기 버튼 클릭 시
    editButton.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim();
        if (!nickname) { // 닉네임 유효성 검사
            helperText.textContent = '*닉네임을 입력해주세요.';
            helperText.style.display = 'block';
            return;
        } else if (nickname.length > 10) {
            helperText.textContent = '*닉네임은 최대 10자까지 작성 가능합니다.';
            helperText.style.display = 'block';
            return;
        } else {
            // 서버와 통신하여 닉네임 중복 체크
            fetch(`${BACKEND_URL}/api/users/nickname/check/update?nickname=${encodeURIComponent(nickname)}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            })
            .then((response) => {
                if (response.status === 409) {
                    helperText.textContent = '*중복된 닉네임입니다.';
                    helperText.style.display = 'block';
                    return;
                } else if (response.status === 200) {
                    helperText.textContent = '';
                    helperText.style.display = 'none';
                    return;
                } else {
                    return Promise.reject(`서버 에러 발생: ${response.status}`);
                }   
            })
            .catch((error) => console.error('닉네임 중복 체크 실패:', error));
        }
    });

    // 회원 탈퇴 링크 클릭 시
    deleteAccountLink.addEventListener('click', (event) => {
        event.preventDefault();

        const overlay = deleteAccountModal.closest('.overlay');  
        overlay.classList.add('active'); 
        document.body.classList.add('no-scroll'); 
    });

    // 모달 취소 버튼 클릭 시
    cancelButton.addEventListener('click', () => {
        const overlay = deleteAccountModal.closest('.overlay'); 
        overlay.classList.remove('active'); 
        document.body.classList.remove('no-scroll');
    });
    
    // 모달 확인 버튼 클릭 시
    confirmButton.addEventListener('click', () => {
        // 서버와 통신하여 회원정보 삭제
        fetch(`${BACKEND_URL}/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.ok ? window.location.href = '/login' : Promise.reject(`서버 에러 발생: ${response.status}`))
        .catch((error) => {
            console.error('회원 탈퇴 실패:', error);
        });
    });

    // 수정 완료 버튼 클릭 시
    saveButton.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim();
        const profilePhotoFile = profilePhotoInput.files[0]; // 선택된 프로필 사진 파일

        // 서버와 통신하여 회원정보 수정
        const formData = new FormData();
        formData.append('nickname', nickname);
        if (profilePhotoFile) {
            formData.append('profilePhoto', profilePhotoFile);
        }

        fetch(`${BACKEND_URL}/api/users/${userId}`, {
            method: 'PATCH',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then(({ profile_image_path }) => {
            showToast('수정 완료!');
            if (profile_image_path) {
                currentProfilePhoto.src = profile_image_path; // 새 프로필 사진 업로드
            }
            setTimeout(() => {
                window.location.href = '/posts'; // 게시글 페이지 경로로 리다이렉트
            }, 1500); // 토스트 메시지가 표시된 후 약간의 딜레이
        })
        .catch((error) => console.error('회원정보 수정 실패:', error));
    });

    // 토스트 메시지
    function showToast(message) {
        toast.textContent = message; 
        toast.classList.add('show'); 

        setTimeout(() => {
            toast.classList.remove('show');
        }, 1000); 
    }
});