$(function(){

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
    
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
    
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
    
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
  
    // 定义补零的函数
    function padZero(n) {
      return n > 9 ? n : '0' + n
    }


    //定义查询参数对象,以便以后请求数据的时候使用
    let q = {
        pagenum: 1, //页码值,默认为1,
        pagesize: 5, //每页显示多少条数据,默认为2
        cate_id: '', //文章分类的 Id
        state: '' //文章的发布状态
    }
    //调用渲染表格函数
    initTable()
    //调用渲染分类数据函数
    initCate()

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
                // layer.msg('获取数据成功!')
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                //表单列表渲染完成后调用渲染页码函数
                renderPage(res.total)
            }
        })
    }

    //功能2 获取分类列表数据--------(form.render()知识点)
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类列表失败!')
                }
                // layer.msg('获取分类列表成功!')
                let htmlStr = template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr)
                //此时layui没有监听到添加以上内容的动作
                //调用form.render()方法告诉layui重新渲染一次,此时就能监听到添加动作
                form.render()
            }
        })
    }

    //功能3 实现筛选功能
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        //获取表单中对应选项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        //为查询参数对象中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件重新渲染表格数据
        initTable()
    })

    //功能4 定义渲染分页方法-------(分页及其回调函数知识点)
    function renderPage(total){
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            // 这些值的位置会对页面效果造成影响
            layout: ['count' , 'limit' , 'prev' , 'page' , 'next', 'skip'],
            limits: [5,10,15,20,25,30],
            //触发回调的方式有两种: 1. 点击页码  2. 只要调用了laypage.render()方法就会触发回调
            //根据触发条件2 造成死循环
            // 解决方案: 利用jump的第二个参数来判断是否是由第二种方法触发,如果是,就不调用initTable()方法
            //first的值为布尔值,第一种方法触发返回的是true,第二种方式触发返回undefined
            jump: function(obj,first){
                // console.log(obj.curr);
                // console.log(first);
                q.pagenum = obj.curr;
                //将新增的每页展示多少条的最新数据放到查询对象中并重新请求
                q.pagesize = obj.limit
                //根据最新的q 获取最新的数据列表(但是直接调用函数获取会发生死循环的问题)
                // initTable()
                if(!first){
                    initTable()
                }
            }
        })
    }

    //功能5 实现删除文章(事件委托)
    $('tbody').on('click', '.btn-delete', function() {
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        //获取页面中还剩多少个删除按钮,一个就代表还有一条数据
        let len = $('.btn-delete').length
        // console.log(len);
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
          $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除文章失败！')
              }
              layer.msg('删除文章成功！')
              //这里出现了一个BUG,当把最后的的数据删除后,页码跳转但数据渲染异常
              //解决方案: 判断页面上是否还有数据就不让页码值 -1,否则反之
              if(len === 1){
                //页码值最小只能是1 当其为1时就不再减了
                q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
              }  
              initTable()
            }
          })
    
          layer.close(index)
        })
    })
    //-----------------------------------------------(end)--
})