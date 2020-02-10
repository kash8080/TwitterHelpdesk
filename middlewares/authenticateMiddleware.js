module.exports=function(req, res, next){
  if (!req.user) {
    console.log("not authenticated");
    return res.redirect("/auth/login");
  } else {
    //console.log(" authenticated");
    return next();
  }
}