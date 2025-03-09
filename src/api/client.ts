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
	
	private async requestWrapper<T>(request: Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> {
		try {
			const response = await request;
			return response;
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				// Redirect to login page if token is invalid
				window.location.href = '/login';
			}
			throw error;
		}
	}

	private setToken(url: string): void {
		if (!url.includes('/token')) {
			const token = localStorage.getItem('token');
			this.client.defaults.headers.Authorization = `Token ${token}`;
		}
	}

	public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		this.setToken(url);
		return this.requestWrapper(this.client.get<T>(url, config));
	}

	public post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		this.setToken(url);
		return this.requestWrapper(this.client.post<T>(url, data, config));
	}

	public put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		this.setToken(url);
		return this.requestWrapper(this.client.put<T>(url, data, config));
	}

	public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		this.setToken(url);
		return this.requestWrapper(this.client.delete<T>(url, config));
	}
}

export const httpClient = new HttpClient('http://localhost:8000/api');