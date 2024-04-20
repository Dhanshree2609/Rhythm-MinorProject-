const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname)));

app.get("/singers", (req, res) => {
  fs.readdir("./songs", (err, singers) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(singers);
    }
  });
});

app.get("/songs/:singer", (req, res) => {
  const singerPath = `./songs/${req.params.singer}`;
  fs.readdir(singerPath, (err, songs) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const infoPath = path.join(singerPath, "info.json");
      fs.readFile(infoPath, "utf8", (err, info) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send({ songs, info: JSON.parse(info) });
        }
      });
    }
  });
});

app.get("/song/:singer/:song", (req, res) => {
  fs.readFile(
    `./songs/${req.params.singer}/${req.params.song}/details.json`,
    "utf8",
    (err, details) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(details);
      }
    }
  );
});

app.get("/allsongs", (req, res) => {
  fs.readdir("./songs", (err, singers) => {
    if (err) {
      res.status(500).send(err);
    } else {
      Promise.all(
        singers.map((singer) => {
          return new Promise((resolve, reject) => {
            const singerPath = `./songs/${singer}`;
            fs.readdir(singerPath, (err, songs) => {
              if (err) {
                reject(err);
              } else {
                songs = songs.filter(
                  (song) => song !== "info.json" && song !== `${singer}.html`
                );
                Promise.all(
                  songs.map((song) => {
                    return new Promise((resolve, reject) => {
                      const songPath = path.join(singerPath, song);
                      fs.readFile(
                        path.join(songPath, "details.json"),
                        "utf8",
                        (err, details) => {
                          if (err) {
                            reject(err);
                          } else {
                            resolve({
                              singer,
                              song,
                              details: JSON.parse(details),
                              thumbnail: path.join(songPath, "thumbnail.png"),
                              mp3: path.join(songPath, "song.mp3"),
                            });
                          }
                        }
                      );
                    });
                  })
                )
                  .then(resolve)
                  .catch(reject);
              }
            });
          });
        })
      )
        .then((allSongs) => {
          res.send(allSongs.flat());
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    }
  });
});

app.get("/artists", (req, res) => {
  res.sendFile(path.join(__dirname, "artists.html"));
});

app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "search.html"));
});

// Manually adding a route for each singer is not a good idea
// app.get("/Arijit_Singh", (req, res) => {
//   res.sendFile(path.join(__dirname, "Arijit_Singh.html"));
// });

// how about we create a custom pages router,
// so that we can create any number of pages, without writing a new route for each page

app.get("/:singer", (req, res) => {
  const singerPath = path.join(
    __dirname,
    "songs",
    req.params.singer,
    `${req.params.singer}.html`
  );
  fs.readFile(singerPath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.sendFile(path.join(__dirname, "assets", "errors", "404.png"));
      } else {
        res.status(500).send(err);
      }
    } else {
      res.send(data);
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
