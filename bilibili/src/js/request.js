axios.defaults.baseURL = "https://developer.duyiedu.com/vue/bz/";
axios.interceptors.response.use((response)=>{
    const {status} = response;
    if(status === 200){
        if(response.config.url === (response.config.baseURL + "video")){
            return response.data
        }
        return response.data.data;
    }
    return response;
})