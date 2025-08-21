
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    link: { type: String, default: "" }, 
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
