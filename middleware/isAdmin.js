function isAdmin(req , res , next){
    if(!req.user.isAdmin){
        res.status(403).send("Access denied , is not admin !! forbiden")
        return
    }
    next()
}

module.exports = isAdmin;