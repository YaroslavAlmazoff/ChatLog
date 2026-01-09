const { Router } = require("express");
const PublicService = require("../services/PublicService");
const router = Router();

const auth = require("../middleware/auth.middleware");

router.get("/all-publics", auth, (req, res) => {
  try {
    PublicService.all(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/publics", (req, res) => {
  try {
    PublicService.publics(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/create", auth, (req, res) => {
  try {
    PublicService.create(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit/:id", auth, (req, res) => {
  try {
    PublicService.edit(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/createfoto/:id", (req, res) => {
  try {
    PublicService.createFoto(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/createpost/:id", auth, (req, res) => {
  try {
    PublicService.createPost(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.delete("/deletepost/:id", (req, res) => {
  try {
    PublicService.deletePost(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/public/:id", (req, res) => {
  try {
    PublicService.public(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/firstfotos/:id", (req, res) => {
  try {
    PublicService.firstFotos(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/allfotos/:id", (req, res) => {
  try {
    PublicService.allfotos(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/posts/:id", auth, (req, res) => {
  try {
    PublicService.posts(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/posts-mobile/:id/:user", (req, res) => {
  try {
    PublicService.postsMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/post/:id", (req, res) => {
  try {
    PublicService.post(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/firstsubscribers/:id", (req, res) => {
  try {
    PublicService.firstSubscribers(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/allsubscribers/:id", (req, res) => {
  try {
    PublicService.allSubscribers(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/subscribers/:id", (req, res) => {
  try {
    PublicService.subscribers(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/subscribe/:id", auth, (req, res) => {
  try {
    PublicService.subscribe(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/subscribes/:id", (req, res) => {
  try {
    PublicService.subscribes(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/3-subscribes/:id", (req, res) => {
  try {
    PublicService.get3Subscribes(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/subscribe-list-mobile/:id/:subscribed", auth, (req, res) => {
  try {
    PublicService.subscribeListMobile(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/issubscriber/:id", auth, (req, res) => {
  try {
    PublicService.isSubscriber(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/posthead/:id", (req, res) => {
  try {
    PublicService.postHead(req, res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/likepost/:id/:pub", auth, (req, res) => {
  try {
    PublicService.likePost(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/likecomment/:id", auth, (req, res) => {
  try {
    PublicService.likeComment(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/comments/:id", (req, res) => {
  try {
    PublicService.comments(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/comment/:id", auth, (req, res) => {
  try {
    PublicService.comment(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.get("/notifications/:id", (req, res) => {
  try {
    PublicService.getNotifications(req, res);
  } catch (e) {
    console.log(e);
  }
});
router.post("/notify/:post/:public", auth, (req, res) => {
  try {
    PublicService.notify(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
