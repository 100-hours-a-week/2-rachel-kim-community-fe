const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 정적 파일 제공 (CSS, 이미지, 폰트 등)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// 각 HTML 파일을 요청에 맞게 응답하는 경로 설정
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'login.html'));  // 로그인 페이지
});

app.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'sign-up.html'));  // 회원가입 페이지
});

app.get('/edit-profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'edit-profile.html'));  // 프로필 수정 페이지
});

app.get('/edit-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'edit-password.html'));  // 비밀번호 변경 페이지
});

app.get('/post-create', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'post-create.html'));  // 게시글 작성 페이지
});

app.get('/post-detail', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'post-detail.html'));  // 게시글 상세 페이지
});

app.get('/post-edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'post-edit.html'));  // 게시글 수정 페이지
});

app.get('/post-list', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'post-list.html'));  // 게시글 목록 페이지
});

// 기본 페이지 (로그인 페이지로 리다이렉트)
app.get('/', (req, res) => {
  res.redirect('/login');  // 기본적으로 로그인 페이지로 리다이렉트
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중 입니다.`);
});
