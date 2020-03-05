if (process.env.NODE_ENV == "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://root:root@cpd-0rrdv.gcp.mongodb.net/test?retryWrites=true&w=majority"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/homecpd" };
}
//mongodb://localhost/blogapp