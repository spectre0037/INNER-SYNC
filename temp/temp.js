import bcrypt from 'bcrypt';

async function hashAdminPassword() {
  const password = 'addmin123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
}

hashAdminPassword();
// Copy the resulting long hash (e.g., $2b$10$....................)