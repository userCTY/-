$(function(){
    let layer = layui.layer;
    let form = layui.form;

    initArtCateList();

    //功能1 获取服务器数据并使用模板引擎渲染
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                let htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr);
            }
        })
    }

    //声明变量以便储存弹出层的索引
    let indexAdd = null
    //功能2 实现点击添加类别功能的弹出层书写
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            //layer弹出层的相关属性type,area详见文档
            type: 1,
            area: ['500px','250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //功能3 实现添加类别功能
    //动态生成的表单需要通过事件委托完成绑定事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('新增类别失败!');
                }
                initArtCateList()
                layer.msg('新增类别成功!');
                //添加成功后自动关闭弹出层
                layer.close(indexAdd);
            }
        })
    })

    let indexEdit = null;
    //功能4 完成编辑按钮的相关功能
    $('tbody').on('click','.btn-edit',function(){
        indexEdit = layer.open({
            //layer弹出层的相关属性type,area详见文档
            type: 1,
            area: ['500px','250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        //为弹出层填充内容
        let id = $(this).data('id');
        $.ajax({
            method: 'GET',
            //拼接上点击行的id
            url: '/my/article/cates/' + id,
            success: function(res){
                form.val('form-edit',res.data);
            }
        })
    })

    //功能5 点击确认修改提交修改后的数据(事件委托)
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新分类数据失败!')
                }
                layer.msg('更新分类数据成功!')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //功能6 实现删除功能(事件委托)
    $('tbody').on('click','.btn-delete',function(){
        //根据id删除该条数据
        let id = $(this).data('id')
        //弹个框出来询问
        layer.confirm('确认删除该项?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功!')
                    layer.close(index)
                    initArtCateList()
                }
            })
        });
    })
})