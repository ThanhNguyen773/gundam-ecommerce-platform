import dialogflow from "@google-cloud/dialogflow";
import Product from "../models/product.model.js";
import { readFileSync } from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;
if (!credentialsPath) {
  throw new Error("GOOGLE_CREDENTIALS_PATH is not defined in .env");
}
const CREDENTIALS = JSON.parse(readFileSync(path.resolve(credentialsPath)));


const projectId = CREDENTIALS.project_id;
const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key,
  },
});

export const detectIntent = async (text, sessionId = "user-session") => {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: "vi", 
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;

  const intent = result.intent?.displayName;
  let responseText = result.fulfillmentText;
  let productData = null;

 
  if (intent === "show_best_seller") {
    const bestProduct = await Product.findOne({ isActive: true })
      .sort({ sold: -1 })
      .lean();
    if (bestProduct) {
      responseText = `🔥 Sản phẩm bán chạy nhất là **${
        bestProduct.name
      }**, giá chỉ $${bestProduct.price.toFixed(2)}.`;
      productData = {
        name: bestProduct.name,
        price: bestProduct.price,
        image: bestProduct.image, 
        link: `/products/${bestProduct._id}`, 
      };
    } else {
      responseText = "Hiện chưa có sản phẩm nào được bán.";
    }
  }


  else if (intent === "suggest_random_product") {
    const count = await Product.countDocuments({ isActive: true });
    const rand = Math.floor(Math.random() * count);
    const randomProduct = await Product.findOne({ isActive: true })
      .skip(rand)
      .lean();

    if (randomProduct) {
      responseText = `🤖 Gợi ý cho bạn: **${
        randomProduct.name
      }**, giá chỉ $${randomProduct.price.toLocaleString()}.`;
      productData = {
        name: randomProduct.name,
        price: randomProduct.price,
        image: randomProduct.image, 
        link: `/products/${randomProduct._id}`, 
      };
    } else {
      responseText = "Không tìm thấy sản phẩm nào để gợi ý.";
    }
  }

  return {
    query: result.queryText,
    intent,
    response: responseText,
    product: productData, 
  };
};
