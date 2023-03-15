import { STRINGS } from '#config/strings';
import path from "path";
import fs from "fs";

const MANIFEST_PATH = path.resolve('./dist/manifest.json');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

const isDev = process.env.NODE_ENV !== "production";

export function render(path, data) {

  return (req, res) => {

    data.siteName = STRINGS['SITE_NAME'];

    const errors = req.flash('error');

    if (data && errors) {

      data.errors = errors
    }

    data.username = req.user?.username;

    data.isDev = isDev;
    data.manifest = manifest;

    res.render(path, data)
  }
}

export function logout(req, res, next) {

  req.logout(function (err) {

    if (err) {

      return next(err);
    }

    res.redirect('/');
  });
}

export const redirect = {

  at(route) {

    return (_, res) => {

      res.redirect(route);
    };
  },

  get unSerializedUsers() {

    return this.atCondition(req => !req?.user);
  },

  get loggedUsers() {

    return this.atCondition(req => req.user?.isLoggedIn);
  },

  get unLoggedUsers() {

    return this.atCondition(req => !req.user?.isLoggedIn);
  },

  atCondition(condition) {

    return {

      at(route) {

        return (req, res, next) => {

          if (condition(req)) {

            res.redirect(route);

          } else {

            next();
          }
        };
      }
    }
  },
}