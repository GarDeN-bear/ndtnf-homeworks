import * as passport from "passport";
import * as LocalStrategy from "passport-local";

import myContainer from "../../containers/container"
import UsersRepository from "../../repositories/users.repository";
import User from "../../interfaces/user.interface";

const repo = myContainer.get(UsersRepository);

const verify = async (username, password, done) => {
  try {

    const user = await repo.getUserByUsername(username);

    if (!user) {
      return done(null, false);
    }
    if (!user.verifyPassword(password)) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
      return done(error);
  }
};

const options = {
  usernameField: "username",
  passwordField: "password",
};

passport.use("local", new LocalStrategy(options, verify));

passport.serializeUser((user: User, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id: string, cb) => {
  try {
    const user = await repo.getUser(id);
    cb(null, user);
  } catch (error) {
      return cb(error);
  }
  }
);


export default passport;
