// userModel.test.js
import { User } from '../../models/User';  // Adjust path if necessary
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  it('should create a user and hash the password', async () => {
    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'user',
    };

    const user = await User.create(userData);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe(userData.role);
    expect(user.password).not.toBe(userData.password);  // Password should be hashed

    const isMatch = await bcrypt.compare(userData.password, user.password);
    expect(isMatch).toBe(true);
  });

  it('should not allow duplicate email', async () => {
    const userData = {
      name: 'Test User 2',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'user',
    };

    await User.create(userData);

    // Try creating a user with the same email
    await expect(User.create(userData)).rejects.toThrowError(
      new Error('Validation error: Email must be unique')
    );
  });
});
