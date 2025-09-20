const { Router } = require("express");
const jwt = require("jsonwebtoken");
 
const router = Router();
 
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
 
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
 
function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) return res.sendStatus(403);
    next();
  };
}
 
router.get("/", authenticateToken, (req, res) => {
  res.json({
    message: "This is a protected route",
    userId: req.user.userId,
    role: req.user.role,
  });
});
 
router.get(
  "/admin",
  authenticateToken,
  authorizeRole(["admin"]),
  (req, res) => {
    res.json({ message: "Admin only endpoint", userId: req.user.userId });
  }
);
 
module.exports = router;