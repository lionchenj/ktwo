
import axios from "axios";
import { ApiBaseUrl, BinanceApi } from "../utils/Constants";
import qs from "qs";
import { ApiError } from "../utils/ApiError";


export abstract class ServiceBase {
   
    protected static accessToken: string

    protected async httpGet(path: string, params: any = {}, needToken = true): Promise<any> {
        return await this.http("get", path, params, needToken) 
    }

    protected async httpPost(path: string, params: any = {}, needToken = true): Promise<any> {
        return await this.http("post", path, params, needToken) 
    }

    protected async httpUpload(file: File): Promise<any> {
        let url: string = `${ApiBaseUrl}/api?url=uploadImages`
        const formData = new FormData()
        formData.append("imageFile", file)
   
        return await axios.post(url, formData, {
            headers: {
                'content-type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent: ProgressEvent) => {
                console.log("httpUpload", progressEvent.loaded, progressEvent.total)
            }
        })
    }
    /**
     * 行情
     * @param path 接口名 （tick：汇率，klines：行情）
     * @param ticker 币名称 BITFINEX:BTCUSD）
     * @param period 周期（tick不用传||支持的值：M1/M5/M15/M30/H1/H4/D1/W1/MONTH ,分别对应：1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月）
     */
    protected async getMarket(path: string,ticker:string,period?:string): Promise<any> {
        let url: string = `/${path}/${ticker}/${period}`
        const config = {
            url: url,
            method: 'get',
            baseURL: BinanceApi,
        }
        const resp = await axios.request(config)
        return resp.data
    }

    private async http(method: "get"|"post", path: string, params: any, needToken: boolean): Promise<any> {
        let url: string = `/api?url=${path}`

        const config = {
            url: url,
            method: method,
            baseURL: ApiBaseUrl,
            params: {},
            data: {}
        }

        if (method === "get") {
            config.params = params
        } else if (method === "post") {
            if (needToken) {
                params.access_token = ServiceBase.accessToken
            }
            config.data = qs.stringify(params)
        }
                
        const resp = await axios.request(config)
        if (resp.status < 200 || resp.status > 299) {
            throw new Error(`服务器错误。(status:${resp.status},statusText:${resp.statusText})`)
        }
        const errCode: number = parseInt(resp.data.errno)
        if ((resp.data.errmsg!="access_token不合法或已过期"&&errCode !== 0)||(resp.data.errmsg!="缺少参数：access_token"&&errCode !== 0)) {
            const errMsg = resp.data.errmsg
            throw new ApiError(errCode, errMsg)
        }
        return resp.data
    }
}