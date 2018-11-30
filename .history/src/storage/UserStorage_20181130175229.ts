const AccessTokenKey = "User.AccessTokenKey";

export class UserStorage {
  static saveAccessToken(token: string) {
    window.localStorage.setItem(AccessTokenKey, token);
  }
  static getAccessToken(): string | null {
    window;
    return window.localStorage.getItem(AccessTokenKey);
  }

  static clearAccessToken() {
    window.localStorage.removeItem(AccessTokenKey);
  }
  //写cookies

  static setCookie(name:string, valuestring) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  }

  //读取cookies
  static getCookie(name) {
    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  }

  //删除cookies
  static delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
}
