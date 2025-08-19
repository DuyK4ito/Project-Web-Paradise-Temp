import { ENV } from "@/configs/env.constant"
import type { AxiosInstance, AxiosResponse } from "axios"
import axios from "axios"

export default class ClientRequest {
    static instance: ClientRequest | null = null

    public static getInstance(): ClientRequest {
        if (!ClientRequest.instance) {
            ClientRequest.instance = new ClientRequest()
        }
        return ClientRequest.instance
    }

    private axiosInstance!: AxiosInstance

    public static EVENTS = {
        FORBIDDEN: "FORBIDDEN",
        TOKEN_EXPIRED: "TOKEN_EXPIRED",
    }

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: ENV.NEXT_PUBLIC_BACKEND_URL,
            timeout: 30000,
        })

        const fulfilledResponseHandler = (config: AxiosResponse<any, any>) => {
            return config
        }

        this.axiosInstance.interceptors.response.use(fulfilledResponseHandler)
    }

    public getAxiosInstance(): AxiosInstance {
        return this.axiosInstance
    }

    /** Access Token */
    public hasAccessToken(): boolean {
        return localStorage.getItem("access_token") !== null
    }

    public getAccessToken(): string | null {
        return localStorage.getItem("access_token")
    }

    public setAccessToken(value: string) {
        localStorage.setItem("access_token", value)
    }

    public removeAccessToken(): void {
        localStorage.removeItem("access_token")
    }

    /** Refresh Token */
    public hasRefreshToken(): boolean {
        return localStorage.getItem("refresh_token") !== null
    }

    public getRefreshToken(): string | null {
        return localStorage.getItem("refresh_token")
    }

    public setRefreshToken(value: string) {
        localStorage.setItem("refresh_token", value)
    }

    public removeRefreshToken(): void {
        localStorage.removeItem("refresh_token")
    }
}
