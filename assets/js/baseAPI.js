//在发起ajax请求前会自动调用的一个方法
$.ajaxPrefilter(function(option){
    //将域名拼接上,统一管理
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;

    //为符合条件的请求统一添加请求头
    if(option.url.indexOf('/my/') !== -1){
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局统一挂载 complete 回调函数
    option.complete = function(res){
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})