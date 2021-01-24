$(function(){

    let layer = layui.layer

    //定义查询参数对象,以便以后请求数据的时候使用
    let q = {
        pagenum: 1, //页码值,默认为1,
        pagesize: 2, //每页显示多少条数据,默认为2
        cate_id: '', //文章分类的 Id
        state: '' //文章的发布状态
    }

    initTable()

    //功能1 发起请求渲染表格数据
    function initTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取数据失败!')
                }
                layer.msg('获取数据成功!')
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }



    //功能1
    //功能1
    //功能1
    //功能1
    //功能1
    //功能1





















})