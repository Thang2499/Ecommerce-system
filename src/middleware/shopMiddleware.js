const shopMiddleware = {
    checkRegisterShop: async (req,res,next)=> {
        try{
            const {shopName,email,phoneNumber,des} = req.body;
            if(!shopName || !phoneNumber){
                return res.status(400).send('điền đầy đủ thông tin đăng ký')
            }
            next();
        }catch(err){
            res.status(400).send({
                message : err.message
            })
        }
    }
}
export default shopMiddleware;