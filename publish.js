const ghpages = require('gh-pages');

ghpages.publish('dist', (err) => {
  console.log(err || "published sucessfuly");
});
