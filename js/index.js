


/*
* 移动端
* 禁止全局默认行为*/
;(function () {
    var wrap = document.querySelector('.wrap');
    wrap.addEventListener('touchstart',function (event) {
        event.preventDefault;
    })
})();


/*rem适配*/
var size;
(function (designWidth) {
     size = document.documentElement.clientWidth / (designWidth/100);
    document.documentElement.style.fontSize = size + 'px';
    document.body.style.fontSize = '14px';
})(1080);



(function () {
    menuShowHide();
    navHandle();
    lbt();
    addScrollBar();
    tabChange();
    handleTabNav();


    /*头部 的 菜单部分*/
    /*菜单的显示和隐藏*/
    function menuShowHide() {
        var activeMenu = document.querySelector('.active_menu');
        var menu = document.querySelector('.menu');

        /*点击菜单按钮的时候，显示或隐藏菜单。*/
        $('.active_menu').tap(function (event) {
            $('.menu').toggle();
        });

        /*点击菜单按钮之外的地方 也会显示 或隐藏菜单*/
        document.addEventListener('touchstart',function () {
            //返回的是点击的当前的元素（标签）  （元素及其属性及其文本内容）
            // console.log(event.target);// 方式一
            // console.log(event.changedTouches[0].target);// 方式二

            //要先判断以下当前点击的是（.active_menu元素）菜单按钮。还是其他地方的元素。如何判断是当前点击的是哪个元素呢？可以通过event.target 或 event.changedTouches[0].target判断，他们的返回值都是当前点击的元素。
            if(event.changedTouches[0].target.id != 'active_menu'){
                $('.menu').hide();
            }
        });
    }


    /*内容区部分*/

    /*处理 内容区顶部 可滑动导航部分 */
    /*处理导航 - 点击切换li的字体颜色和背景色*/
    /*方法一：for循环  var  */
    function navHandle(){
        var activeIndex = 0;
        var lis = document.querySelectorAll(".nav li");
        for (var i = 0; i < lis.length; i++){
            lis[i].i = i;
            $(lis[i]).tap(function (event){
                lis[activeIndex].classList.remove("active");
                this.classList.add("active");
                activeIndex = this.i;
            });
        }

        /*处理导航 - 滑动导航.nav */
        var initX =0;
        $('.nav').pan(function (event) {
            this.style.transition = '';
            var deltaX = event.deltaX;
            $(this).transform('translate3d', deltaX + initX, 0, 0);
            // if(event.end) initX += deltaX;

            if(event.end){
                initX += deltaX;
                /*判断一下.nav滑动的距离  ， */
                if(initX >= 0){
                    initX = 0;
                    this.style.transition = "transform 0.4s cubic-bezier(.28,.19,.95,1.75)";
                    $(this).transform("translate3d", initX, 0, 0);
                }else if(initX < -this.offsetWidth + this.parentElement.offsetWidth){
                    initX =  -this.offsetWidth + this.parentElement.offsetWidth;
                    this.style.transition = "transform 0.4s cubic-bezier(.28,.19,.95,1.75)";
                    $(this).transform("translate3d", initX, 0, 0);
                }
            }
        });

    }
    // /*方法二：for循环  let */
    // function navHandle(){
    //     var activeIndex = 0;
    //     var lis = document.querySelectorAll(".nav li");
    //     for (let i = 0; i < lis.length; i++){
    //         $(lis[i]).tap(function (event){
    //             lis[activeIndex].classList.remove("active");
    //             this.classList.add("active");
    //             activeIndex = i;
    //         });
    //     }
    // }



    /*全屏滑动广告轮播图3 ( 指示器的切换样式：通过给一个元素i 设置好样式之后，大小形状等样式完全和指示器的span 的样式一样，除了颜色不一样之外，这里实效果：随着图片的切换，指示器相应的切换方式改成由小球i 跳动到对应的当前播放的图片的下标对应的指示器位置上。)
    * 指示器的切换逻辑写在手指结束接触移动的时候，是可以完成整体需要的效果，如上  全屏滑动广告轮播图2  代码所示：
    但是，按逻辑来说，需要跟符合逻辑思维的话 ，指示器的切换逻辑写在是应该写写在play方法中，如下 所示:
*/
    function lbt() {
        var spiders = document.querySelector('.spider_wrap .spiders');
        var spans = document.querySelectorAll('.indicator>span');
        var i = document.querySelector('.indicator>i');

        var startX,startiX;
        var w = window.innerWidth;
        var currentIndex = 0;// 声明变量存储下标值  // 默认显示第一张图片（1.jpg），默认显示第一张图片的时候下标为0
        var lastIndex = currentIndex;//需要声明一个变量去记录上一个span的样式状态，
        var id;

        $('.spiders').pan(function (event) {
            // this.style.transition = '';//清除transition过渡，除了可以在 一开始开头处清除
            if(event.start){
                clearInterval(id);
                startX = $(this).tx();
                startiX =$('.indicator>i').tx();
            }

            $(this).transform('translate3d',event.deltaX+startX);

            /*指示器实时随着轮播图的切换而做相应的切换（滚动）。*/
            $('.indicator>i').transform('translate3d',startiX - event.deltaX /w * disI );

            //判断手指移动图片距离决定图片向前移动还是向后移动还是原地不动(这个逻辑应该在手指停止移动做)
            if(event.end){
                autoPlay();
                // lastIndex = currentIndex;
                var i =Math.round( event.deltaX / w);//四舍五入 结果  -1  0  1
                currentIndex -= i;//这里获取当前 currentIndex
                // this.style.transition = 'transform 0.4s'; /*清除transition过渡，除了可以在 一开始开头处清除,还可以在过渡停止过渡结束的时候清除过渡。*/
                // $(this).transform('translate3d',i * w + startX);
                play();

            }


        });

        /*监视 过渡停止过渡结束的时候 事件*/
        spiders.addEventListener('transitionend',function () {
            this.style.transition = '';//过渡停止过渡结束的时候之后清除过渡
            i.style.transition = '';//过渡停止过渡结束的时候之后清除过渡

            /*手指拖动广告图，可以无限拖动（图片无缝衔接）*/
            if(currentIndex == -1){
                currentIndex = 4;
                $(this).transform('translate3d', - currentIndex * w);
            }else if(currentIndex == 5){
                currentIndex = 0;
                $(this).transform('translate3d', - currentIndex * w);
                // $(this).transform('translate3d', 0);//等价于上式
            }

            // /*指示器的切换样式方式二：通过给一个元素i 设置好样式之后，大小形状等样式完全和指示器的span 的样式一样，除了颜色不一样之外，这里实效果：随着图片的切换，指示器相应的切换方式改成由小球i 跳动到对应的当前播放的图片的下标对应的指示器位置上。*/
            // /*指示器的切换样式方式二：逻辑代码*/
            // i.style.transition = 'transform 0.4s';
            // $('.indicator>i').transform('translate3d', currentIndex * disI);/*不合理。放在过渡结束去做看看*/



            // /*指示器逻辑*/
            // //指示器  0-4
            // spans[lastIndex].classList.remove('active');//先清除上一个span的active类
            // spans[currentIndex].classList.add('active');// 再给选中的span(当前的)添加active类的样式

            lastIndex = currentIndex;//结束之后记录一下当前 currentIndex的值，存储在在 lastIndex为下一次  切换 做准备

        });

        /*自动轮播*/
        autoPlay();
        function autoPlay() {
            id = setInterval(function () {
                currentIndex++;
                play();
            },2000)
        }

        function play() {
            spiders.style.transition = 'transform 0.4s';
            $(spiders).transform('translate3d', - currentIndex * w);


            /* $(spiders).transform('translate3d', - currentIndex * w);为什么在play()这里的 轮播图的图片切换时合理的，
            但是 这里的指示器的切换$('.indicator>i').transform('translate3d', currentIndex * disI);不合理呢？
            因为轮播图的图片个数相对指示器的个数来说时多出两个的，由于轮播图的需要无缝轮播因此前后个加多一张图片。
            解决：
            i.style.transition = 'transform 0.4s';
            var j = currentIndex == -1 ? 4 : currentIndex;
            j = currentIndex == 5 ? 0 : currentIndex;
            $('.indicator>i').transform('translate3d', j * disI);
            * */

            /*全屏滑动广告轮播图3*/
            /*指示器的切换样式方式二2：通过给一个元素i 设置好样式之后，大小形状等样式完全和指示器的span 的样式一样，除了颜色不一样之外，这里实效果：随着图片的切换，指示器相应的切换方式改成由小球i 跳动到对应的当前播放的图片的下标对应的指示器位置上。*/
            /*指示器的切换样式方式二2：逻辑代码*/
            i.style.transition = 'transform 0.4s';
            var j = currentIndex == -1 ? 4 : currentIndex;
            j = currentIndex == 5 ? 0 : currentIndex;
            $('.indicator>i').transform('translate3d', j * disI);/*不合理。放在过渡结束去做看看*/

        }

        /*当手指接触屏幕的时候，停止轮播，当手指拖动图片结束（停止）手指离开的之后，继续自动轮播。*/



        /*指示器的切换样式方式二：通过给一个元素i 设置好样式之后，大小形状等样式完全和指示器的span 的样式一样，除了颜色不一样之外，这里实效果：随着图片的切换，指示器相应的切换方式改成由小球i 跳动到对应的当前播放的图片的下标对应的指示器位置上。*/
        initMoveI();
        var disI = spans[1].offsetLeft - spans[0].offsetLeft;//获取i元素每次移动的距离最小单位，（每次移动的距离差是一个固定值）
        function initMoveI() {

            var firstSpan = spans[0];//获取 第一个指示器的元素
            i.style.left = firstSpan.offsetLeft + 'px'; //元素 i  ，默认在第一个指示器的下标对应元素所在的位置上
        }


    }


    /*自定义滚动条，滚动页面内容*/
    function addScrollBar() {
        /*先把滚动条添加上去*/
        $('.content').scrollBar('#d300ff',4);

        var startY;
        $('.content').pan(function (event) {
/*            /!*滚动页面，如果手指移动的距离小于20，并且不是开始接触屏幕的状态 ，则不滑动。实现不了，问题没有解决，暂时不做此项功能限制*!/
            if(Math.abs(event.deltaX < 20) && !event.start) return ;*/

            if(event.start){
                this.style.transition = '';
                startY = $(this).ty();
            }
            $(this).transform('translate3d',0, event.deltaY + startY);

            if(event.end){
                var ty = $(this).ty();
                if(ty >= 0 ){
                    ty = 0;
                    this.style.transition = 'transform 0.4s';
                    $(this).transform('translate3d',0,ty);
                }else if(ty <= -(this.offsetHeight + 2.7 * size - this.parentElement.offsetHeight) ){
                    ty = -(this.offsetHeight + 2.7 * size - this.parentElement.offsetHeight);
                    this.style.transition = 'transform 0.4s';
                    $(this).transform('translate3d',0,ty);
                }
            }

        });
        
    }




    /*tab_content内容区 的逻辑*/
    
    /*tab_content内容区 1 --  滑动tab页面 */
/*
//可以拖动，1/2处判断是否在当前页面还是在上一页还是下一页。
//方法一：
    function tabChange() {
        var startX;
        var w = window.innerWidth;

        $('.tab_content').pan(function (event) {
            if(event.start){
                startX =  $(this).tx();
            }
            $(this).transform('translate3d',startX + event.deltaX);
            if(event.end){
                var x = Math.round( event.deltaX /w) * w + startX;
                $(this).transform('translate3d',x);
            }
        });
    }
*/

//可以拖动，1/2处判断是否在当前页面还是在上一页还是下一页。
//方法二：
    function tabChange() {
        var tabContent = document.querySelector('.tab_content');

        var startX;
        var w = window.innerWidth;
        var currentIndex =0;

        $('.tab_content').pan(function (event) {
            if(event.start){
                this.style.transition = '';
                startX =  $(this).tx();
            }
            $(this).transform('translate3d',startX + event.deltaX);
            if(event.end){
                this.style.transition = 'transform 0.4s';
                currentIndex += Math.round( event.deltaX /w) ;
                $(this).transform('translate3d',currentIndex * w);
                changeTabNav(Math.round( event.deltaX /w)); /*当左右滑动的时候，让tab_nav进行相应的跟随*/
            }
        });


        /*监听 过渡结束事件*/
        tabContent.addEventListener("transitionend", function (event){
            setTimeout(function (){
                currentIndex = 0;//每次
                tabContent.style.transition = "";
                $(tabContent).transform("translate3d", 0);
            }, 100);
        });

        /*当左右滑动的时候，让tab_nav进行相应的跟随*/
        function changeTabNav(dir) {
            if(dir == -1 ){//手指向左边滑动页面
                lastId ++;
                lastId = lastId >= 7 ? 1: lastId;
            }else if(dir == 1){//手指向右边滑动页面
                lastId --;
                lastId = lastId <= 0 ? 6: lastId;
            }
            //对应的tab_nav的样式被选中
            radios[lastId -1].checked = true;
        }

    }
    var lastId = 1 ;
    var radios = document.querySelectorAll('.tab_nav>input');

    /*tab_content内容区 2    -- 处理 tab 导航标签的事件 */
    function handleTabNav() {
        var radios = document.querySelectorAll('.tab_nav>input');
        var w = window.innerWidth;
        var lastId = 1 ;

        for(var i = 0; i < radios.length; i++){
            /*监听单选按钮的change事件*/
            radios[i].onchange = function (event) {
                var currentId = this.id;
                if(currentId > lastId){
                    $('.tab_content').transform('translate3d',-w).transition('transform 0.4s');
                }else {
                    $('.tab_content').transform('translate3d', w).transition('transform 0.4s');
                }
                lastId = currentId;
            }
        }

    }


})();

