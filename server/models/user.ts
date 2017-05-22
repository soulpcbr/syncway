
class User extends Model {
  username: String;
  email: { type: String, unique: true, lowercase: true, trim: true };
  password: String;
  role: String;
}

export default User;
