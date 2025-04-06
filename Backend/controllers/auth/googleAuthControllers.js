const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.googleLogin = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/" }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ msg: "Google authentication failed" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    // Set token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    // Redirect to the frontend dashboard
    res.redirect("http://localhost:5173/dashboard");
  })(req, res, next);
};
