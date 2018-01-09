var innerPage = true;
var path, title, poemId, adId;
$(document).ready(function () {
  path = window.document.location.href;
  $("#toTopDiv").css("display", "none");
  if (path.indexOf('?') > -1) {
    poemId = path.split("?")[1].split("&")[0].split("=")[1];
    adId = path.split("?")[1].split("&")[1].split("=")[1];
  } else {
    poemId = path.split("banner")[1].split("/")[1];
    adId = path.split("banner")[1].split("/")[2];
  }

  if (poemId == 54) {
    title = '“网”瘾少年，新装上阵';
  } else if (poemId == 56) {
    title = 'vans精选，折扣好货';
  } else if (poemId == 57) {
    title = 'Adidas originals';
  } else if (poemId == 55) {
    title = '不跟随，让世界跪着看你踢球';
  } else if (poemId == 59) {
    title = '精选篮球战靴';
  } else if (poemId == 61) {
    title = '一双跑鞋吃遍天';
  } else if (poemId == 60) {
    title = '一样的冬天，不一样的潮';
  } else if (poemId == 58) {
    title = '冬日热“炼”，你要不要来';
  } else if (poemId == 62) {
    title = '2-5折的运动潮牌合集~~';
  } else if (poemId == 64) {
    title = '运动外套';
  } else if (poemId == 65) {
    title = 'Air Jordan';
  } else if (poemId == 63) {
    title = 'GEL-Lyte';
  } else if (poemId == 66) {
    title = 'Leggings';
  } else if (poemId == 67) {
    title = 'Nemeziz足球鞋';
  } else if (poemId == 68) {
    title = 'adidas鞋--经典系列';
  } else {
    title = '超低折扣';
  }
  document.title = title;

  //获取页面的title
  // $.ajax({
  //     type: "GET",
  //     url: "http://pro365.cn/mobile/poem/title.jhtml?poemId="+poemId+"&adId="+adId,
  //     success: function(res){
  //          document.title=res.data.name;
  //     }
  // });

  //获取页面的其它数据
  $.ajax({
    type: "GET",
    url: "http://pro365.cn/mobile/poem.jhtml?poemId=" + poemId + "&adId=" + adId + "&less=less&size=11",
    success: function (res) {
      var poem = res.data.poem;
      initPage(poem);
      $("img.lazy").lazyload({
        effect: "fadeIn",
        threshold: 80,
        event: 'scroll'
      });
      if (localStorage.getItem("poem") == undefined) {
        $.ajax({
          type: "GET",
          url: "http://pro365.cn/mobile/poem.jhtml?poemId=" + poemId + "&adId=" + adId + "&less=all&size=11",
          success: function (res) {
            var poem = res.data.poem;
            localStorage.setItem("poem", JSON.stringify(poem));
          }
        })
      }
    }
  });
});

function initPage(poem) {
  $("#topbannerImg").attr("src", poem.node.nodeHead[0].images[0].url);
  $("#topTabsDiv").append("<div id='tabsDiv'></div>");

  if (poem.node.nodeFloor.length > 0) {
    $("#expandFloorNameDiv").append("<div id='leftTextDiv'>切换楼层</div>");
    if (poem.node.nodeFloor.length > 2) {
      $("#expandFloorNameDiv").append("<div id='rightDownImgDiv3' onclick='showMoreTabsDiv()'><img id='rightDownImg1' src='http://res.pro365.cn/shop/icon_down.png'></div>");
    }
    $("#expandFloorNameDiv").append("<div class='greySmallLine'></div>");
    for (var nodeIndex = 0; nodeIndex < poem.node.nodeFloor.length; nodeIndex++) {
      var nodeFloor = poem.node.nodeFloor[nodeIndex];
      $("#tabsDiv").append(drawTabs(nodeFloor));
      $("#expandFloorNameDiv").append(drawExpandTabs(nodeFloor));
      $("#productBody").append(drawFloor(nodeFloor));
      $("#productBody").append(drawProductList(nodeFloor, nodeIndex));
    }
    if (poem.node.nodeFloor.length > 2) {
      $("#topTabsDiv").append("<div id='rightDownImgDiv' onclick='showMoreTabsDiv()'><img id='rightDownImg' src='http://res.pro365.cn/shop/icon_down.png'></div>");
    } else {
      $("#topTabsDiv").append("<div id='rightDownImgDiv2'></div>");
    }
    $("#topTabsDiv").append("<div class='clearFix'></div>");
    $("#expandFloorNameDiv").css("display", "none");
  } else {
    $("#productBody").append("<p class='noDataView'>没有符合条件的商品</p>");
  }
}

function drawProductList(nodeFloor, nodeIndex) {
  var $ListElement = $("<div class='product_list'></div>");
  if (nodeFloor.products.length <= 10) {
    for (var productIndex = 0; productIndex < nodeFloor.products.length; productIndex++) {
      var product = nodeFloor.products[productIndex];
      $ListElement.append(drawProductItem(product));
    }
  } else {
    for (var productIndex = 0; productIndex < 10; productIndex++) {
      var product = nodeFloor.products[productIndex];
      $ListElement.append(drawProductItem(product));
    }
    //当长度多于10个
    $ListElement.append(drawToMore(nodeIndex));
  }
  return $ListElement;
}

function drawProductItem(product) {
  var zhekouStr = product.zhekou == 100 ? "<div class='empty_text'></div>" : "<div class='zhekou_text'>" + (product.zhekou / 10) + "折</div>";
  var path_seg = innerPage ? "#/" : "";
  var $aElement = $("<a class='product_item' href='http://m.pro365.cn/" + path_seg + "product/" + product.id + "/" + product.goods + "'><div class='show'><img class='lazy' data-original='" + product.image +
    "'></div><div class='title'>" + product.name + "</div><div class='button_box'><div class='price'>￥" +
    product.price + "</div><div class='market_price'>￥" + product.marketPrice + "</div></div>" + zhekouStr + "</a>");
  // $('img').error(function(){
  // 		//如果图片第一次加载失败，就重新给它赋值
  //      $(this).attr('src', product.image);
  //  });
  return $aElement;
}

