const express = require("express");

const wooordhunt = require("sata-wooordhunt").default;
const WooordhuntAPI = require("@vviital/wooordhunter-api");

const options = { apiUri: "https://wooordhunt.ru" };
const WooordhuntDic = new WooordhuntAPI(options);

const router = express.Router();

const db = require("../keys/keys").APIs.fireDB;
const urbanDic = require("../keys/keys").APIs.urbanDic;
const oxfordDic = require("../keys/keys").APIs.oxfordDic;
const pixabay = require("../keys/keys").APIs.pixabay;
const yandTrans = require("../keys/keys").APIs.yandTrans;
const yandDic = require("../keys/keys").APIs.yandDic;
const googleDic = require("../keys/keys").APIs.googleDic;
const merriamWebsterDic = require("../keys/keys").APIs.merriamWebsterDic;
const UrbanDicFree = require("../keys/keys").APIs.UrbanDicFree;
const wordApiDic = require("../keys/keys").APIs.wordApiDic;
const linguaRobotDic = require("../keys/keys").APIs.linguaRobotDic;
const unsplash = require("../keys/keys").APIs.unsplash;
const randomWords = require("../keys/keys").APIs.randomWords;
// var randomWordsData = require("../keys/randomWords.json");

// db.collection('words').doc('randomWords').set(randomWordsData);
// randomWordsData.data.forEach(obj=>{
//   obj.random = Math.floor(Math.random() * Math.floor(2000))
//   db.collection('randomWords').add(obj)
// })

router.get("/user", async (req, res) => {
  const result = [];
  const users = await db
    .collection("users")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        result.push({ id, data });
      });
      return result;
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
  res.send(users);
});

//login Authentication
router.post("/user/login", async (req, res) => {
  console.log(req);
  await db
    .collection("users")
    .where("username", "==", req.body.user)
    .where("password", "==", req.body.pass)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        res.status(200).send({ isMatch: false });
      } else {
        snapshot.forEach((doc) => {
          res.status(200).send({ isMatch: true, user: doc.data().username });
        });
      }
    });
});

//User exists
router.post("/user/exist", async (req, res) => {
  await db
    .collection("users")
    .where("username", "==", req.body.user)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        res.status(200).send({ exists: false });
        console.log("No matching documents.");
        return;
      }
      res.status(200).send({ exists: true });
    });
});

//register user
router.post("/user", async (req, res) => {
  await db
    .collection("users")
    .doc(req.body.username)
    .set({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      createdAt: new Date(),
    })
    .then((ref) => {
      res.status(201).send();
    })
    .catch((err) => {
      res.status(404).send();
      console.log("Error getting documents", err);
    });
});
//

//get random words from firebase
router.get("/firebase-randword/:randnum/:size", async (req, res) => {
  db.collection("randomWords")
    .where("random", ">=", parseInt(req.params.randnum))
    .limit(parseInt(req.params.size))
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        res.status(200).send({ exists: false, data: null });
        console.log("No matching documents.");
        return;
      }
      const data = []
      snapshot.forEach((doc) => {
        //save data from base
        data.push(doc.data())
      });
      res.status(200).send({ exists: true, data: data });
    });
});

// Access urban dictionary
router.get("/urban-dic/:word", async (req, res) => {
  await urbanDic
    .get("define", {
      params: {
        term: req.params.word,
      },
    })
    .then((value) => {
      res.send(value.data);
    })
    .catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

// Access random words dictionary
router.get("/random-words/:number", async (req, res) => {
  await randomWords
    .get("", {
      params: {
        number: req.params.number,
      },
    })
    .then((value) => {
      res.send(value.data);
    })
    .catch((e) => {
      console.log(e);
      res.status(404).send();
    });
});

//find word details from woooordhunt for
router.get("/wordhunt-dic-1/:word", async (req, res) => {
  // .fetchTips('дом')
  await WooordhuntDic.fetchWordTranslation(encodeURI(req.params.word))
    .then((data) => {
      // console.log(data);
      res.send(data);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
});

//find word details from woooordhunt for
router.get("/wordhunt-dic-2/:word", async (req, res) => {
  await wooordhunt(encodeURI(req.params.word))
    .then((data) => {
      // console.log(data);
      res.send(data);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
});

//find word details from oxford
router.get("/oxford-dic/:word", async (req, res) => {
  await oxfordDic
    .get("/api/v2/entries/en-gb/" + req.params.word)
    .then((data) => {
      // console.log(data);
      res.send(data.data);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
});

//find word details from wordAPI
router.get("/wordapi-dic/:word", async (req, res) => {
  await wordApiDic
    .get(req.params.word)
    .then((data) => {
      // console.log(data);
      res.send(data.data);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
});

//find word details from linguarobot
router.get("/linguarobot-dic/:word", async (req, res) => {
  await linguaRobotDic
    .get(req.params.word)
    .then((data) => {
      // console.log(data);
      res.send(data.data);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
});

//find if word exists from oxford
router.get("/oxford-dic-exists/:word", async (req, res) => {
  await oxfordDic
    .get("/api/v2/lemmas/en/" + req.params.word)
    .then((data) => {
      res.send({ data: data.data, error: false });
    })
    .catch((e) => {
      res.send({ data: e, error: true });
    });
});

// for geting pics from pixabay
router.get("/pixabay/:word", async (req, res) => {
  await pixabay
    .get("", {
      params: { q: req.params.word },
    })
    .then((data) => {
      // console.log(data);
      res.send(data.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// for geting pics from unsplash
router.get("/unsplash/:word", async (req, res) => {
  await unsplash
    .get("", {
      params: { query: req.params.word, page: 1, per_page: 1, orientation: 'landscape' },
    })
    .then((data) => {
      // console.log(data);
      res.send(data.data.results[0].urls.small);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/yandex-translate/:word", async (req, res) => {
  await yandTrans
    .get("", {
      params: { text: req.params.word, ui: "en" },
    })
    .then((data) => {
      // console.log(data);
      res.send(data.data);
    })
    .catch((err) => console.log(err));
});

router.get("/yandex-dic/:lang/:text", async (req, res) => {
  yandDic
    .get("", {
      params: { lang: req.params.lang, text: req.params.text, flags: 0x0004 },
    })
    .then((data) => {
      if (data.data.def.length) {
        res.send({ data: data.data.def, error: false });
      } else {
        res.send({ data: data.data.def, error: true });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ data: e, error: true });
    });
});

router.get("/google-dic/:word", async (req, res) => {
  await googleDic
    .get(req.params.word)
    .then((data) => {
      res.send(data.data);
    })
    .catch((err) => {
      console.log(err.message);
      res.send(err.response.data);
    });
});

router.get("/merriam-webster-dic/:word", async (req, res) => {
  await merriamWebsterDic
    .get(req.params.word, {
      params: { key: merriamWebsterDic.defaults.params.key },
    })
    .then((data) => {
      res.send(data.data);
    })
    .catch((err) => {
      console.log(err.message);
      res.send(err.response.data);
    });
});

//urban dictionary api
router.get("/urbanfree-dic/:word", async (req, res) => {
  await UrbanDicFree.get("", {
    params: {
      term: req.params.word,
    },
  })
    .then((data) => {
      res.send(data.data);
    })
    .catch((err) => {
      console.log(err);
      res.send(err.response.data);
    });
});

//delete user
router.delete("/user/:id", async (req, res) => {
  const users = await db.collection("users").doc(req.params.id).delete();
  res.status(200).send();
});

module.exports = router;
