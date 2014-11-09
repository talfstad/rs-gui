module.exports = {
  //Date prototype for converting Date() to MySQL DateTime format
  toMysqlFormat: function (date) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return date.getFullYear() + "-" + pad(1 + date.getMonth()) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
  }

};
