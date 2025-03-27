import {v2 as cloudinary} from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
    cloud_name:process.env.CLOUDNARNAME,
    api_key:process.env.CLOUDNARYAPI,
    api_secret:process.env.CLOUDNARYAPISECRET
})

export default cloudinary;