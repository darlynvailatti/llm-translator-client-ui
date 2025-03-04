import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class HttpClient {
	private client: AxiosInstance;

	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL,
			headers: {
				'Content-Type': 'application/json'
			},
			withCredentials: true // Include credentials in requests
		});
	}

	public setToken(): void {
		const token = localStorage.getItem('token');
		this.client.defaults.headers.Authorization = `Token ${token}`;
	}

	public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		this.setToken()
		return this.client.get<T>(url, config);
	}

	public post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		this.setToken()
		return this.client.post<T>(url, data, config);
	}

	public put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		this.setToken()
		return this.client.put<T>(url, data, config);
	}

	public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		this.setToken()
		return this.client.delete<T>(url, config);
	}
}

export const httpClient = new HttpClient('http://localhost:8000/api');