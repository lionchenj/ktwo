import { ServiceBase } from "./ServiceBase";
import { UserStorage } from "../storage/UserStorage";
import { model } from "../model/model";

export class UserService extends ServiceBase {

    private static  _instance: UserService
    public static get Instance(): UserService {
        return this._instance || (this._instance = new this())
    }

    private constructor() {
        super()
    }

    public isLogined(): boolean {
        if (ServiceBase.length > 0) {
            return true
        }
        const accessToken = UserStorage.getAccessToken()
        if (accessToken) {
            ServiceBase.accessToken = accessToken
            return true
        }
        return false
    }

    public async getMobileMassges(mobile: string): Promise<void> {
        const params = {
            mobile: mobile
        }
        return await this.httpPost("get_mobile_massges", params, false)
        
    }

    public async register(mobile: string, code: string, shareMobile: string, password: string, register_code:string): Promise<void> {
        const params = {
            mobile: mobile,
            password: password,
            verification_code: code,
            referee: shareMobile,
            register_code: register_code
        }
        return await this.httpPost("register", params, false)
    }

    public async login(mobile: string, password: string, activation_code?: string): Promise<void> {
        const params = {
            mobile: mobile,
            password: password,
            activation_code: activation_code
        }
        const resp = await this.httpPost("login", params, false)
        const accessToken = resp.data.access_token
        ServiceBase.accessToken = accessToken
        UserStorage.saveAccessToken(accessToken)
    }

    public logout() {
        ServiceBase.accessToken = ""
        UserStorage.clearAccessToken()
    }

    public async getUserInfo(): Promise<model.User> {
        const resp = await this.httpPost("getUserInfo")
        if(resp.data){
            return resp.data as model.User
        }else{
            return resp
        }
    }

    public async updatePassword(mobile: string, code: string, password: string, repassword:string): Promise<void> {
        const params = {
            mobile: mobile,
            password: password,
            verification_code: code,
            repassword: repassword
        }
        return await this.httpPost("retrievePassword", params, false)
    }

    //轮播
    public async banner(): Promise<any> {
        return await this.httpPost("banner")
    }
    

    public async feedback(content: string, imagesList: Array<File>): Promise<void> {
        const imagePathList = new Array<string>()
        for (const imageFile of imagesList) {
            const path = await this.uploadFile(imageFile)
            imagePathList.push(path)
        }

        const params = {
            content: content,
            imagesList: imagePathList.join(",")
        }
        return await this.httpPost("feedback", params)
    }

    public async uploadFile(file: File): Promise<string> {
        const resp = await this.httpUpload(file)
        console.log("uploadFile", resp)
        return resp.data.data.path as string
    }

    public async getPurseAddress(): Promise<model.PurseAddress> {
        const resp = await this.httpPost("getPurseAddress")
        return resp.data as model.PurseAddress
    }

    public async signIn(): Promise<void> {
        return await this.httpPost("signIn")
    }

    public async isSignIn(): Promise<boolean> {

        const resp = await this.httpPost("isSignIn")
        return resp.data.status as boolean
    }
    //行情 ticker 币名称 BITFINEX:BTCUSD）
    public async klines(ticker:string): Promise<any> {
        return await this.getMarket('klines',ticker,'D1')
    }
    //汇率 ticker 币名称 BITFINEX:BTCUSD）
    public async tick(ticker:string): Promise<any> {
        return await this.getMarket('tick',ticker,'')
    }
    //首页信息
    public async pageIndex(): Promise<model.PageIndexData> {
        const resp = await this.httpPost("pageIndex")
        return resp.data as model.PageIndexData
    }
    //静态钱包
    public async staticWallet(): Promise<boolean> {
        return await this.httpPost("staticWallet")
    }
    //静态复投
    public async activate_static( number: string,gesture_password:string,activation_code:string,service:number): Promise<void> {
        const params = {
            number:number,
            gesture_password:gesture_password,
            activation_code:activation_code,
            service:service
        }
        return await this.httpPost("activate_static", params, true)
    }
    //静态提现
    public async assets_static(coin_id:string, coin_number:string, number: string,gesture_password:string,address:string, service:number): Promise<void> {
        const params = {
            coin_id:coin_id,
            coin_number:coin_number,
            number:number,
            gesture_password:gesture_password,
            address:address,
            service:service
        }
        return await this.httpPost("assets_static", params, true)
    }

