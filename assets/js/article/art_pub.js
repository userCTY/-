$(function(){
    let layer = layui.layer;
    let form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()

    //功能1 请求下拉列表数据并渲染
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('初始化文章分类失败!')
                }
                layer.msg('初始化文章分类成功!')
                let htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr);
                //一定要调用form.render()方法重新获取
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)


  //功能2 为选择封面按钮添加点击事件
  $('#coverBtn').on('click',function(){
      $('#file').click();
  })

  //功能3 设置选中图片到裁剪区域
  $('#file').on('change',function(e){
       // 获取到文件的列表数组
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  //功能4 完成文章发布/存为草稿按钮的相关功能
  //4.1 处理需要上传的五组数据
  //声明变量用于存储文章状态(默认为已发布)
  //----------------------------------- 
  let art_state = '已发布';

  //当用户点击的是 存为草稿的按钮时,将发布状态改为 '草稿'
  $('#btnSaver2').on('click',function(){
    art_state = '草稿';
  })
  //----------------------------------- 

  //监听form表单的提交事件
  $('#form_pub').on('submit',function(e){
      e.preventDefault();
      //基于form表单创建一个FormData对象
      //----------------------------------- 
      let fd = new FormData($(this)[0]);
      //将文章发布状态追加到fd变量中
      fd.append('state', art_state);
      //----------------------------------- 
    //   fd.forEach(function(v,k){
    //       console.log(k , v);
    //   })

    //将封面裁剪好的图片输出为文件
    $image
    .cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function(blob) {
      // 将 Canvas 画布上的内容，转化为文件对象(区别于跟换头像的base64格式)
      // 得到文件对象后，进行后续的操作
      // 将文件对象，存储到 fd 中
      fd.append('cover_img',blob)
      //发起 ajax 数据请求
      publishArticle(fd)
    })
  })

  function publishArticle(fd){
      //ajax默认接受的是查询字符串格式的数据
      //这里穿的是fd格式的数据
      //因此必须有contentType: false, processData: false,这两行代码
      $.ajax({
          method: 'POST',
          url: '/my/article/add',
          data: fd,
          contentType: false,
          processData: false,
          success: function(res){
              console.log(res);
              if(res.status !== 0){
                  return layer.msg('发布文章失败!')
              }
              location.href = '/article/art_list.html'
          }
      })
  }

})