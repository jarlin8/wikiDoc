document.getElementById("full_page").innerHTML += '<div id="tooltip" class="tooltip hidden"><div id="wrap"><div id="cont"></div></div><iframe id="iframe" class="previews" scrolling="no" src=""></iframe><span class="triangle top" id="arrow"></span></div>';
var iframe = document.getElementById("tooltip");
var inner_iframe = document.getElementById("iframe");
var arrow = document.getElementById("arrow");
var hoveractive = false;

function isMobile() {
  try{ document.createEvent("TouchEvent"); return true; }
  catch(e){ return false; }
}

var tiptext = document.querySelectorAll('.tc-tiddlylink-resolves');

if (!document.getElementsByClassName("bg-white")[0].querySelectorAll("ul")[0].hasChildNodes()) {
    document.getElementsByClassName("mt-3")[0].remove();
}

if (isMobile()) {
    addEventListener("mouseover", function (event) {
        event.stopPropagation();
    }, true);
}

tiptext.forEach(el => el.addEventListener('mouseover', event => {
    document.getElementById("cont").innerHTML = "";
    var elem = event.target;
    var elem_props = elem.getClientRects()[elem.getClientRects().length - 1];
    var top = window.pageYOffset || document.documentElement.scrollTop
    hoveractive = true;
    iframe.classList.remove("hidden");
    if (!iframe.classList.contains("active")) {
      window.setTimeout(function(){
        iframe.classList.add("active");
      }, 100)
    }
    inner_iframe.setAttribute("src", elem.getAttribute("href"));
    inner_iframe.onload = function() {
        if (inner_iframe.getAttribute("src") != "") {
            inner_iframe.contentWindow.addEventListener("mouseover", function (event) {
                event.stopPropagation();
            }, true);
            inner_iframe.contentWindow.document.head.innerHTML += '<base target="_parent" />';
            inner_iframe.contentWindow.document.getElementsByClassName("container-fluid")[0].style.display = "none";
            inner_iframe.contentWindow.document.getElementsByClassName("blog-post-title")[0].style.fontSize = "22px";
            inner_iframe.contentWindow.document.getElementsByClassName("blog-post-title")[0].style.marginTop = "10px";
            inner_iframe.contentWindow.document.getElementsByClassName("blog-post")[0].style.fontSize = "14px";
            inner_iframe.contentWindow.document.getElementsByClassName("blog-post")[0].style.lineHeight = "150%";
            var iframe_body = inner_iframe.contentWindow.document.getElementsByClassName("blog-main")[0].innerHTML;
            document.getElementById("cont").innerHTML = iframe_body;
        }
    }
    iframe.style.left = elem_props.left - (iframe.offsetWidth / 2) + (elem_props.width / 2) + "px";
    if ((window.innerHeight - elem_props.top) < (iframe.offsetHeight)) {
        if (arrow.classList.contains("top")) {
            arrow.classList.remove("top");
        }
        iframe.style.top = elem_props.top + top - iframe.offsetHeight - 10 + "px";
    } else if ((window.innerHeight - elem_props.top) > (iframe.offsetHeight)) {
        if (!arrow.classList.contains("top")) {
            arrow.classList.add("top");
        }
        iframe.style.top = elem_props.top + top + 35 + "px";
    }
    if ((elem_props.left + (elem_props.width / 2)) < (iframe.offsetWidth / 2)) {
        arrow.style.left = elem_props.left + (elem_props.width / 2) - (arrow.offsetWidth) + "px";
        iframe.style.left = "10px";
    } else if ((document.body.clientWidth - elem_props.left - (elem_props.width / 2)) < (iframe.offsetWidth / 2)) {
        iframe.style.left = document.body.clientWidth - iframe.offsetWidth - 20 + "px";
        arrow.style.left = elem_props.left + (elem_props.width / 2) - iframe.getBoundingClientRect().left - (arrow.offsetWidth) + "px";
    } else {
        arrow.style.left = "calc(50% - 10px)";
    }
}));
tiptext.forEach(el => el.addEventListener('mouseout', event => {
    hoveractive = false;
    window.setTimeout(function() {
        if (!hoveractive) {
            window.setTimeout(function(){
          if (!hoveractive) {
            iframe.classList.add("hidden");
            document.getElementById("cont").innerHTML = "";
}
      }, 100);
      inner_iframe.setAttribute("src", "");
      iframe.classList.remove("active");
        }
    }, 250);
}));
iframe.addEventListener('mouseover', function() {
    hoveractive = true;
});
iframe.addEventListener('mouseout', function() {
    hoveractive = false;
    window.setTimeout(function() {
        if (!hoveractive) {
            window.setTimeout(function(){
          if (!hoveractive) {
            iframe.classList.add("hidden");
          }
      }, 100);
      inner_iframe.setAttribute("src", "");
      iframe.classList.remove("active");
        }
    }, 250);
});;