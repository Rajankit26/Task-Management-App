import {Router} from "express"
import { protect } from "../middlewares/authMiddleware.js"
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/authController.js"
import { upload } from "../middlewares/uploadMiddleware.js"
const router = Router()

// Auth Routes
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)

router.post("/upload-image",upload.single("image"), (req, res) => {
    if(!req.file){
        return res.status(400).json({
            message : "No file uploaded"
        })
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    res.status(200).json({
        imageUrl
    })
})

export default router;