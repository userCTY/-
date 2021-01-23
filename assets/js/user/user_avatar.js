$(function(){
    let layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


  //功能1 点击上传按钮弹出选择图片
  $('#btnChooseImage').on('click',function(){
      //模拟点击
      $('#file').click();
  })

  //功能2 将选中的图片初始化到图片裁剪区域
  $('#file').on('change',function(e){
    let fileList = e.target.files;
    if(fileList.length === 0){
        return
    }
    //1.拿到用户选择的图片
    let file = fileList[0];
    //2. 将图片转换为url地址
    let imgURL = URL.createObjectURL(file);
    //初始化裁剪区域
    $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', imgURL) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域
  })

  //功能3 实现头像的上传
  $('#btnUpload').on('click',function(){
      //1.获取用户选中的图片(cropper插件方法)
      var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
      //base64 格式
      /* 
      代表者具体的一张图片,可以减少一些不必要的图片请求(以字符串的形式表示)
      但其体积会较源文件变大30%
      一般将小图片转换为 base64 格式,大图片不适合准换为该格式
      */

      //2.调用接口上传并替换父页面的头像
      $.ajax({
          method: 'POST',
          url: '/my/update/avatar',
          data: {
            avatar: dataURL
          },
          success: function(res){
              if(res.status !== 0){
                  return layer.msg('跟换头像失败!')
              }
              layer.msg('跟换头像成功')
              window.parent.getUserInfo();
          }
      })
  })
})