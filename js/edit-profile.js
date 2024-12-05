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

    // 이메일 기본값 설정 (이미 이메일이 있을 경우, 해당 이메일을 설정)
    // 이 이메일은 서버에서 가져온 현재 사용자의 이메일이어야 합니다.
    // 예시: fetch('/api/get-email')
    //emailArea.textContent = 'startupcode@gmail.com'; 

    // 프로필 이미지 초기 설정
    // 서버에서 이미지를 가져와서 초기 프로필 사진을 설정해야 함
    // 예시: fetch('/api/get-profile-image')

    // 프로필 이미지 클릭 시
    profileImg.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    // 드롭 다운 메뉴 항목 클릭 시
    dropdownMenu.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'A') {
            event.preventDefault(); 

            // 실제 데이터 fetch 후 활성화 예정
            // const postId = postContainer.dataset.postId;
    
            if (target.id === 'profile-link') {
                window.location.href = '/users/{postId}/profile';  
            } else if (target.id === 'password-link') {
                window.location.href = '/users/{postId}/password';  // 비밀번호수정 페이지로 이동
            } else if (target.id === 'logout-link') {
                window.location.href = '/sessions/new';  // 로그아웃 페이지로 이동
            }
        }
    });

    let originalProfilePhotoSrc = currentProfilePhoto.src; 

    // 프로필 사진 변경
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

    // 닉네임 입력 시
    nicknameInput.addEventListener('input', () => {

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
            // 닉네임 중복 체크 (fetch 필요)
            // 예시:
            // fetch('/api/check-nickname', {}
            //helperText.textContent = '*중복된 닉네임입니다.';
            //helperText.style.display = 'block';

            helperText.textContent = '';
            showToast('수정 완료!');
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
        // 회원 탈퇴 API 호출 (fetch 필요)
        // 예시:
        // fetch('/api/delete-account', { method: 'DELETE' })

        window.location.href = '/login';
    });

    // 수정 완료 버튼 클릭 시
    saveButton.addEventListener('click', () => {
        // 프로필 사진, 닉네임, 이메일 등 수정 완료 후 처리 (fetch 필요)
        // 예시:
        // fetch('/api/update-profile', {
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