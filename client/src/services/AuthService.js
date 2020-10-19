import API from './API';

const endpoints = {
	GET_USER: '/user'
};

export default {
	getUser: () => {
		return API.get(process.env.REACT_APP_DEV_SERVER_URL + endpoints.GET_USER)
			.then((response) => response.json())
			.then((json) => json);
	}
};
