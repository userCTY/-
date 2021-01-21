$(function(){
    //点击'去注册账号'跳转
    $('#link_reg').on('click',function(){
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //点击'去登录'跳转
    $('#link_login').on('click',function(){
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //自定义表单校验规则
    //1. 从layui中获取form对象
    // 1.1 layui 的来源相当于jq中的 $
    let form = layui.form;
    //2.通过form.verify()函数定义校验规则
    form.verify({
        //3.校验规则以键值对的方式定义
        //3.1 数组中的第一项为校验规则,第二项为提示信息,详见官方文档
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致的规则
        repwd: function(value){
            //通过形参value可以拿到确认密码框中的值
            //也可以使用属性选择器拿到密码框的值
            // let pwd = $('.reg-box' [name=password]).val()
            //二者一比较就好
            if($('#pwd').val() != value){
                return '两次密码输入不一致!'
            }
        }

    })


    //从layui上获取layer对象
    let layer = layui.layer;

    //监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        //阻止表单的默认提交行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data:{
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function(res){
                if(res.status !== 0){
                    //弹出层layer.msg()方法,详见layui官方文档
                    return layer.msg(res.message);
                }
                layer.msg('注册成功,请登录',{
                    time: 1500 //2秒关闭（如果不配置，默认是3秒）
                  },function(){
                    //以回调函数的形式调用自执行事件,模拟人的点击行为
                    $('#link_login').click();
                });
            }
        })
    })


    //监听登录表单的提交事件
    $('#form_login').submit(function(e){
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            //$(this).serialize()  $(this)事件的绑定者  serialize()快速获取表单内容(带name属性的才会被获取).
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                //将用户的唯一标识符储存到浏览器硬盘中备用.
                localStorage.setItem('token',res.token);
                //跳转页面.
                location.href = '/index.html';
            }
        })
    })
    
})