    //动态钱包
    public async moveWallet(): Promise<boolean> {
        return await this.httpPost("moveWallet")
    }
    //动态复投
    public async activate_move(number: string,gesture_password:string,activation_code:string,service:number): Promise<void> {
        const params = {
            number:number,
            gesture_password:gesture_password,
            activation_code:activation_code,
            service:service
        }
        return await this.httpPost("activate_move", params, true)
    }
    //动态提现
    public async assets_move(coin_id:string, coin_number:string, number: string,gesture_password:string, bankname:string, address:string, service:number): Promise<void> {
        const params = {
            coin_id:coin_id,
            coin_number:coin_number,
            number:number,
            gesture_password:gesture_password,
            address:address,
            service:service
        }
        return await this.httpPost("assets_move", params, true)
    }
//银行卡
public async a  (number: string,gesture_password:string,activation_code:string,service:number): Promise<void> {
    const params = {
        number:number,
        gesture_password:gesture_password
    }
    return await this.httpPost("activate_move", params, true)
}
//新增银行卡
public async addPayment(bank_name: string, account:string): Promise<void> {
    const params = {
        number:number,
        gesture_password:gesture_password
    }
    return await this.httpPost("addPayment", params, true)
}
//删除银行卡
public async activate_move(number: string,gesture_password:string,activation_code:string,service:number): Promise<void> {
    const params = {
        number:number,
        gesture_password:gesture_password,
        activation_code:activation_code,
        service:service
    }
    return await this.httpPost("activate_move", params, true)
}
    public async pageMyFans(): Promise<model.FansData> {
        const resp = await this.httpPost("pageMyFans")
        return resp.data as model.FansData
    }

    public async activateRecord(): Promise<Array<model.ActivateRecordItem>> {
        const resp = await this.httpPost("activateRecord")
        return resp.data.list as Array<model.ActivateRecordItem>
    }

    // 兑换激活卡
    public async exchangeCard(num: number): Promise<void> {
        const params = {
            number: num
        }
        return await this.httpPost("exchangeCard", params)
        
    }

    public async transaction(transactionType: string, coinId?: "1"|"2", page?: number, limit?: number): Promise<model.PageData<model.TransactionItem>> {
        const params = {
            type: transactionType,
            coin_id: coinId,
            page: page,
            limit: limit
        }
        const resp = await this.httpPost("transaction", params)
        return resp.data as model.PageData<model.TransactionItem>
    }
    
    public async pageAssets(): Promise<model.PageAssetsData> {
        const resp = await this.httpPost("pageAssets")
        return resp.data as model.PageAssetsData
    }

