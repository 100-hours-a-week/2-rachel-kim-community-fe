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
    const userId = getLoggedInUserId();  

    // 서버와 통신하여 유저 정보 조회 (이메일, 프로필 사진, 닉네임)
    fetch(`${BACKEND_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // 인증 헤더 추가
        },
    })
        .then(response => response.ok ? response.json() : Promise.reject(`서버 에러 발생: ${response.status}`))
        .then((data) => {
            if (data.data.email) {
                emailArea.textContent = data.data.email; 
            }
            if (data.data.profile_image_path) {
                currentProfilePhoto.src = `${BACKEND_URL}${data.data.profile_image_path}`;
            }
            if (data.data.nickname) {
                nicknameInput.value = data.data.nickname; 
            }
        })
        .catch((error) => console.error('유저 정보 조회 실패:', error));

    // 프로필 이미지 클릭 시
    profileImg.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    // 드롭 다운 메뉴 항목 클릭 시
    dropdownMenu.addEventListener('click', (event) => {
        const target = event.target;
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
    profilePhotoInput.addEventListener('change', (event) => {    
        if (event.target.files.length > 0) {
            // 프로필 사진이 업로드 된 경우
            const file = event.target.files[0]; 
            const reader = new FileReader();

            reader.onload = function (e) {
                // 업로드된 사진 미리보기
                currentProfilePhoto.src = e.target.result; 
            };
        
            reader.readAsDataURL(file);
        } else {
            // 파일 선택이 취소된 경우, 원래 프로필 사진 복원
            currentProfilePhoto.src = originalProfilePhotoSrc;
            // 선택된 파일이 있다면 그것도 삭제
            profilePhotoInput.value = ''; 
        }
    });

    // 수정하기 버튼 클릭 시
    editButton.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim();
        
        // 닉네임 유효성 검사
        if (!nickname) {
            helperText.textContent = '*닉네임을 입력해주세요.';
            helperText.style.display = 'block';
            return;
        } else if (nickname.length > 10) {
            helperText.textContent = '*닉네임은 최대 10자까지 작성 가능합니다.';
            helperText.style.display = 'block';
            return;
        } else {
            // 서버와 통신하여 닉네임 중복 체크
            fetch(`${BACKEND_URL}/api/users/nickname/check?nickname=${encodeURIComponent(nickname)}`, {
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
            .then((data) => {
                showToast('수정 완료!');
                if (data.profile_image_path) {
                    // 새 프로필 사진 업로드
                    currentProfilePhoto.src = data.profile_image_path;
                }

                // 수정 완료 후 게시글 페이지로 이동
                setTimeout(() => {
                    window.location.href = '/posts'; // 게시글 페이지 경로로 리다이렉트
                }, 1500); // 토스트 메시지가 표시된 후 약간의 딜레이
            })
            .catch((error) => console.error('회원정보 수정 실패:', error));
    });

    function decodeJWT(token) {
        // JWT 토큰을 디코딩하여 유저 정보를 추출하는 함수
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        try {
            const decoded = JSON.parse(window.atob(base64));
            return decoded;
        } catch (error) {
            console.error('JWT 디코딩 오류:', error);
            return null;
        }
    }

    // 로그인된 사용자의 ID를 JWT 토큰에서 추출하는 함수
    function getLoggedInUserId() {
        const token = localStorage.getItem('authToken'); 
        if (token) {
            const decodedToken = decodeJWT(token);  
            return decodedToken?.user_id; 
        }
        console.error('JWT 토큰이 없거나 유효하지 않습니다.');
        return null;  
    }

    // 토스트 메시지
    function showToast(message) {
        toast.textContent = message; 
        toast.classList.add('show'); 

        setTimeout(() => {
            toast.classList.remove('show');
        }, 1000); 
    }
});