const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 정적 파일 제공 (CSS, 이미지, 폰트, JS 등)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// 각 HTML 파일을 요청에 맞게 응답하는 경로 설정
app.get('/log-in', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'log-in.html'));  // 로그인 페이지
});

app.get('/sign-in', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'sign-in.html'));  // 회원가입 페이지
});

app.get('/posts', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'posts.html'));  // 게시글 목록 페이지
});

app.get('/post/:postId', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'post.html'));  // 게시글 상세 페이지
});

app.get('/post/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'make-post.html'));  // 게시글 작성 페이지
});

app.get('/post/edit/:postId', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'edit-post.html'));  // 게시글 수정 페이지
});

app.get('/edit-profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'edit-profile.html'));  // 프로필 수정 페이지
});

app.get('/edit-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'edit-password.html'));  // 비밀번호 변경 페이지
});

// 기본 페이지 (로그인 페이지로 리다이렉트)
app.get('/', (req, res) => {
  res.redirect('/log-in');  // 기본적으로 로그인 페이지로 리다이렉트
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중 입니다.`);
});
