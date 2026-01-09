const Message = require("../models/Message");
const path = require("path");
const uuid = require("uuid");

class Utils {
  fileTypes = {
    image: "image",
    video: "video",
    audio: "audio",
  };
  generateFileName(file) {
    return uuid.v4() + `${path.extname(file.name)}`;
  }

  getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  processAudio(files) {
    if (Object.keys(files).length !== 0 && files.audio) {
      const audio = files.audio;
      const filename = this.generateFileName(audio);
      audio.mv(
        path.resolve(
          "..",
          "static",
          `message-${this.fileTypes.audio}s`,
          filename
        )
      );
      return [filename];
    } else {
      return "";
    }
  }

  processFiles(files, type) {
    const keys = Object.keys(files);
    return keys.length !== 0
      ? keys.some((key) => key.includes(type))
        ? keys
            .filter((key) => key.includes(type))
            .map((key) => {
              const file = files[key];
              const filename = this.generateFileName(file);
              file.mv(
                path.resolve("..", "static", `message-${type}s`, filename)
              );
              return filename;
            })
        : []
      : [];
  }

  async filterMessages(room) {
    const messages = await Message.find({ room });
    return messages
      .filter(
        (v, i, a) =>
          a.findIndex(
            (t) =>
              t.message === v.message &&
              t.date === v.date &&
              t.images[0] === v.images[0] &&
              t.videos[0] === v.videos[0]
          ) === i
      )
      .reverse();
  }

  getMessagesPortion(page, offset) {
    const pageNumber = parseInt(page) || 1;
    const offsetNumber = parseInt(offset) || 0;
    const perPage = 10;
    const startIndex = (pageNumber - 1) * perPage + offsetNumber;
    const endIndex = pageNumber * perPage + offsetNumber;
    return { startIndex, endIndex };
  }

  async sendMessages(res, user, room, page, offset, type) {
    const filtered = await this.filterMessages(room);
    const { startIndex, endIndex } = this.getMessagesPortion(page, offset);
    const results = filtered.slice(startIndex, endIndex).reverse();
    res.write(
      `data: ${JSON.stringify({
        messages: results,
        count: filtered.length,
        canLoad: !(endIndex >= filtered.length),
        user,
        type,
      })} \n\n`
    );
  }

  async dm(
    req,
    res,
    text,
    date,
    images,
    videos,
    messageCopy,
    emitter,
    isGroup
  ) {
    const message = await Message.findOneAndDelete({
      message: text,
      date,
      images,
      videos,
    });
    if (message) {
      this.dm(
        req,
        res,
        text,
        date,
        images,
        videos,
        messageCopy,
        emitter,
        isGroup
      );
    } else {
      emitter.emit(
        isGroup ? "groupDeleteMessage" : "deleteMessage",
        messageCopy
      );
      res.json({ id: req.params.id });
    }
  }

  async edit(
    req,
    res,
    oldText,
    date,
    newText,
    oldImages,
    oldVideos,
    newImages,
    newVideos,
    emitter,
    isGroup
  ) {
    const message = await Message.findOneAndUpdate(
      {
        images: { $eq: oldImages },
        videos: { $eq: oldVideos },
        date,
        message: oldText,
      },
      { $set: { images: newImages, videos: newVideos, message: newText } },
      { new: true }
    );
    if (message) {
      this.edit(
        req,
        res,
        oldText,
        date,
        newText,
        oldImages,
        oldVideos,
        newImages,
        newVideos,
        emitter,
        isGroup
      );
    } else {
      const updatedMessage = await Message.findOne({
        images: { $eq: newImages },
        videos: { $eq: newVideos },
        date,
        message: newText,
      });
      emitter.emit(
        isGroup ? "groupEditMessage" : "editMessage",
        updatedMessage,
        oldText,
        oldImages,
        oldVideos
      );
      res.json({ id: req.params.id });
    }
  }
}

module.exports = new Utils();
