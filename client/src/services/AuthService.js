import API from './API';

const endpoints = {
	GET_USER: '/user'
};

export default {
	getUser: () => {
		return API.get(process.env.DEV_SERVER_URL + endpoints.GET_USER)
			.then((response) => response.json())
			.then((json) => json);
	}
};
