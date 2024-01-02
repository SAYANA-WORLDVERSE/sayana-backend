import mongoose from "mongoose";
const contactDetails = mongoose.Schema({
  location: String,
  number: Number,
  email: String,
  social_links: [
    {
      platform: String,

      link: String,
    },
  ],
  file: String,
});
const Contact = mongoose.model("ContactDetail", contactDetails);
export default Contact;
