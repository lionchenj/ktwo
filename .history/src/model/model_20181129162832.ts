export namespace model {
    export interface User {
        mobile: string,
        nickname: string,
        referee: string,
        renickname: string,
        activate: boolean,
        head_imgurl: string,
        errorCode:string,

    }

    export interface PurseAddress { // 钱包地址
        eosAddress: string,
        vathAddress: string
    }

    export interface PageIndexData {
        usable: number,    // 可用
        total: number,    // 资产
        usable_user: number,//通证
        usable_static: number //可提现的静态通证
        lock: number //在投通证
        profit: number //昨天收益
        usable_move: number //可提现的动态通证
        activate: number //7天内复投通证
    }
    
    export interface VethPriceData {
        vethPrice: number,      //VETH激活卡价格
    }

    export interface Fans {
        userid: string,
        mobile: string,
        nickname: string,
        level: string,
        activate: boolean,
        today_order: string
    }

    export interface FansData {
        total: number,
        not_active: number,
        recharge_num: number,
        list: Array<Fans>
    }

    export interface ActivateRecordItem {
        time: string,
        orderid: string,
        eos: string,
        status: string
    }

    export interface PageData<T> {
        total_num: number,
        page: number,
        list: Array<T>
    }

    export interface CoinInfo {
        id: string,
        name: string,
        exchange_rate: string,
        address: string,
        usable: string 
    }

    export interface CoinData<T> {
        list: Array<T>
    }

    export interface ServiceData {
        start: string,
        end: string
    }
    export interface Service<T> {
        data: Array<T>
    }
    export interface activateItem {
        nickname:string,
        address:string
    }
    export interface exChangeRecordItem {
        orderid: string,
        number: string,
        time: string,
        coid_name: string,
    }
    export interface exreChangeRecordItem {
        status: string,
        number: string,
        time: string,
        coin_id: string,
        coin_name: string
    }
    export interface TransactionItem {
        orderid: string,
        number: string,
        plusminus: string,
        surplus: string,
        coin_id: string,
        userid: string,
        time: string,
        style: string,
        head_imgurl:string,
    }

    export interface PageAssetsData {
        usable_eos: string,
        usable_veth: string,
        total_eos: string,
        total_veth: string,
        yesterday_eos: string,
        yesterday_veth: string
    }

    export interface UsableCoin {
        usable_eos: string,
        usable_veth: string,
        act_money: string
    }


    export interface SystemBulletinItem {
        time: string,
        title: string,
        describe: string,
        content: string
    }
 
    export interface ProfitItem {
        orderid: string,
        number: string,
        plusminus: string,
        surplus: string,    // 交易后数值
        coin_id: string,
        time: string,
        style: string
    }

    

    export interface TransferItem {
        orderid: string,
        number: string,
        coin_id: string,
        time: string,
        consignee: string
    }

}