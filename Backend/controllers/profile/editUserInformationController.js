const User = require("../../models/model/User");
exports.editUseName = async (req, res) => {
  try {
    const UserId = req.user.id;
    if (!UserId) {
      return res.status(401).json({ msg: "unauthorized access" });
    }
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ msg: "Username is required" });
    }
    let user = await User.findById(UserId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.username = username;
    await user.save();
    res.json({ msg: "Username updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
};
exports.editUserProfilePicture= async(req,res)=>{
    try{
        console.log("profile picture upload logic not implemented yet");
        console.log('req.file',req.file);
    }
    catch(err){

    }
}