function drawFloor(nodeFloor) {
  var $imgEle = $("<div id='" + clearSpace(nodeFloor.name) + "' class='floorDiv'>" + nodeFloor.name + "</div>");
  return $imgEle;
}

function drawToMore(nodeIndex) {
  var $aElement = $("<div class='moreDiv' onclick='showMoreProduct(" + nodeIndex + ")'><span>查看更多 </span><img class='moreImage lazy' data-original='http://res.pro365.cn/shop/icon_down.png'></div>");
  return $aElement;
}

function drawTabs(nodeFloor) {
  var $aElement = $("<a class='alinkDiv' onclick='clickA(this)' name='" + clearSpace(nodeFloor.name) + "'>" + nodeFloor.name + "</a>");
  return $aElement;
}

function drawExpandTabs(nodeFloor) {
  var $aElement = $("<a class='aExpandlinkDiv' onclick='clickAExpnad(this)' name='" + clearSpace(nodeFloor.name) + "'>" + nodeFloor.name + "</a>");
  return $aElement;
}

var isShow = false;

function showMoreTabsDiv() {
  if (isShow) {
    //展开之后再点击，就收起
    $("#expandFloorNameDiv").css("display", "none");
    $("#leftTextDiv").css("display", "none");
    $("#rightDownImg").css("transform", "rotate(0deg)");
    $("#rightDownImg1").css("transform", "rotate(0deg)");
    isShow = false;
  } else {
    //收起之后再点击，就展开
    $("#expandFloorNameDiv").css("display", "inline-block");
    $("#leftTextDiv").css("display", "inline-block");
    $("#rightDownImg").css("transform", "rotate(180deg)");
    $("#rightDownImg1").css("transform", "rotate(180deg)");
    isShow = true;
    if (!isAsTop) {
      $(document).scrollTop($("#topbox").height() - $("#expandFloorNameDiv").height());
    }
  }
}

var isAsTop = false;
window.onscroll = function (event) {
  //页面滑动离顶端的距离
  var distance = document.documentElement.scrollTop || document.body.scrollTop;
  if (!isAsTop) {
    if (distance > ($("#topbox").height() - $("#topTabsDiv").height())) {
      $("#topTabsDiv").addClass("fixedCss");
      isAsTop = true;
    }
  } else {
    if (distance < ($("#topbox").height() - $("#topTabsDiv").height())) {
      $("#topTabsDiv").removeClass("fixedCss");
      isAsTop = false;
    }
  }

  //回到顶部按钮
  if (distance > $("#productBody").find("div[class='floorDiv']:first").offset().top) {
    $("#toTopDiv").css("display", "block");
  } else {
    $("#toTopDiv").css("display", "none");
  }
  //选中样式
  var extIndex = -1;
  $("#productBody").find("div[class='floorDiv']").each(function (index, element) {
    if ($(element).offset().top <= (distance + 100)) {
      extIndex = index;
    }
  })
  
  //顶部展开栏选中样式
  $('#expandFloorNameDiv').find("a[class='aExpandlinkDiv']").each(function (index, element) {
    $(element).css("border-bottom", "").css("color", "#666666");
  })
  $('#expandFloorNameDiv').find("a[class='aExpandlinkDiv']").each(function (index, element) {
    if (extIndex == index) {
      $(element).css("border-bottom", "2px solid #ffba00").css("color", "#333333");
    }
  })
  //中间滑动条选中样式
  $('#tabsDiv').find("a[class='alinkDiv']").each(function (index, element) {
    $(element).css("border-bottom", "").css("color", "#666666");
  })
  $('#tabsDiv').find("a[class='alinkDiv']").each(function (index, element) {
    if (extIndex == index) {
      $(element).css("border-bottom", "2px solid #ffba00").css("color", "#333333");
    }
  })
  //中间滑动条滑动到指定位置
  $('#tabsDiv').scrollLeft(extIndex * 130);

  //假如出现当滚动条和展开区域都不在视图中的错误时，就让滚动条展示
  if ($("#topbox").css("display") == 'none' && $("#expandFloorNameDiv").css("display") == 'none') {
    $("#topTabsDiv").css("display", "block");
    $("#topTabsDiv").addClass("fixedCss");
    isAsTop = true;
  }
}

function showMoreProduct(nodeFloorIndex) {
  //跳转到子楼层的详情页面
  window.location.href = 'more.html?nodeFloorIndex=' + nodeFloorIndex + "&poemId=" + poemId + "&adId=" + adId;
}

function clickAExpnad(ele) {
  //点击展开的楼层选择项时关闭展开区域
  $("#expandFloorNameDiv").css("display", "none");
  $("#leftTextDiv").css("display", "none");
  $("#rightDownImg").css("transform", "rotate(0deg)");
  $("#rightDownImg1").css("transform", "rotate(0deg)");
  $("#banner").removeClass("celling");
  isShow = false;
  history.pushState("", title, path);
  $(document).scrollTop($("#" + $(ele).attr("name")).offset().top - $($(ele).parent()).height());
}

function clickA(ele) {
  history.pushState("", title, path);
  $(document).scrollTop($("#" + $(ele).attr("name")).offset().top - $($(ele).parent()).height());
}

function backToTop() {
  $(document).scrollTop(0);
}

function clearSpace(str) {
  str = str.replace(/\s/g, '')
  return str;
}