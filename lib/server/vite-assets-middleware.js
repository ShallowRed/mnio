import path from "path";
import fs from "fs";

const MANIFEST_PATH = path.resolve('./dist/manifest.json');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

const config = {
  mode: (process.env.NODE_ENV === "production" ? "production" : "development"),
  vitePort: 5173,
};

export default function() {

  return (req, res, next) => {

    if (config.mode === "production") {
      const manifestEntry = manifest[`scripts${req.path}`];
      if (manifestEntry) {
        const newPath = `/${manifestEntry.file}`
        res.redirect(newPath);
        return;
      } else {
        next();
      }
    } else {
      const url = `http://localhost:${config.vitePort}/scripts${req.path}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            return next();
          }

          res.redirect(response.url);
        })
        .catch((error) => {
          console.error(error);
          next();
        });
    }
  }
}