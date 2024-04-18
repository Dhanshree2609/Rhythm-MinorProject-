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
                songs = songs.filter((song) => song !== "info.json");
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

app.get("/artist", (req, res) => {
  res.sendFile(path.join(__dirname, "artist.html"));
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
