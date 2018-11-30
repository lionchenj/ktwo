
export default function register() {

window.apiready = function () {
    var timer = 0
    api.addEventListener({
      name: 'keyback'
    }, function (ret, err) {
      var currentTime = +new Date()
      api.historyBack(function (ret, err) {
        if (!ret.status) {
          if ((currentTime - timer) > 2000) {
            timer = currentTime
            api.toast({
              msg: '再按一次返回键退出app',
              duration: 2000,
              location: 'bottom'
            })
          } else {
            api.closeWidget({
              id: 'A6089289836112', //这里改成自己的应用ID
              retData: {name: 'closeWidget'},
              silent: true
            })
          }
        }
      })
    })
  }
}