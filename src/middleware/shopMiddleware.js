const shopMiddleware = {
    checkRegisterShop: async (req,res,next)=> {
        try{
            const {name,email,phone} = req.body;
            if(!name || !phone){
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