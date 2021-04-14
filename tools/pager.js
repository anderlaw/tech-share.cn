// 分页模块
//server side told client side how many size page
//因此可以直接渲染页码链接（a标签）
module.exports = function({
  url_heading,//前面的url前缀
  current_page,
  page_count
}){
  current_page = parseInt(current_page);
  url_heading = url_heading || "";
  //只允许渲染五个页码数字其余的用...表示

  //处理上一页和下一页按钮
  let hasPrev = current_page > 1 ? true:false;
  let hasNext = current_page < page_count ? true:false;

  //获取后五个页码,(起点为一。如果数量不足，也可能少于五个)
  const lastFiveIfExist = [];
  let pageHtmlStr = "";
  for (let i = page_count; i > 0; i--) {
    if(lastFiveIfExist.length < 5){
      lastFiveIfExist.unshift(i)
    }
  }
  
  //判断当前页码在lastFiveIfExist中的位置，并渲染
  if(lastFiveIfExist.indexOf(current_page) === -1){
    //以当前页码为起点绘制五个
    if(page_count > 0){
      pageHtmlStr = `<a href="${url_heading}&current_page=${current_page}" class="page-item pager active">${current_page}</a>`
      for(let pageNum = current_page+1; pageNum<current_page+5;pageNum++){
        pageHtmlStr += `<a href="${url_heading}&current_page=${pageNum}" class="page-item pager active">${i}</a>`
      }
      //后面还有
      pageHtmlStr += `<span> class="page-item">...</span>`
    }
  }else{
    //在里面，直接渲染后五个，将当前的标记出来
    lastFiveIfExist.forEach(item=>{
      if(item == current_page){
        pageHtmlStr += `<a href="${url_heading}&current_page=${item}" class="page-item pager active">${item}</a>`
      }else{
        pageHtmlStr += `<a href="${url_heading}&current_page=${item}" class="page-item pager">${item}</a>`
      }
    })
  }
  
  const backHtmlStr = hasPrev ? `<a href="${url_heading}&current_page=${current_page-1}" class="page-item back"></a>`:``;
  const forwardHtmlStr = hasNext ? `<a href="${url_heading}&current_page=${current_page+1}" class="page-item forward"></a>`:``;
  return backHtmlStr+pageHtmlStr+forwardHtmlStr;

}