    public async getUsableCoin(): Promise<model.UsableCoin> {
        const resp = await this.httpPost("getUsableCoin")
        return resp.data as model.UsableCoin
    }
    //查询代理级别
    public async check_agent(): Promise<void> {
        return await this.httpPost("check_agent")
    }
    //生成激活码
    public async agentActivateCode(type:string): Promise<void> {
        return await this.httpPost("agentActivateCode",{type:type})
    }
    //通证转出
    public async give(giveNumber: string, mobile: string, gesture_password: string): Promise<void> {
        const params = {
            number: giveNumber,
            mobile:mobile,
            gesture_password: gesture_password
        }
        return await this.httpPost("giveOut", params)
    }
    //币兑换
    public async exchange(coinId: string, code: string, activation_code:string, number?: string, coin_number?: string): Promise<void> {
        const params = {
            coin_id: coinId,
            coin_number: coin_number,
            number:number,
            gesture_password: code,
            activation_code: activation_code
        }
        return await this.httpPost("exchange", params)
    }
    //充币
    public async rechange(coinId: string, giveNumber: string, code: string, random:string, voucher?:string): Promise<void> {
        const params = {
            coin_id: coinId,
            number: giveNumber,
            voucher: voucher,
            gesture_password: code,
            random_code: random
        }
        return await this.httpPost("rechange", params)
    }
    //充币log
    public async rechangeRecord( page: number): Promise<any>{
        const params = {
            page,
            limit:10
        }
        const resp = await this.httpPost("rechangeRecord", params)
        return resp.data as model.PageData<model.exreChangeRecordItem>
    }
    //兑换log
    public async exchangeRecord(coin_id?: string, page?: number, limit?: number): Promise<model.PageData<model.exChangeRecordItem>> {
        const params = {
            coin_id,
            page,
            limit:10
        }
        const resp = await this.httpPost("exchangeRecord", params)
        return resp.data as model.PageData<model.exChangeRecordItem>
    }
    //加速返回
    public async quicken(code: string): Promise<void> {
        const params = {
            verification_code: code
        }
        return await this.httpPost("quicken", params)
    }
    //社区申请状态
    public async community_status(): Promise<any> {
        const params ={}
        return await this.httpPost("community_status",params,true)
    }
    //社区申请
    public async community(name: string,identity_card:string, mobile:string): Promise<void> {
        const params = {
            name: name,
            identity_card:identity_card,
            mobile:mobile
        }
        return await this.httpPost("community", params)
    }
    //实名认证
    public async Identify(name:string, identity_card:string, identity_imgurl:string): Promise<void> {
        const params = {
            name: name,
            identity_card:identity_card,
            identity_imgurl:identity_imgurl
        }
        return await this.httpPost("Identify", params)
    }
    //获取随机码
    public async randomCode(): Promise<void> {
        return await this.httpPost("randomCode")
    }
    //查询交易密码
    public async check_gesture_password(): Promise<void> {
        return await this.httpPost("check_gesture_password")
    }
    //设置交易密码
    public async gesture_password(gesture_password:string, regesture_password:string): Promise<void> {
        const params = {
            gesture_password: gesture_password,
            regesture_password: regesture_password
        }
        return await this.httpPost("gesture_password", params)
    }
//修改交易密码
public async loginGesturePassword(gesture_password:string, password:string, repassword:string): Promise<void> {
    const params = {
        gesture_password: gesture_password,
        password: password,
        repassword:repassword
    }
    return await this.httpPost("loginGesturePassword", params)
}
//忘记交易密码
public async forgetGesturePassword(name:string, identity_card:string, mobile:string, verification_code:string, password:string, repassword:string): Promise<void> {
    const params = {
        name: name,
        identity_card: identity_card,
        mobile: mobile,
        verification_code: verification_code,
        password: password,
        repassword: repassword
    }
    return await this.httpPost("forgetGesturePassword", params)
}
    public async systemBulletin(): Promise<Array<model.SystemBulletinItem>> {
        const resp = await this.httpPost("systemBulletin")
        return resp.data.list as Array<model.SystemBulletinItem>
    } 

    // 站内信
    public async mail(): Promise<Array<model.SystemBulletinItem>> {
        const resp = await this.httpPost("mail")
        if (resp.data.list) {
            return resp.data.list as Array<model.SystemBulletinItem>
        }
        return []
    }
    
    //矿工费
    public async getService(): Promise<model.ServiceData>{
        const resp = await this.httpPost("getService")
        return resp.data as model.ServiceData
    }

    //币种信息
    public async getCoin(): Promise<model.CoinData<model.CoinInfo>>{
        const resp = await this.httpPost("getCoin_bst")
        return resp.data as model.CoinData<model.CoinInfo>
    }
    
    //充币
    public async deposit(code: string, number: string, photo: File): Promise<void>{
        const photoPath = await this.uploadFile(photo)

        const params = {
            verification_code: code,
            number: number,
            voucher: photoPath
        }
        return await this.httpPost("deposit", params, true)
    }
    
    
    // 收益记录
    public async profit(style?: string, page?: number): Promise<model.PageData<model.ProfitItem>> {
        const params = {
            page,
            limit:10,
            style
        }
        const resp = await this.httpPost("profit", params)
        return resp.data as model.PageData<model.ProfitItem>

    }

    // 转币记录
    public async transfer(type?:string, page?: number, limit?: number): Promise<model.PageData<model.TransferItem>> {
        const params = {
            type,
            page,
            limit
        }
        const resp = await this.httpPost("giveRecord", params)
        return resp.data as model.PageData<model.TransferItem>
    }

    // 修改头像
    public async updateHead(avatar: File): Promise<string> {
        const headImgUrl = await this.uploadFile(avatar)
        const params = {
            head_imgurl: headImgUrl
        }
        await this.httpPost("updateHead", params)
        return headImgUrl
    }



}