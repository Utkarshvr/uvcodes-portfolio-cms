import { Cloudinary } from "@cloudinary/url-gen";
// Cloudinary configuration
const cld = new Cloudinary({
  cloud: {
    cloudName: "uv-codes",
  },
});

export default cld;
