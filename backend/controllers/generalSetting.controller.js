import GeneralSetting from "../models/generalSetting.model.js";
import cloudinary from "../lib/cloudinary.js";
import Joi from "joi";


const uploadToCloudinary = (buffer, folder = "logos") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

const generalSettingSchema = Joi.object({
  storeName: Joi.string().trim().required(),
  aboutUs: Joi.string().trim().allow(""),
  facebook: Joi.string().uri().allow(""),
  instagram: Joi.string().uri().allow(""),
  linkedin: Joi.string().uri().allow(""),
  youtube: Joi.string().uri().allow(""),
  isActive: Joi.boolean().truthy("true").falsy("false").required(),
  message: Joi.string().trim().allow(""),
  theme: Joi.object({
    primaryColor: Joi.string().allow(""),
    secondaryColor: Joi.string().allow(""),
    logoDark: Joi.string().allow(""),
    favicon: Joi.string().allow(""),
  }).optional(),
});
const parseBoolean = (val) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val.toLowerCase() === "true";
  return false;
};


export const getGeneralSetting = async (req, res) => {
  try {
    const setting = await GeneralSetting.findOne();
    if (!setting) {
      return res.status(404).json({ message: "No configuration information yet" });
    }
    res.json(setting);
  } catch (err) {
    console.error("❌ Error getting configuration:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateGeneralSetting = async (req, res) => {
  try {
    const { error, value } = generalSettingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    let logoUrl = null;
    if (req.file && req.file.buffer) {
      
      logoUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updatePayload = {
      storeName: value.storeName,
      aboutUs: value.aboutUs,
      socialLinks: {
        facebook: value.facebook || "",
        instagram: value.instagram || "",
        linkedin: value.linkedin || "",
        youtube: value.youtube || "",
      },
      maintenanceMode: {
        isActive: parseBoolean(value.isActive),
        message: value.message || "",
      },
      updatedBy: req.user?._id || null,
      ...(value.theme && { theme: value.theme }),
      ...(logoUrl && { logo: logoUrl }),
    };

    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    const setting = await GeneralSetting.findOneAndUpdate({}, updatePayload, options);

    return res.json({ message: "Configuration update successful", setting });
  } catch (err) {
    console.error("❌ Error getting configuration:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

