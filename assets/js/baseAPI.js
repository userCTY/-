//在发起ajax请求前会自动调用的一个方法
$.ajaxPrefilter(function(option){
    //将域名拼接上,统一管理
    option.url = 'http://api-breakingnews-web.itheima.net' + option.url;

})