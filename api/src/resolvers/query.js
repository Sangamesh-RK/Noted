module.exports = {
  notes: async (parent, args, { models }) => {
    return await models.Note.find();
  },
  note: async (parent, args, { models }) => {
    return await models.Note.findById(args.id);
  },
  user: async (parent, { username }, { models }) => {
    return await models.User.findOne({ username });
  },
  users: async (parent, args, { models }) => {
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) => {
    return await models.User.findById(user.id);
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    //hard coded limit
    const limit = 10;
    //flag for next page, default: false
    let hasNextPage = false;
    //if cursor is empty , query will be empty by default
    let cursorQuery = {};

    // if there is cursor query will find objects less than cursor
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }
    //find limit + 1 notes from db and sort it by newest
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);
    // if we have more than limit notes set hasNextPage to true and extra note becomes the cursor
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }
    const newCursor = notes[notes.length - 1]._id;

    return { notes, cursor: newCursor, hasNextPage };
  }
};
