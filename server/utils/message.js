var moment = require('moment');

var generateMessage = (id,from, text,createdAt) => {
  return {
    id,
    from,
    text,
    createdAt
  };
};


module.exports = {generateMessage};
