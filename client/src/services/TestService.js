import API from './API';

const endpoints = {
    TEST_API: '/testAPI'
};

export default {
    test: () => {
        return API.get(process.env.REACT_APP_DEV_SERVER_URL + endpoints.TEST_API)
            .then((response) => response.json())
            .then((json) => json);
    }
};
