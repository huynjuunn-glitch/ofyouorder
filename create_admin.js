// localStorage에 어드민 계정 생성
const users = JSON.parse(localStorage.getItem('cake_manager_users') || '[]');
const adminUser = {
  email: 'ofyou',
  password: 'qkrrk1212!'
};

// 이미 존재하는지 확인
const existingUser = users.find(user => user.email === 'ofyou');
if (!existingUser) {
  users.push(adminUser);
  localStorage.setItem('cake_manager_users', JSON.stringify(users));
  console.log('어드민 계정이 성공적으로 생성되었습니다!');
} else {
  console.log('이미 존재하는 계정입니다.');
}
