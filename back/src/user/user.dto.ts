// src/user/user.dto.ts
export class UserDto {
  _id: string;
  username: string;
  isAdmin: boolean;
  level: number;
  dates: {
    created_at: Date | null;
    last_login: Date | null;
    deleted_at: Date | null;
  };

  constructor(user: any) {
    this._id = user._id;
    this.username = user.username;
    this.isAdmin = user.isAdmin;
    this.level = user.level;
    this.dates = {
      created_at: user.created_at,
      last_login: user.last_login,
      deleted_at: user.deleted_at,
    };
  }
}
