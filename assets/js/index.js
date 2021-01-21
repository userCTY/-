$(function(){
    getUserInfo()

    //点击退出,退回登录页面
    $('#btnLogin').on('click',function(){
        //layui弹出层
        layer.confirm('确认退出登录嘛?', {icon: 3, title:'提示'}, function(index){
            
            //1.清空本地存储的token
            localStorage.removeItem('token');
            //2.跳转回登录页面
            location.href = '/login.html';

            //layui自带的,用于关闭该弹出层
            layer.close(index);
        })
    })
})

let layer = layui.layer;
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        //ajax请求成功会调用success回调函数,失败会调用error回调函数,
        //无论成功还是失败都会调用complete回调函数
        success: function(res){
            if(res.status !== 0){
                return layer.msg('获取用户信息失败!')
            }
            //调用renderAvatar()函数
            renderAvatar(res.data);
        },

        //ajax请求无论成功与否都会执行complete回调函数
        // complete: function(res){
        //     //res.responseJSON 会拿到返回的数据,等同于res
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         //1.强制清除本地存储的token
        //         localStorage.removeItem('token');
        //         //2.强制跳转回登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

function renderAvatar(user){
    //1.获取用户名
    let name = user.nickname || user.username;
    $('.wellcome').html('欢迎 &nbsp;' + name);

    //2.获取用户头像并渲染
    if(user.user_pic !== null){
        //渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show();
        $('.text_ava').hide();
    }else{
        //渲染文字头像
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase()
        $('.text_ava').html(first).show()
    }
}

