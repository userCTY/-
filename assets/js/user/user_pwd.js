$(function(){
    let form = layui.form;
    let layer = layui.layer;
    // 功能1 给密码框添加验证规则(基本规则,原密码与新密码不能一致,新密码与确认密码必须一致)
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'] ,
        samePwd: function(value){
            if(value === $('[name=oldpwd]').val()){
                return '新旧密码不能相同';
            }
        },
        repwd: function(value){
            if(value !== $('[name=newpwd]').val()){
                return '两次输入密码不一致'
            }
        }
    })

    // 功能2 实现重置密码的功能
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('[name=oldpwd]').val(),
                newPwd: $('[name=newpwd]').val()
            },
            success: function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //重置表单内容(拿到jq对象,转换为原生dom对象,使用原生reset方法)
                $('.layui-form')[0].reset()
            }
        })
    })
})