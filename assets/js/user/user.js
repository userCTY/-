$(function() {
    var form = layui.form;
    let layer = layui.layer;
    //昵称验证
    form.verify({
      nickname: function(value) {
        if (value.length > 6) {
          return '昵称长度必须在 1 ~ 6 个字符之间！'
        }
      }
    })

    initUserInfo();
    //获取用户信息并赋值
    function initUserInfo(){
      $.ajax({
          method: 'GET',
          url: '/my/userinfo',
          success: function(res){
              if(res.status !== 0){
                  return layer.msg('获取用户信息失败!')
              }
              //layui提供的给表单快速赋值的方法,详见官方文档
              form.val('formUserInfo',res.data);
          }
      })
    }

    //重置按钮功能实现
    $('#btnReset').on('click',function(e){
        //阻止表单的默认重置行为
        e.preventDefault();
        //调用函数还原数据
        initUserInfo();
    })

    //实现表单数据的提交并更新用户信息,渲染欢迎语句
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')
                //在子页面中调用父页面的方法(流批)
                window.parent.getUserInfo();
            }
        })
    })

  })
  